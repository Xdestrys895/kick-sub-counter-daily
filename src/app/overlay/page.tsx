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
  const paramTitle = searchParams.get('title');
  const paramSound = searchParams.get('sound');
  const paramChannel = searchParams.get('channel');
  const paramTimezone = searchParams.get('tz');

  const [config, setConfig] = useState<StreamerConfig>(DEFAULT_CONFIG);
  const [stats, setStats] = useState<DailyStats>(() => createInitialDailyStats(20, 'Europe/Istanbul'));
  const [theme, setTheme] = useState<WidgetTheme>(() => getThemeById('kick-electric'));

  const deduplicatorRef = useRef(new EventDeduplicator(1000));
  const pusherListenerRef = useRef<KickPusherListener | null>(null);
  const lastCompletedRef = useRef(false);

  // Initialize and attach transparent overlay styles
  useEffect(() => {
    document.body.classList.add('overlay-mode');

    // 1. Load baseline config and stats
    const savedConfig = loadStreamerConfig();
    const effectiveGoal = paramGoal ? Math.max(1, parseInt(paramGoal, 10)) : savedConfig.dailyGoal;
    const effectiveTz = paramTimezone || savedConfig.timezone || 'Europe/Istanbul';
    const effectiveThemeId = paramTheme || savedConfig.selectedThemeId || 'kick-electric';

    const mergedConfig: StreamerConfig = {
      ...savedConfig,
      dailyGoal: effectiveGoal,
      selectedThemeId: effectiveThemeId,
      goalTitle: paramTitle || savedConfig.goalTitle || 'GÜNLÜK ABONE HEDEFİ',
      soundEnabled: paramSound !== null ? paramSound === '1' : savedConfig.soundEnabled,
      timezone: effectiveTz,
      channelSlug: paramChannel || savedConfig.channelSlug || 'oscoliat',
    };

    setConfig(mergedConfig);
    setTheme(getThemeById(effectiveThemeId));

    const initialStats = loadDailyStats(effectiveGoal, effectiveTz);
    setStats(initialStats);
    lastCompletedRef.current = initialStats.currentCount >= initialStats.targetGoal;

    // 2. Subscribe to EventBus (instant synchronization from Dashboard)
    const bus = EventBus.getInstance();
    const unsubscribe = bus.subscribe((msg) => {
      if (msg.type === 'STATS_UPDATE') {
        setStats(msg.payload);
      } else if (msg.type === 'CONFIG_UPDATE') {
        setConfig((prev) => ({ ...prev, ...msg.payload }));
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

    // 3. Optional Direct Kick Pusher Connection in overlay if channel provided
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

    // 4. Midnight Auto-Reset Interval Check
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
  }, [paramTheme, paramGoal, paramTitle, paramSound, paramChannel, paramTimezone, overlayInstanceId]);

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
    <div className="w-full h-screen p-4 flex items-start justify-start bg-transparent select-none overflow-hidden">
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
