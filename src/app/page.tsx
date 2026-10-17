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
import { ExternalLink, Palette, Sparkles, Sliders } from 'lucide-react';

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

  return (
    <main className="min-h-screen bg-kick-darker text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Minimal Clean Header */}
        <header className="flex items-center justify-between pb-4 border-b border-kick-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black border border-kick-green flex items-center justify-center font-black text-kick-green text-lg shadow-[0_0_10px_rgba(83,252,24,0.3)]">
              K
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Kick Günlük Abone Sayacı
                <span className="w-2 h-2 rounded-full bg-kick-green animate-pulse" />
              </h1>
            </div>
          </div>

          <a
            href="/overlay"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 bg-kick-green hover:bg-[#46d614] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-[0_0_12px_rgba(83,252,24,0.3)] transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" /> OBS Canlı Penceresi
          </a>
        </header>

        {/* Kick Connection Bar */}
        <KickLoginCard
          user={channelDetails}
          connectionState={connectionState}
          onConnectChannel={connectToKickChannel}
          onDisconnect={handleDisconnect}
        />

        {/* Live Widget Showcase (Focused & Clean) */}
        <div className="bg-kick-card border border-kick-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[170px]">
          <div className="absolute top-3 left-4 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Canlı Önizleme ({theme.nameTr})
          </div>

          <div className="py-2">
            <ThemeRenderer
              theme={theme}
              stats={stats}
              progress={progress}
              config={config}
            />
          </div>
        </div>

        {/* Simulator Toolbar & OBS URL Generator */}
        <div className="space-y-4">
          <SimulatorControls
            stats={stats}
            onAddSub={handleSimulateSub}
            onDecrement={handleDecrement}
            onReset={handleReset}
          />

          <ObsUrlGenerator config={config} />
        </div>

        {/* Modular Appearance Settings (Sadece Sayaç veya Detaylar) */}
        <StreamerSettings
          config={config}
          onChangeConfig={handleConfigChange}
        />

        {/* Theme Selector (15 Seçenek) */}
        <ThemeSelector
          selectedThemeId={config.selectedThemeId}
          onSelectTheme={handleSelectTheme}
        />

        {/* Clean Footer */}
        <footer className="pt-6 pb-8 text-center text-xs text-zinc-600 border-t border-kick-border">
          <p>Kick Daily Sub Counter • Minimalist Streamer Suite</p>
        </footer>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-kick-darker text-white p-8">Yükleniyor...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
