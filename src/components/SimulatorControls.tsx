'use client';

import React from 'react';
import { DailyStats } from '@/domain/types';
import { Plus, Gift, RotateCcw, Sparkles, Minus, Zap } from 'lucide-react';
import { fireGoalCelebration } from './ConfettiTrigger';

interface SimulatorControlsProps {
  stats: DailyStats;
  onAddSub: (count: number, isGift?: boolean, name?: string) => void;
  onDecrement: () => void;
  onReset: () => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  stats,
  onAddSub,
  onDecrement,
  onReset,
}) => {
  return (
    <div className="bg-kick-card border border-kick-border rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Canlı Simülatör ve Manuel Yönetim
            </h3>
            <p className="text-xs text-zinc-400">
              Yayın öncesi sayacı test edin, hediye abonelik ekleyin veya sayacı manuel düzenleyin
            </p>
          </div>
        </div>

        {/* Current Day Stats Capsule */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-zinc-800 rounded-xl text-xs font-mono">
          <span className="text-zinc-500">Tarih:</span>
          <span className="text-zinc-300 font-bold">{stats.dateStr}</span>
          <span className="text-zinc-700">|</span>
          <span className="text-kick-green font-bold">Toplam: {stats.currentCount}</span>
        </div>
      </div>

      {/* Button Action Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => onAddSub(1, false, 'Canlı İzleyici')}
          className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> +1 Normal Abone Ekle
        </button>

        <button
          type="button"
          onClick={() => onAddSub(5, true, 'Süper Donator')}
          className="px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Gift className="w-4 h-4" /> +5 Hediye Abone Ekle
        </button>

        <button
          type="button"
          onClick={() => onAddSub(10, true, 'Mega Destekçi')}
          className="px-4 py-2.5 bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Gift className="w-4 h-4" /> +10 Hediye Abone Ekle
        </button>

        <button
          type="button"
          onClick={() => fireGoalCelebration()}
          className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" /> Konfeti Efektini Test Et
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onDecrement}
            disabled={stats.currentCount <= 0}
            className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            title="1 Azalt"
          >
            <Minus className="w-3.5 h-3.5" /> -1
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Bugünün abone sayacını sıfırlamak istediğinize emin misiniz?')) {
                onReset();
              }
            }}
            className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Sıfırla (0)
          </button>
        </div>
      </div>
    </div>
  );
};
