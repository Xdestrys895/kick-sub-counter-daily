'use client';

import React from 'react';
import { DailyStats, GoalProgress, StreamerConfig, WidgetTheme } from '@/domain/types';
import { Flame, Sparkles, Trophy, Zap, Terminal, Shield, Star, Crown, Heart, Gamepad2, Layers } from 'lucide-react';

interface ThemeRendererProps {
  theme: WidgetTheme;
  stats: DailyStats;
  progress: GoalProgress;
  config: Partial<StreamerConfig>;
  isOverlay?: boolean;
}

export const ThemeRenderer: React.FC<ThemeRendererProps> = ({
  theme,
  stats,
  progress,
  config,
  isOverlay = false,
}) => {
  const isGoalReached = progress.isCompleted;

  // Render thematic icon based on theme category and ID
  const renderThemeIcon = () => {
    switch (theme.id) {
      case 'kick-electric':
        return (
          <span className="w-2.5 h-2.5 rounded-full bg-[#53FC18] animate-ping inline-block mr-1" />
        );
      case 'cyberpunk-neon':
        return <Zap className="w-4 h-4 text-[#ff007f] animate-pulse" />;
      case 'retro-arcade-8bit':
        return <Gamepad2 className="w-4 h-4 text-[#fbbf24]" />;
      case 'tactical-esports-hud':
        return <Shield className="w-3.5 h-3.5 text-cyan-400" />;
      case 'royal-gold-vip':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'lofi-pastel-cozy':
        return <Heart className="w-3.5 h-3.5 text-pink-300 fill-pink-300" />;
      case 'inferno-lava':
        return <Flame className="w-4 h-4 text-orange-500 animate-bounce" />;
      case 'matrix-terminal':
        return <Terminal className="w-3.5 h-3.5 text-green-400" />;
      default:
        return <Trophy className="w-4 h-4 opacity-80" />;
    }
  };

  // Compact Pill Theme (Special horizontal single-row layout)
  if (theme.id === 'compact-streamer-pill') {
    return (
      <div className={`relative select-none ${theme.styles.container}`}>
        <div className="flex items-center gap-2">
          {renderThemeIcon()}
          <span className={theme.styles.title}>{config.goalTitle || 'GÜNLÜK HEDEF'}</span>
        </div>

        <div className="flex items-center gap-1.5 font-bold">
          <span className={theme.styles.counterText}>{stats.currentCount}</span>
          <span className={theme.styles.goalText}>/ {stats.targetGoal}</span>
        </div>

        <div className={theme.styles.progressTrack}>
          <div
            className={theme.styles.progressFill}
            style={{ width: `${Math.min(100, progress.percentage)}%` }}
          />
        </div>

        <span className={theme.styles.badge}>{progress.percentage}%</span>
      </div>
    );
  }

  // Matrix Terminal Theme (ASCII bracket progress bar)
  if (theme.id === 'matrix-terminal') {
    const totalBlocks = 18;
    const filledBlocks = Math.round((progress.percentage / 100) * totalBlocks);
    const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, totalBlocks - filledBlocks));

    return (
      <div className={`relative select-none ${theme.styles.container} min-w-[340px] max-w-[460px]`}>
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-green-900/60">
          <div className={theme.styles.title}>
            {config.goalTitle || 'SYS.DAILY_SUB_GOAL'}
          </div>
          <span className={theme.styles.badge}>[{progress.percentage}%]</span>
        </div>

        <div className="flex items-baseline justify-between my-2">
          <div className="flex items-baseline gap-2">
            <span className={theme.styles.counterText}>{String(stats.currentCount).padStart(2, '0')}</span>
            <span className={theme.styles.goalText}>/ {stats.targetGoal}</span>
          </div>
          <div className={theme.styles.statsText}>
            {isGoalReached ? 'STATUS: TARGET REACHED' : `REMAINING: ${progress.remaining}`}
          </div>
        </div>

        {/* ASCII Monospace Progress */}
        <div className="my-2 p-1.5 bg-black/90 border border-green-800 text-green-400 font-mono text-xs tracking-wider">
          [{asciiBar}]
        </div>

        {/* Terminal Sub-Log */}
        {config.showRecentSub && stats.lastSubName && (
          <div className="mt-2 text-[10px] text-green-500/70 font-mono truncate">
            &gt; LAST_DONOR: {stats.lastSubName}
          </div>
        )}
      </div>
    );
  }

  // Standard Rich Card Themes (13 Other Visual Themes)
  return (
    <div
      className={`relative select-none transition-all duration-300 min-w-[320px] max-w-[460px] ${theme.styles.container}`}
    >
      {/* Goal Reached Sparkle Effect */}
      {isGoalReached && (
        <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider animate-bounce z-10">
          <Sparkles className="w-3 h-3" /> HEDEF TAMAMLANDI!
        </div>
      )}

      {/* Header Row: Title & Percentage Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className={theme.styles.title}>
          {renderThemeIcon()}
          <span>{config.goalTitle || 'GÜNLÜK ABONE HEDEFİ'}</span>
        </div>

        {config.showPercentage !== false && (
          <div className={theme.styles.badge}>
            %{progress.percentage}
          </div>
        )}
      </div>

      {/* Main Counter Display */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className={theme.styles.counterText}>
            {stats.currentCount}
          </span>
          <span className={theme.styles.goalText}>
            / {stats.targetGoal}
          </span>
        </div>

        {config.showRemaining !== false && (
          <div className={theme.styles.statsText}>
            {isGoalReached ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> Tamamlandı!
              </span>
            ) : (
              <span>{progress.remaining} abone kaldı</span>
            )}
          </div>
        )}
      </div>

      {/* Animated Progress Bar */}
      <div className={theme.styles.progressTrack}>
        <div
          className={theme.styles.progressFill}
          style={{ width: `${Math.min(100, Math.max(2, progress.percentage))}%` }}
        />
      </div>

      {/* Footer Info: Recent Sub & Gifts */}
      {config.showRecentSub && (
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px]">
          <div className="truncate max-w-[200px] text-zinc-400">
            {stats.lastSubName ? (
              <span>
                Son Abone: <strong className="text-white font-semibold">{stats.lastSubName}</strong>
              </span>
            ) : (
              <span className="italic opacity-60">İlk abone bekleniyor...</span>
            )}
          </div>

          <div className="text-zinc-500 font-mono text-[10px]">
            {stats.giftCount > 0 && <span>🎁 {stats.giftCount} Hediye</span>}
          </div>
        </div>
      )}
    </div>
  );
};
