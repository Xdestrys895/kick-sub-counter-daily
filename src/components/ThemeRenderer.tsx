'use client';

import React from 'react';
import { DailyStats, GoalProgress, StreamerConfig, WidgetTheme } from '@/domain/types';
import { Sparkles } from 'lucide-react';

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
}) => {
  const isGoalReached = progress.isCompleted;

  // Defaults for modularity (only minimal counter by default)
  const showTitle = Boolean(config.showTitle);
  const showGoalNumber = config.showGoalNumber !== false;
  const showProgressBar = Boolean(config.showProgressBar);
  const showPercentage = Boolean(config.showPercentage);
  const showRemaining = Boolean(config.showRemaining);
  const showRecentSub = Boolean(config.showRecentSub && stats.lastSubName);

  // Compact Pill Special Theme
  if (theme.id === 'compact-streamer-pill') {
    return (
      <div className={`relative select-none inline-flex items-center gap-3 ${theme.styles.container}`}>
        {showTitle && (
          <span className={theme.styles.title}>{config.goalTitle || 'HEDEF'}</span>
        )}

        <div className="flex items-baseline gap-1 font-bold">
          <span className={theme.styles.counterText}>{stats.currentCount}</span>
          {showGoalNumber && (
            <span className={theme.styles.goalText}>/ {stats.targetGoal}</span>
          )}
        </div>

        {showProgressBar && (
          <div className={theme.styles.progressTrack}>
            <div
              className={theme.styles.progressFill}
              style={{ width: `${Math.min(100, Math.max(2, progress.percentage))}%` }}
            />
          </div>
        )}

        {showPercentage && (
          <span className={theme.styles.badge}>{progress.percentage}%</span>
        )}
      </div>
    );
  }

  // Matrix Terminal Special Theme
  if (theme.id === 'matrix-terminal') {
    const totalBlocks = 16;
    const filledBlocks = Math.round((progress.percentage / 100) * totalBlocks);
    const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, totalBlocks - filledBlocks));

    return (
      <div className={`relative select-none inline-block ${theme.styles.container}`}>
        {/* Optional Header Row */}
        {(showTitle || showPercentage) && (
          <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-green-900/50">
            {showTitle && <div className={theme.styles.title}>{config.goalTitle || 'SUB_COUNTER'}</div>}
            {showPercentage && <span className={theme.styles.badge}>[{progress.percentage}%]</span>}
          </div>
        )}

        {/* Counter Row */}
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className={theme.styles.counterText}>{stats.currentCount}</span>
            {showGoalNumber && <span className={theme.styles.goalText}>/ {stats.targetGoal}</span>}
          </div>

          {showRemaining && (
            <span className={theme.styles.statsText}>
              {isGoalReached ? '[TAMAM]' : `[KALAN: ${progress.remaining}]`}
            </span>
          )}
        </div>

        {/* Optional ASCII Progress Bar */}
        {showProgressBar && (
          <div className="mt-2 p-1 bg-black/90 border border-green-800 text-green-400 font-mono text-[11px] tracking-wider">
            [{asciiBar}]
          </div>
        )}

        {/* Optional Recent Sub */}
        {showRecentSub && stats.lastSubName && (
          <div className="mt-1.5 text-[10px] text-green-500/70 font-mono truncate">
            &gt; SON: {stats.lastSubName}
          </div>
        )}
      </div>
    );
  }

  // Standard Minimal & Clean Widget Layout
  return (
    <div
      className={`relative select-none transition-all duration-300 inline-block ${theme.styles.container} ${
        !showProgressBar && !showTitle && !showRecentSub ? 'p-3 sm:p-4' : ''
      }`}
      style={{ minWidth: showProgressBar ? '260px' : 'auto' }}
    >
      {/* Goal Celebration Badge */}
      {isGoalReached && (
        <div className="absolute -top-2.5 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider animate-bounce z-10">
          <Sparkles className="w-2.5 h-2.5" /> TAMAMLANDI!
        </div>
      )}

      {/* Optional Title & Percentage Header */}
      {(showTitle || showPercentage) && (
        <div className="flex items-center justify-between gap-3 mb-1.5">
          {showTitle && (
            <div className={theme.styles.title}>
              <span>{config.goalTitle || 'GÜNLÜK HEDEF'}</span>
            </div>
          )}

          {showPercentage && (
            <div className={`${theme.styles.badge} ml-auto`}>
              %{progress.percentage}
            </div>
          )}
        </div>
      )}

      {/* Main Counter Display (Big, Bold, Clean) */}
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className={theme.styles.counterText}>
            {stats.currentCount}
          </span>
          {showGoalNumber && (
            <span className={theme.styles.goalText}>
              / {stats.targetGoal}
            </span>
          )}
        </div>

        {showRemaining && (
          <div className={theme.styles.statsText}>
            {isGoalReached ? 'Hedef Bitti 🎉' : `${progress.remaining} kaldı`}
          </div>
        )}
      </div>

      {/* Optional Smooth Animated Progress Bar */}
      {showProgressBar && (
        <div className={`mt-2 ${theme.styles.progressTrack}`}>
          <div
            className={theme.styles.progressFill}
            style={{ width: `${Math.min(100, Math.max(2, progress.percentage))}%` }}
          />
        </div>
      )}

      {/* Optional Recent Sub Footer */}
      {showRecentSub && stats.lastSubName && (
        <div className="mt-2 pt-1.5 border-t border-white/10 text-[10px] text-zinc-400 truncate">
          Son Abone: <strong className="text-white font-semibold">{stats.lastSubName}</strong>
        </div>
      )}
    </div>
  );
};
