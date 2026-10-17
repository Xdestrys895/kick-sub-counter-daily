'use client';

import React, { useEffect, useState, useRef, Suspense, useId } from 'react';
import { useSearchParams } from 'next/navigation';
import { DailyStats, GoalProgress, StreamerConfig, SubEvent, WidgetTheme } from '@/domain/types';
import { getThemeById } from '@/domain/themes';
import {
  applySubEvent,
  calculateGoalProgress,
  createInitialDailyStats,
  EventDeduplicator,
  isNewDay,
  playWebAudioTone,
} from '@/domain/counter-service';
import { DEFAULT_CONFIG, loadDailyStats, loadStreamerConfig, saveDailyStats } from '@/lib/storage';
import { EventBus } from '@/lib/event-bus';
import { ThemeRenderer } from '@/components/ThemeRenderer';
import { fireGoalCelebration, fireSubSparkle } from '@/components/ConfettiTrigger';
import { KickPusherListener } from '@/lib/kick-pusher';

function OverlayContent() {
  const searchParams = useSearchParams();
  const overlayInstanceId = useId();

  // Query parameter overrides
  const paramTheme = searchParams.get('theme');
  const paramGoal = searchParams.get('goal');
  const paramSound = searchParams.get('sound');
  const paramChannel = searchParams.get('channel');
  const paramTimezone = searchParams.get('tz');

  // Modular visibility overrides from URL
  const paramShowTitle = searchParams.get('title');
  const paramShowBar = searchParams.get('bar');
  const paramShowGoalNum = searchParams.get('goalnum');
  const paramShowPct = searchParams.get('pct');
  const paramShowRem = searchParams.get('rem');

  const [config, setConfig] = useState<StreamerConfig>(DEFAULT_CONFIG);
  const [stats, setStats] = useState<DailyStats>(() => createInitialDailyStats(20, 'Europe/Istanbul'));
  const [theme, setTheme] = useState<WidgetTheme>(() => getThemeById('kick-electric'));

  const deduplicatorRef = useRef(new EventDeduplicator(1000));
  const pusherListenerRef = useRef<KickPusherListener | null>(null);
  const lastCompletedRef = useRef(false);

  useEffect(() => {
    document.body.classList.add('overlay-mode');

    const savedConfig = loadStreamerConfig();
    const effectiveGoal = paramGoal ? Math.max(1, parseInt(paramGoal, 10)) : savedConfig.dailyGoal;
    const effectiveTz = paramTimezone || savedConfig.timezone || 'Europe/Istanbul';
    const effectiveThemeId = paramTheme || savedConfig.selectedThemeId || 'kick-electric';

    const mergedConfig: StreamerConfig = {
      ...savedConfig,
      dailyGoal: effectiveGoal,
      selectedThemeId: effectiveThemeId,
      soundEnabled: paramSound !== null ? paramSound === '1' : savedConfig.soundEnabled,
      timezone: effectiveTz,
      channelSlug: paramChannel || savedConfig.channelSlug || 'oscoliat',

      // Explicit URL overrides or fall back to saved config
      showTitle: paramShowTitle !== null ? paramShowTitle === '1' : savedConfig.showTitle,
      showProgressBar: paramShowBar !== null ? paramShowBar === '1' : savedConfig.showProgressBar,
      showGoalNumber: paramShowGoalNum !== null ? paramShowGoalNum === '1' : savedConfig.showGoalNumber,
      showPercentage: paramShowPct !== null ? paramShowPct === '1' : savedConfig.showPercentage,
      showRemaining: paramShowRem !== null ? paramShowRem === '1' : savedConfig.showRemaining,
    };

    setConfig(mergedConfig);
    setTheme(getThemeById(effectiveThemeId));

    const initialStats = loadDailyStats(effectiveGoal, effectiveTz);
    setStats(initialStats);
    lastCompletedRef.current = initialStats.currentCount >= initialStats.targetGoal;

    // Subscribe to EventBus
    const bus = EventBus.getInstance();
    const unsubscribe = bus.subscribe((msg) => {
      if (msg.type === 'STATS_UPDATE') {
        setStats(msg.payload);
      } else if (msg.type === 'CONFIG_UPDATE') {
        setConfig((prev) => ({
          ...prev,
          ...msg.payload,
          // Respect URL overrides if explicitly provided
          showTitle: paramShowTitle !== null ? paramShowTitle === '1' : msg.payload.showTitle,
          showProgressBar: paramShowBar !== null ? paramShowBar === '1' : msg.payload.showProgressBar,
          showGoalNumber: paramShowGoalNum !== null ? paramShowGoalNum === '1' : msg.payload.showGoalNumber,
          showPercentage: paramShowPct !== null ? paramShowPct === '1' : msg.payload.showPercentage,
          showRemaining: paramShowRem !== null ? paramShowRem === '1' : msg.payload.showRemaining,
        }));
        if (msg.payload.selectedThemeId && !paramTheme) {
          setTheme(getThemeById(msg.payload.selectedThemeId));
        }
      } else if (msg.type === 'SUB_EVENT') {
        handleIncomingSub(msg.payload, mergedConfig);
      } else if (msg.type === 'TEST_SUB') {
        const dummyEvent: SubEvent = {
          id: `test_${Date.now()}`,
          timestamp: Date.now(),
          type: msg.payload.isGift ? 'gift_purchase' : 'subscription',
          username: msg.payload.name || 'Destekçi',
          giftCount: msg.payload.count > 1 ? msg.payload.count : 0,
        };
        handleIncomingSub(dummyEvent, mergedConfig);
      } else if (msg.type === 'RESET_COUNTER') {
        const fresh = createInitialDailyStats(msg.payload.goal, msg.payload.timezone);
        setStats(fresh);
        lastCompletedRef.current = false;
      }
    }, overlayInstanceId);

    // Direct Pusher connection in standalone overlay
    if (mergedConfig.channelSlug && !pusherListenerRef.current) {
      fetch(`/api/kick/channel?slug=${encodeURIComponent(mergedConfig.channelSlug)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.channel?.channelId) {
            pusherListenerRef.current = new KickPusherListener({
              channelId: data.channel.channelId,
              chatroomId: data.channel.chatroomId,
              onSubEvent: (event) => handleIncomingSub(event, mergedConfig),
            });
            pusherListenerRef.current.connect();
          }
        })
        .catch(() => {});
    }

    // Midnight Auto-Reset Interval Check
    const midnightInterval = setInterval(() => {
      setStats((prevStats) => {
        if (isNewDay(prevStats.dateStr, mergedConfig.timezone)) {
          const fresh = createInitialDailyStats(mergedConfig.dailyGoal, mergedConfig.timezone);
          saveDailyStats(fresh);
          lastCompletedRef.current = false;
          return fresh;
        }
        return prevStats;
      });
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(midnightInterval);
      if (pusherListenerRef.current) {
        pusherListenerRef.current.disconnect();
      }
    };
  }, [
    paramTheme,
    paramGoal,
    paramSound,
    paramChannel,
    paramTimezone,
    paramShowTitle,
    paramShowBar,
    paramShowGoalNum,
    paramShowPct,
    paramShowRem,
    overlayInstanceId,
  ]);

  const handleIncomingSub = (event: SubEvent, activeConfig: StreamerConfig) => {
    if (deduplicatorRef.current.isDuplicate(event.id)) {
      return;
    }

    let updatedStats: DailyStats | null = null;
    setStats((prev) => {
      const next = applySubEvent(prev, event);
      saveDailyStats(next);
      updatedStats = next;
      return next;
    });

    if (updatedStats) {
      const currentStats = updatedStats as DailyStats;
      const wasCompleted = lastCompletedRef.current;
      const isNowCompleted = currentStats.currentCount >= currentStats.targetGoal;

      if (!wasCompleted && isNowCompleted) {
        fireGoalCelebration();
        lastCompletedRef.current = true;
      } else {
        fireSubSparkle();
      }

      if (activeConfig.soundEnabled) {
        const activeTheme = getThemeById(activeConfig.selectedThemeId);
        playWebAudioTone(activeTheme.soundPreset, activeConfig.soundVolume);
      }
    }
  };

  const progress: GoalProgress = calculateGoalProgress(stats.currentCount, stats.targetGoal);

  return (
    <div className="w-full h-screen p-3 flex items-start justify-start bg-transparent select-none overflow-hidden">
      <ThemeRenderer
        theme={theme}
        stats={stats}
        progress={progress}
        config={config}
        isOverlay={true}
      />
    </div>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<div className="bg-transparent" />}>
      <OverlayContent />
    </Suspense>
  );
}
