'use client';

import React, { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { StreamerConfig } from '@/domain/types';
import { Button, Panel, PanelHeader } from './ui';

export const ObsUrlGenerator: React.FC<{ config: StreamerConfig }> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [origin, setOrigin] = useState('http://localhost:3000');

  useEffect(() => setOrigin(window.location.origin), []);

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
  if (config.channelSlug) query.set('channel', config.channelSlug);

  const overlayUrl = `${origin}/overlay?${query.toString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Panel>
      <PanelHeader title="OBS Tarayıcı Kaynağı" hint="Önerilen boyut 400 × 120, arka plan şeffaf." />
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-base px-3 py-2">
          <code className="min-w-0 flex-1 truncate font-mono text-xs text-muted">
            {revealed ? overlayUrl : `${origin}/overlay?••••••••••••`}
          </code>
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="text-muted hover:text-fg"
            aria-label={revealed ? 'Linki gizle' : 'Linki göster'}
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" className="flex-1" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Kopyalandı' : 'Linki kopyala'}
          </Button>
          <a href={overlayUrl} target="_blank" rel="noreferrer">
            <Button aria-label="Overlay'i yeni sekmede aç">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </Panel>
  );
};
