'use client';

import React from 'react';
import { StreamerConfig } from '@/domain/types';
import { Play } from 'lucide-react';
import { playWebAudioTone } from '@/domain/counter-service';
import { getThemeById } from '@/domain/themes';
import { Button, Panel, PanelHeader, Segmented, Switch } from './ui';

interface StreamerSettingsProps {
  config: StreamerConfig;
  onChangeConfig: (newConfig: Partial<StreamerConfig>) => void;
}

type ToggleKey = 'showGoalNumber' | 'showProgressBar' | 'showTitle' | 'showPercentage' | 'showRemaining' | 'showRecentSub';

const ELEMENTS: { key: ToggleKey; label: string; hint: string }[] = [
  { key: 'showGoalNumber', label: 'Hedef sayısı', hint: '12 / 20' },
  { key: 'showProgressBar', label: 'İlerleme çubuğu', hint: 'Dolum animasyonu' },
  { key: 'showTitle', label: 'Başlık', hint: 'GÜNLÜK HEDEF' },
  { key: 'showPercentage', label: 'Yüzde', hint: '%60' },
  { key: 'showRemaining', label: 'Kalan', hint: '8 kaldı' },
  { key: 'showRecentSub', label: 'Son abone', hint: 'Son destekçinin adı' },
];

const GOAL_PRESETS = [5, 10, 20, 50, 100];

export const StreamerSettings: React.FC<StreamerSettingsProps> = ({ config, onChangeConfig }) => {
  const theme = getThemeById(config.selectedThemeId);

  return (
    <>
      <Panel>
        <PanelHeader title="Günlük hedef" hint="Gece yarısı otomatik sıfırlanır." />
        <div className="flex flex-wrap items-center gap-3 p-5">
          <input
            type="number"
            min={1}
            max={9999}
            value={config.dailyGoal}
            onChange={(e) => onChangeConfig({ dailyGoal: Math.max(1, parseInt(e.target.value) || 1) })}
            className="h-10 w-24 rounded-lg border border-line bg-base px-3 text-center font-mono text-sm font-semibold focus:border-accent/60 focus:outline-none"
          />
          <Segmented
            options={GOAL_PRESETS.map((p) => ({ value: p, label: String(p) }))}
            value={config.dailyGoal}
            onChange={(v) => onChangeConfig({ dailyGoal: v })}
          />
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Görünen öğeler" hint="Sadece sayı için hepsini kapatın." />
        <ul className="divide-y divide-line px-5 pb-2 pt-3">
          {ELEMENTS.map((el) => (
            <li key={el.key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm">{el.label}</p>
                <p className="text-xs text-muted">{el.hint}</p>
              </div>
              <Switch
                label={el.label}
                checked={config[el.key]}
                onChange={(v) => onChangeConfig({ [el.key]: v })}
              />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <PanelHeader
          title="Abone sesi"
          hint={`Tema sesi: ${theme.soundPreset}`}
          action={
            <Switch
              label="Abone sesi"
              checked={config.soundEnabled}
              onChange={(v) => onChangeConfig({ soundEnabled: v })}
            />
          }
        />
        <div className="flex items-center gap-3 p-5">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            disabled={!config.soundEnabled}
            value={config.soundVolume}
            onChange={(e) => onChangeConfig({ soundVolume: parseFloat(e.target.value) })}
            className="flex-1 accent-accent disabled:opacity-30"
            aria-label="Ses seviyesi"
          />
          <span className="w-10 text-right font-mono text-xs text-muted">{Math.round(config.soundVolume * 100)}%</span>
          <Button
            size="sm"
            variant="ghost"
            disabled={!config.soundEnabled}
            onClick={() => playWebAudioTone(theme.soundPreset, config.soundVolume)}
          >
            <Play className="h-3.5 w-3.5" /> Dinle
          </Button>
        </div>
      </Panel>
    </>
  );
};
