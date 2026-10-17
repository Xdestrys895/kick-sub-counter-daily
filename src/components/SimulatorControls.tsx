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
    <div className="bg-kick-card border border-kick-border rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Manuel Test:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onAddSub(1, false, 'Canlı İzleyici')}
          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" /> +1 Abone
        </button>

        <button
          type="button"
          onClick={() => onAddSub(5, true, 'Süper Destekçi')}
          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
        >
          <Gift className="w-3.5 h-3.5" /> +5 Hediye
        </button>

        <button
          type="button"
          onClick={() => fireGoalCelebration()}
          className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" /> Konfeti
        </button>

        <button
          type="button"
          onClick={onDecrement}
          disabled={stats.currentCount <= 0}
          className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
          title="1 Azalt"
        >
          <Minus className="w-3 h-3" /> -1
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm('Bugünkü sayacı sıfırlamak istediğinize emin misiniz?')) {
              onReset();
            }
          }}
          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
        >
          <RotateCcw className="w-3 h-3" /> Sıfırla
        </button>
      </div>
    </div>
  );
};
