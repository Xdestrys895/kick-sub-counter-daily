'use client';

import React from 'react';
import { DailyStats } from '@/domain/types';
import { Gift, Minus, PartyPopper, Plus, RotateCcw } from 'lucide-react';
import { fireGoalCelebration } from './ConfettiTrigger';
import { Button } from './ui';

interface SimulatorControlsProps {
  stats: DailyStats;
  onAddSub: (count: number, isGift?: boolean, name?: string) => void;
  onDecrement: () => void;
  onReset: () => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({ stats, onAddSub, onDecrement, onReset }) => (
  <div className="flex flex-wrap items-center gap-2">
    <Button size="sm" variant="primary" onClick={() => onAddSub(1, false, 'Canlı İzleyici')}>
      <Plus className="h-3.5 w-3.5" /> Abone
    </Button>
    <Button size="sm" onClick={() => onAddSub(5, true, 'Süper Destekçi')}>
      <Gift className="h-3.5 w-3.5" /> 5 Hediye
    </Button>
    <Button size="sm" onClick={onDecrement} disabled={stats.currentCount <= 0} aria-label="1 azalt">
      <Minus className="h-3.5 w-3.5" />
    </Button>
    <Button size="sm" variant="ghost" onClick={() => fireGoalCelebration()}>
      <PartyPopper className="h-3.5 w-3.5" /> Konfeti
    </Button>
    <Button
      size="sm"
      variant="danger"
      className="ml-auto"
      onClick={() => {
        if (confirm('Bugünkü sayacı sıfırlamak istediğinize emin misiniz?')) onReset();
      }}
    >
      <RotateCcw className="h-3.5 w-3.5" /> Sıfırla
    </Button>
  </div>
);
