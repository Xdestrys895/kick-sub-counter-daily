'use client';

import React, { useEffect, useState, useRef, Suspense, useId } from 'react';
import { useSearchParams } from 'next/navigation';
import { DailyStats, GoalProgress, KickUser, StreamerConfig, SubEvent, WidgetTheme } from '@/domain/types';
import { getThemeById } from '@/domain/themes';
import {
  applySubEvent,
  calculateGoalProgress,
  createInitialDailyStats,
  EventDeduplicator,
  isNewDay,
  playWebAudioTone,
} from '@/domain/counter-service';
import {
  DEFAULT_CONFIG,
  loadDailyStats,
  loadStreamerConfig,
  resetDailyStats,
  saveDailyStats,
  saveStreamerConfig,
} from '@/lib/storage';
import { EventBus } from '@/lib/event-bus';
import { KickPusherListener, PusherConnectionState } from '@/lib/kick-pusher';
import { ThemeRenderer } from '@/components/ThemeRenderer';
import { ThemeSelector } from '@/components/ThemeSelector';
import { KickLoginCard } from '@/components/KickLoginCard';
import { StreamerSettings } from '@/components/StreamerSettings';
import { SimulatorControls } from '@/components/SimulatorControls';
import { ObsUrlGenerator } from '@/components/ObsUrlGenerator';
import { fireGoalCelebration, fireSubSparkle } from '@/components/ConfettiTrigger';
import { KickChannelDetails } from '@/lib/kick-api';
import { ExternalLink } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const componentInstanceId = useId();

  // State
  const [config, setConfig] = useState<StreamerConfig>(DEFAULT_CONFIG);
  const [stats, setStats] = useState<DailyStats>(() => createInitialDailyStats(20, 'Europe/Istanbul'));
  const [theme, setTheme] = useState<WidgetTheme>(() => getThemeById('kick-electric'));
  const [connectionState, setConnectionState] = useState<PusherConnectionState>('disconnected');
  const [channelDetails, setChannelDetails] = useState<KickChannelDetails | null>(null);

  const deduplicatorRef = useRef(new EventDeduplicator(1000));
  const pusherListenerRef = useRef<KickPusherListener | null>(null);
  const lastCompletedRef = useRef(false);

  // Initialize
  useEffect(() => {
    const savedConfig = loadStreamerConfig();

    if (!savedConfig.channelSlug) {
      savedConfig.channelSlug = 'oscoliat';
    }

    setConfig(savedConfig);
    setTheme(getThemeById(savedConfig.selectedThemeId));

    const initialStats = loadDailyStats(savedConfig.dailyGoal, savedConfig.timezone);
    setStats(initialStats);
    lastCompletedRef.current = initialStats.currentCount >= initialStats.targetGoal;

    // Connect to Kick channel
    connectToKickChannel(savedConfig.channelSlug);

    // Subscribe to EventBus
    const bus = EventBus.getInstance();
    const unsub = bus.subscribe((msg) => {
      if (msg.type === 'STATS_UPDATE') {
        setStats(msg.payload);
      }
    }, componentInstanceId);

    // Midnight Auto-Reset Interval Check
    const midnightInterval = setInterval(() => {
      setStats((prev) => {
        if (isNewDay(prev.dateStr, savedConfig.timezone)) {
          const fresh = createInitialDailyStats(savedConfig.dailyGoal, savedConfig.timezone);
          saveDailyStats(fresh);
          bus.publish({ type: 'STATS_UPDATE', payload: fresh }, componentInstanceId);
          lastCompletedRef.current = false;
          return fresh;
        }
        return prev;
      });
    }, 30000);

    return () => {
      unsub();
      clearInterval(midnightInterval);
      if (pusherListenerRef.current) {
        pusherListenerRef.current.disconnect();
      }
    };
  }, [searchParams, componentInstanceId]);

  const connectToKickChannel = async (channelInput: string) => {
    if (!channelInput) return false;

    setConnectionState('connecting');

    try {
      const res = await fetch(`/api/kick/channel?slug=${encodeURIComponent(channelInput)}`);
      if (!res.ok) {
        setConnectionState('error');
        return false;
      }

      const data = await res.json();
      const channel: KickChannelDetails = data.channel;

      setChannelDetails(channel);

      const updatedConfig = {
        ...config,
        channelSlug: channel.slug,
        kickUser: channel,
      };
      setConfig(updatedConfig);
      saveStreamerConfig(updatedConfig);

      if (pusherListenerRef.current) {
        pusherListenerRef.current.disconnect();
      }

      pusherListenerRef.current = new KickPusherListener({
        channelId: channel.channelId || channel.id,
        chatroomId: channel.chatroomId,
        onSubEvent: (evt) => handleIncomingSubEvent(evt),
        onStateChange: (st) => setConnectionState(st),
      });

      pusherListenerRef.current.connect();
      setConnectionState('connected');
      return true;
    } catch (err) {
      console.error('Kick connection error:', err);
      setConnectionState('error');
      return false;
    }
  };

  const handleIncomingSubEvent = (event: SubEvent) => {
    if (deduplicatorRef.current.isDuplicate(event.id)) {
      return;
    }

    let updatedStats: DailyStats | null = null;
    setStats((prev) => {
      const nextStats = applySubEvent(prev, event);
      saveDailyStats(nextStats);
      updatedStats = nextStats;
      return nextStats;
    });

    if (updatedStats) {
      const currentStats = updatedStats as DailyStats;
      EventBus.getInstance().publish({ type: 'SUB_EVENT', payload: event }, componentInstanceId);
      EventBus.getInstance().publish({ type: 'STATS_UPDATE', payload: currentStats }, componentInstanceId);

      const wasCompleted = lastCompletedRef.current;
      const isNowCompleted = currentStats.currentCount >= currentStats.targetGoal;

      if (!wasCompleted && isNowCompleted) {
        fireGoalCelebration();
        lastCompletedRef.current = true;
      } else {
        fireSubSparkle();
      }

      if (config.soundEnabled) {
        playWebAudioTone(theme.soundPreset, config.soundVolume);
      }
    }
  };

  const handleSimulateSub = (count: number, isGift?: boolean, name?: string) => {
    const dummyEvent: SubEvent = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type: isGift ? 'gift_purchase' : 'subscription',
      username: name || (isGift ? 'Destekçi' : 'Yeni Abone'),
      giftCount: isGift ? count : 0,
    };
    handleIncomingSubEvent(dummyEvent);
  };

  const handleDecrement = () => {
    let updatedStats: DailyStats | null = null;
    setStats((prev) => {
      if (prev.currentCount <= 0) return prev;
      const next = { ...prev, currentCount: prev.currentCount - 1 };
      saveDailyStats(next);
      updatedStats = next;
      return next;
    });

    if (updatedStats) {
      EventBus.getInstance().publish({ type: 'STATS_UPDATE', payload: updatedStats }, componentInstanceId);
    }
  };

  const handleReset = () => {
    const fresh = resetDailyStats(config.dailyGoal, config.timezone);
    setStats(fresh);
    lastCompletedRef.current = false;
    EventBus.getInstance().publish(
      { type: 'RESET_COUNTER', payload: { goal: config.dailyGoal, timezone: config.timezone } },
      componentInstanceId
    );
    EventBus.getInstance().publish({ type: 'STATS_UPDATE', payload: fresh }, componentInstanceId);
  };

  const handleConfigChange = (newConfigPartial: Partial<StreamerConfig>) => {
    const updated = { ...config, ...newConfigPartial };
    setConfig(updated);
    saveStreamerConfig(updated);

    if (newConfigPartial.dailyGoal && newConfigPartial.dailyGoal !== stats.targetGoal) {
      const updatedStats = { ...stats, targetGoal: newConfigPartial.dailyGoal };
      setStats(updatedStats);
      saveDailyStats(updatedStats);
      EventBus.getInstance().publish({ type: 'STATS_UPDATE', payload: updatedStats }, componentInstanceId);
    }

    EventBus.getInstance().publish({ type: 'CONFIG_UPDATE', payload: updated }, componentInstanceId);
  };

  const handleSelectTheme = (newTheme: WidgetTheme) => {
    setTheme(newTheme);
    handleConfigChange({ selectedThemeId: newTheme.id });
  };

  const handleDisconnect = () => {
    if (pusherListenerRef.current) {
      pusherListenerRef.current.disconnect();
      pusherListenerRef.current = null;
    }
    const updated = { ...config, kickUser: null, channelSlug: '' };
    setConfig(updated);
    setChannelDetails(null);
    saveStreamerConfig(updated);
    setConnectionState('disconnected');
  };

  const progress: GoalProgress = calculateGoalProgress(stats.currentCount, stats.targetGoal);

  const statusLabel: Record<PusherConnectionState, string> = {
    connected: 'Canlı',
    connecting: 'Bağlanıyor',
    disconnected: 'Bağlı değil',
    error: 'Hata',
  };
  const statusDot: Record<PusherConnectionState, string> = {
    connected: 'bg-accent',
    connecting: 'bg-amber-400 animate-pulse',
    disconnected: 'bg-zinc-500',
    error: 'bg-red-500',
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-base/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-black text-black">
              K
            </div>
            <span className="text-sm font-semibold">Abone Sayacı</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-line px-2.5 py-1 text-xs text-muted sm:inline-flex">
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot[connectionState]}`} />
              {statusLabel[connectionState]}
            </span>
            <a
              href="/overlay"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-raised px-3 text-xs font-medium hover:border-line-strong"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Overlay
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Stage */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <section className="overflow-hidden rounded-2xl border border-line">
            <div className="stage-grid flex min-h-[260px] items-center justify-center p-8">
              <ThemeRenderer theme={theme} stats={stats} progress={progress} config={config} />
            </div>
            <div className="flex items-center justify-between border-t border-line bg-surface px-4 py-2.5 text-xs text-muted">
              <span>Önizleme · {theme.nameTr}</span>
              <span className="font-mono">{stats.dateStr}</span>
            </div>
          </section>

          <section className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface">
            {[
              { label: 'Bugün', value: stats.currentCount },
              { label: 'Kalan', value: progress.remaining },
              { label: 'İlerleme', value: `%${Math.round(progress.percentage)}` },
            ].map((s) => (
              <div key={s.label} className="px-4 py-3.5">
                <p className="text-xs text-muted">{s.label}</p>
                <p className="mt-1 font-mono text-xl font-semibold tabular-nums">{s.value}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-line bg-surface p-4">
            <p className="mb-3 text-xs text-muted">Test</p>
            <SimulatorControls
              stats={stats}
              onAddSub={handleSimulateSub}
              onDecrement={handleDecrement}
              onReset={handleReset}
            />
          </section>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <KickLoginCard
            user={channelDetails}
            connectionState={connectionState}
            onConnectChannel={connectToKickChannel}
            onDisconnect={handleDisconnect}
          />
          <ObsUrlGenerator config={config} />
          <StreamerSettings config={config} onChangeConfig={handleConfigChange} />
          <ThemeSelector selectedThemeId={config.selectedThemeId} onSelectTheme={handleSelectTheme} />
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <DashboardContent />
    </Suspense>
  );
}
