'use client';

import React from 'react';
import { StreamerConfig } from '@/domain/types';
import { Settings, Volume2, VolumeX, Clock, Target, Play } from 'lucide-react';
import { playWebAudioTone } from '@/domain/counter-service';
import { getThemeById } from '@/domain/themes';

interface StreamerSettingsProps {
  config: StreamerConfig;
  onChangeConfig: (newConfig: Partial<StreamerConfig>) => void;
}

export const StreamerSettings: React.FC<StreamerSettingsProps> = ({
  config,
  onChangeConfig,
}) => {
  const currentTheme = getThemeById(config.selectedThemeId);

  const timezones = [
    { label: 'İstanbul (UTC+3)', value: 'Europe/Istanbul' },
    { label: 'UTC (Evrensel)', value: 'UTC' },
    { label: 'Berlin / Paris (CET)', value: 'Europe/Berlin' },
    { label: 'Londra (GMT)', value: 'Europe/London' },
    { label: 'New York (EST/EDT)', value: 'America/New_York' },
    { label: 'Los Angeles (PST)', value: 'America/Los_Angeles' },
    { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  ];

  const goalPresets = [5, 10, 15, 20, 25, 50, 100];

  const handleTestSound = () => {
    playWebAudioTone(currentTheme.soundPreset, config.soundVolume);
  };

  return (
    <div className="bg-kick-card border border-kick-border rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-kick-green">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Hedef ve Sayaç Ayarları
          </h3>
          <p className="text-xs text-zinc-400">
            Günlük abone hedefinizi, ses efektlerini ve saat diliminizi özelleştirin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Goal Configuration */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-kick-green" /> Günlük Abone Hedefi
          </label>
          <div className="flex items-center gap-3 mb-2">
            <input
              type="number"
              min="1"
              max="9999"
              value={config.dailyGoal}
              onChange={(e) => onChangeConfig({ dailyGoal: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-24 px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-white font-bold text-base focus:outline-none focus:border-kick-green text-center"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {goalPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChangeConfig({ dailyGoal: preset })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    config.dailyGoal === preset
                      ? 'bg-kick-green text-black font-bold'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-zinc-500">
            Hedefe ulaşıldığında otomatik konfeti animasyonu devreye girer.
          </span>
        </div>

        {/* Goal Title */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            Başlık Metni
          </label>
          <input
            type="text"
            value={config.goalTitle}
            onChange={(e) => onChangeConfig({ goalTitle: e.target.value })}
            placeholder="örn: GÜNLÜK ABONE HEDEFİ"
            className="w-full px-3.5 py-2 bg-black/60 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-kick-green"
          />
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Sayaç kartının üzerinde görünecek başlık yazısı.
          </span>
        </div>

        {/* Sound Effects & Volume */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              {config.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-kick-green" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              )}
              Abone Ses Efekti (Web Audio 0ms Gecikme)
            </span>
            <button
              type="button"
              onClick={handleTestSound}
              className="text-[11px] text-kick-green hover:underline flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-kick-green" /> Sesi Dinle
            </button>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeConfig({ soundEnabled: !config.soundEnabled })}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                config.soundEnabled
                  ? 'bg-kick-green text-black'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {config.soundEnabled ? 'Açık' : 'Kapalı'}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              disabled={!config.soundEnabled}
              value={config.soundVolume}
              onChange={(e) => onChangeConfig({ soundVolume: parseFloat(e.target.value) })}
              className="flex-1 accent-kick-green disabled:opacity-40"
            />
            <span className="text-xs font-mono text-zinc-400 w-10 text-right">
              {Math.round(config.soundVolume * 100)}%
            </span>
          </div>
        </div>

        {/* Timezone and Midnight Reset */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            Saat Dilimi (Gece Yarısı 00:00 Sıfırlaması)
          </label>
          <select
            value={config.timezone}
            onChange={(e) => onChangeConfig({ timezone: e.target.value })}
            className="w-full px-3.5 py-2 bg-black/60 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:border-kick-green"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Her gün yerel saatle 00:00 olduğunda sayaç otomatik olarak temiz sıfırdan başlar.
          </span>
        </div>
      </div>
    </div>
  );
};
