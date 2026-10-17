'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Video } from 'lucide-react';
import { StreamerConfig } from '@/domain/types';

interface ObsUrlGeneratorProps {
  config: StreamerConfig;
}

export const ObsUrlGenerator: React.FC<ObsUrlGeneratorProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  // Build parameterized URL matching user's exact modular toggles
  const query = new URLSearchParams({
    theme: config.selectedThemeId,
    goal: String(config.dailyGoal),
    sound: config.soundEnabled ? '1' : '0',
    title: config.showTitle ? '1' : '0',
    bar: config.showProgressBar ? '1' : '0',
    goalnum: config.showGoalNumber ? '1' : '0',
    pct: config.showPercentage ? '1' : '0',
    rem: config.showRemaining ? '1' : '0',
    tz: config.timezone,
  });

  if (config.channelSlug) {
    query.set('channel', config.channelSlug);
  }

  const overlayUrl = `${origin}/overlay?${query.toString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-kick-card border border-kick-border rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">
            OBS Studio Canlı Tarayıcı (Browser Source) Linki
          </h3>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono">
          Boyut: 400x120px • Şeffaf Arka Plan
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="flex-1 bg-black/70 border border-zinc-700/80 rounded-xl px-3 py-2 font-mono text-xs text-zinc-300 truncate select-all flex items-center">
          {overlayUrl}
        </div>

        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 ${
            copied
              ? 'bg-emerald-500 text-black'
              : 'bg-kick-green hover:bg-[#43d613] text-black shadow-[0_0_12px_rgba(83,252,24,0.3)]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Kopyalandı!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> OBS Linkini Kopyala
            </>
          )}
        </button>

        <a
          href={overlayUrl}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition-colors shrink-0"
        >
          Aç <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
