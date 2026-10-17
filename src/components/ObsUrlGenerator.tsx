'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Video, Monitor, Info } from 'lucide-react';
import { StreamerConfig } from '@/domain/types';

interface ObsUrlGeneratorProps {
  config: StreamerConfig;
}

export const ObsUrlGenerator: React.FC<ObsUrlGeneratorProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);

  // Construct URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const overlayUrl = `${origin}/overlay?theme=${config.selectedThemeId}&goal=${config.dailyGoal}&sound=${config.soundEnabled ? '1' : '0'}${config.channelSlug ? `&channel=${encodeURIComponent(config.channelSlug)}` : ''}&tz=${encodeURIComponent(config.timezone)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-kick-card border border-kick-border rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
          <Video className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            OBS Studio & Streamlabs Canlı Overlay URL
          </h3>
          <p className="text-xs text-zinc-400">
            Aşağıdaki bağlantıyı kopyalayarak OBS&apos;e &quot;Tarayıcı (Browser Source)&quot; olarak ekleyin.
          </p>
        </div>
      </div>

      {/* URL Copy Bar */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-4">
        <div className="flex-1 bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 font-mono text-xs text-zinc-300 truncate select-all flex items-center">
          {overlayUrl}
        </div>

        <button
          onClick={handleCopy}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
            copied
              ? 'bg-emerald-500 text-black'
              : 'bg-kick-green hover:bg-[#43d613] text-black shadow-[0_0_15px_rgba(83,252,24,0.3)]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" /> Kopyalandı!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> OBS Linkini Kopyala
            </>
          )}
        </button>

        <a
          href={overlayUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          Test Et <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* OBS Setup Helper Specs */}
      <div className="bg-black/40 border border-zinc-800/80 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <Monitor className="w-4 h-4 text-kick-green shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Önerilen Çözünürlük:</span>
            <span className="text-zinc-400 font-mono">Genişlik: 480px • Yükseklik: 180px</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Saydam Arka Plan:</span>
            <span className="text-zinc-400">Sayfa arka planı %100 şeffaftır (Transparent).</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Canlı Senkronizasyon:</span>
            <span className="text-zinc-400">Panele gelen her abone OBS ekranında anında oynatılır.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
