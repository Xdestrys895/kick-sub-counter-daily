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
import { Activity, ExternalLink, Sparkles, TrendingUp, Users, Award, CheckCircle } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const componentInstanceId = useId();

  // State
  const [config, setConfig] = useState<StreamerConfig>(DEFAULT_CONFIG);
  const [stats, setStats] = useState<DailyStats>(() => createInitialDailyStats(20, 'Europe/Istanbul'));
  const [theme, setTheme] = useState<WidgetTheme>(() => getThemeById('kick-electric'));
  const [connectionState, setConnectionState] = useState<PusherConnectionState>('disconnected');
  const [channelDetails, setChannelDetails] = useState<KickChannelDetails | null>(null);
  const [recentEvents, setRecentEvents] = useState<SubEvent[]>([]);

  const deduplicatorRef = useRef(new EventDeduplicator(1000));
  const pusherListenerRef = useRef<KickPusherListener | null>(null);
  const lastCompletedRef = useRef(false);

  // Initialize
  useEffect(() => {
    const savedConfig = loadStreamerConfig();

    // Default to 'oscoliat' if no channel entered yet
    if (!savedConfig.channelSlug) {
      savedConfig.channelSlug = 'oscoliat';
    }

    // Check if redirected from Kick OAuth login
    const kickLogin = searchParams.get('kick_login');
    const kickUserParam = searchParams.get('username');
    const kickUserId = searchParams.get('user_id');
    const kickPic = searchParams.get('pic');

    if (kickLogin === 'success' && kickUserParam) {
      const user: KickUser = {
        id: kickUserId || '0',
        username: kickUserParam,
        slug: kickUserParam.toLowerCase(),
        profilePic: kickPic || undefined,
      };
      savedConfig.kickUser = user;
      savedConfig.channelSlug = user.slug;
      saveStreamerConfig(savedConfig);
    }

    setConfig(savedConfig);
    setTheme(getThemeById(savedConfig.selectedThemeId));

    const initialStats = loadDailyStats(savedConfig.dailyGoal, savedConfig.timezone);
    setStats(initialStats);
    lastCompletedRef.current = initialStats.currentCount >= initialStats.targetGoal;

    // Connect to Kick channel
    connectToKickChannel(savedConfig.channelSlug);

    // Subscribe to EventBus with our componentInstanceId to avoid self-echoes
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

      // Update config
      const updatedConfig = {
        ...config,
        channelSlug: channel.slug,
        kickUser: channel,
      };
      setConfig(updatedConfig);
      saveStreamerConfig(updatedConfig);

      // Start Pusher connection
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

    // Execute side effects safely outside state update
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

    setRecentEvents((prev) => [event, ...prev.slice(0, 19)]);
  };

  const handleSimulateSub = (count: number, isGift?: boolean, name?: string) => {
    const dummyEvent: SubEvent = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type: isGift ? 'gift_purchase' : 'subscription',
      username: name || (isGift ? 'Cömert Destekçi' : 'Yeni Abone'),
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
    <main className="min-h-screen bg-kick-darker text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-kick-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black border-2 border-kick-green flex items-center justify-center font-black text-kick-green text-2xl shadow-[0_0_20px_rgba(83,252,24,0.4)]">
              K
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                Kick Günlük Abone Sayacı
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-kick-green text-black uppercase">
                  v1.0 Canlı
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Kick.com yayıncıları için gerçek zamanlı sayaç, hedef çubuğu ve OBS canlı overlay sistemi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/overlay"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-kick-green hover:bg-[#46d614] text-black font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(83,252,24,0.3)] transition-all"
            >
              <ExternalLink className="w-4 h-4" /> OBS Canlı Penceresini Aç
            </a>
          </div>
        </header>

        {/* Live Counter Hero Showcase & Stat Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Live Preview Display */}
          <div className="lg:col-span-7 bg-kick-card border border-kick-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-zinc-800 rounded-full text-[11px] font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-kick-green animate-pulse" />
              CANLI ÖNİZLEME ({theme.nameTr})
            </div>

            <div className="mb-6">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Yayın Ekranındaki Görünüm:
              </span>
              <p className="text-xs text-zinc-500">
                Aşağıdaki widget doğrudan OBS Browser Source içine yansıtılır.
              </p>
            </div>

            {/* The Live Rendered Widget */}
            <div className="flex justify-center items-center py-4">
              <ThemeRenderer
                theme={theme}
                stats={stats}
                progress={progress}
                config={config}
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-kick-card border border-kick-border rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Bugün Gelen</span>
                <Users className="w-4 h-4 text-kick-green" />
              </div>
              <div className="text-3xl font-black text-white">{stats.currentCount}</div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                {stats.directCount} doğrudan • {stats.giftCount} hediye
              </span>
            </div>

            <div className="bg-kick-card border border-kick-border rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Günlük Hedef</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white">{stats.targetGoal}</div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                {stats.timezone.split('/')[1] || stats.timezone} saati ile
              </span>
            </div>

            <div className="bg-kick-card border border-kick-border rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Hedefe Kalan</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {progress.remaining}
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                {progress.isCompleted ? 'Hedefe ulaşıldı!' : 'Yeni abone bekleniyor'}
              </span>
            </div>

            <div className="bg-kick-card border border-kick-border rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">İlerleme Oranı</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-kick-green">
                %{progress.percentage}
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                {progress.isCompleted ? 'Tebrikler! 🎉' : 'Devam ediyor'}
              </span>
            </div>
          </div>
        </div>

        {/* Kick Account Connection Card */}
        <KickLoginCard
          user={channelDetails}
          connectionState={connectionState}
          onConnectChannel={connectToKickChannel}
          onDisconnect={handleDisconnect}
        />

        {/* Live Simulator & Manual Override Toolbar */}
        <SimulatorControls
          stats={stats}
          onAddSub={handleSimulateSub}
          onDecrement={handleDecrement}
          onReset={handleReset}
        />

        {/* OBS URL Generator & Setup Instructions */}
        <ObsUrlGenerator config={config} />

        {/* 15 Theme Selector Grid */}
        <ThemeSelector
          selectedThemeId={config.selectedThemeId}
          onSelectTheme={handleSelectTheme}
        />

        {/* Streamer Settings Panel */}
        <StreamerSettings
          config={config}
          onChangeConfig={handleConfigChange}
        />

        {/* Recent Subscriber Activity Feed */}
        {recentEvents.length > 0 && (
          <div className="bg-kick-card border border-kick-border rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-kick-green" />
              Bugünün Abone Akışı ({recentEvents.length})
            </h3>
            <div className="divide-y divide-zinc-800">
              {recentEvents.map((evt) => (
                <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{evt.username}</span>
                    {evt.giftCount > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                        🎁 {evt.giftCount} Hediye Abone
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        Abone Oldu
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-500 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="pt-8 pb-12 text-center text-xs text-zinc-500 border-t border-kick-border">
          <p>
            Kick Sub Counter Daily • Modern Streamer Overlay Suite • Designed for OBS Studio & Kick.com
          </p>
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
