'use client';

import React from 'react';
import { StreamerConfig } from '@/domain/types';
import { Settings, Volume2, VolumeX, Target, Play, Sliders, CheckSquare, Square } from 'lucide-react';
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

  const goalPresets = [5, 10, 15, 20, 25, 50, 100];

  const handleTestSound = () => {
    playWebAudioTone(currentTheme.soundPreset, config.soundVolume);
  };

  const toggleOption = (key: keyof StreamerConfig) => {
    onChangeConfig({ [key]: !config[key] });
  };

  return (
    <div className="bg-kick-card border border-kick-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-kick-green" />
          <h3 className="text-base font-bold text-white">
            Sayaç Görünümü ve Modüler Ayarlar
          </h3>
        </div>
        <span className="text-xs text-zinc-500">
          İstediğiniz özellikleri açıp kapatabilirsiniz
        </span>
      </div>

      {/* Modular Element Toggles (Sadece sayaç veya detaylı) */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-kick-green" /> Sayaca Dahil Edilecek Öğeler
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* 1. Hedef Sayısı */}
          <button
            type="button"
            onClick={() => toggleOption('showGoalNumber')}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              config.showGoalNumber
                ? 'bg-kick-green/10 border-kick-green text-white'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {config.showGoalNumber ? (
              <CheckSquare className="w-4 h-4 text-kick-green shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-zinc-600 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold block">Hedef Sayısı</span>
              <span className="text-[10px] text-zinc-500">Örn: &apos;/ 20&apos;</span>
            </div>
          </button>

          {/* 2. İlerleme Çubuğu */}
          <button
            type="button"
            onClick={() => toggleOption('showProgressBar')}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              config.showProgressBar
                ? 'bg-kick-green/10 border-kick-green text-white'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {config.showProgressBar ? (
              <CheckSquare className="w-4 h-4 text-kick-green shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-zinc-600 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold block">İlerleme Çubuğu</span>
              <span className="text-[10px] text-zinc-500">Dolum animasyonu</span>
            </div>
          </button>

          {/* 3. Başlık Metni */}
          <button
            type="button"
            onClick={() => toggleOption('showTitle')}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              config.showTitle
                ? 'bg-kick-green/10 border-kick-green text-white'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {config.showTitle ? (
              <CheckSquare className="w-4 h-4 text-kick-green shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-zinc-600 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold block">Başlık Metni</span>
              <span className="text-[10px] text-zinc-500">Örn: GÜNLÜK HEDEF</span>
            </div>
          </button>

          {/* 4. Yüzde Rozeti */}
          <button
            type="button"
            onClick={() => toggleOption('showPercentage')}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              config.showPercentage
                ? 'bg-kick-green/10 border-kick-green text-white'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {config.showPercentage ? (
              <CheckSquare className="w-4 h-4 text-kick-green shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-zinc-600 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold block">Yüzde Rozeti</span>
              <span className="text-[10px] text-zinc-500">Örn: %75</span>
            </div>
          </button>

          {/* 5. Kalan Abone Sayısı */}
          <button
            type="button"
            onClick={() => toggleOption('showRemaining')}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              config.showRemaining
                ? 'bg-kick-green/10 border-kick-green text-white'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {config.showRemaining ? (
              <CheckSquare className="w-4 h-4 text-kick-green shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-zinc-600 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold block">Kalan Abone</span>
              <span className="text-[10px] text-zinc-500">Örn: 5 kaldı</span>
            </div>
          </button>

          {/* 6. Son Abone Adı */}
          <button
            type="button"
            onClick={() => toggleOption('showRecentSub')}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              config.showRecentSub
                ? 'bg-kick-green/10 border-kick-green text-white'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {config.showRecentSub ? (
              <CheckSquare className="w-4 h-4 text-kick-green shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-zinc-600 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold block">Son Abone Adı</span>
              <span className="text-[10px] text-zinc-500">Son destekçi yazısı</span>
            </div>
          </button>
        </div>
      </div>

      {/* Goal & Title Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Goal Preset Bar */}
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-kick-green" /> Hedef Sayısı
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="9999"
              value={config.dailyGoal}
              onChange={(e) => onChangeConfig({ dailyGoal: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-20 px-3 py-1.5 bg-black border border-zinc-700 rounded-lg text-white font-bold text-sm text-center focus:outline-none focus:border-kick-green"
            />
            <div className="flex flex-wrap gap-1">
              {goalPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChangeConfig({ dailyGoal: preset })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    config.dailyGoal === preset
                      ? 'bg-kick-green text-black font-bold'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audio Setting */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              {config.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-kick-green" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
              Abone Sesi
            </label>
            <button
              type="button"
              onClick={handleTestSound}
              className="text-[11px] text-kick-green hover:underline flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-kick-green" /> Test Et
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeConfig({ soundEnabled: !config.soundEnabled })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                config.soundEnabled ? 'bg-kick-green text-black' : 'bg-zinc-800 text-zinc-400'
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
              className="flex-1 accent-kick-green disabled:opacity-30"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
