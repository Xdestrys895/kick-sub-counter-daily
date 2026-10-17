'use client';

import confetti from 'canvas-confetti';

export function fireGoalCelebration(): void {
  if (typeof window === 'undefined') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 99999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-tier confetti burst
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#53FC18', '#ffffff', '#00f0ff'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#53FC18', '#facc15', '#ec4899'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#53FC18', '#ffffff'],
  });
}

export function fireSubSparkle(): void {
  if (typeof window === 'undefined') return;

  confetti({
    particleCount: 45,
    spread: 50,
    origin: { y: 0.8 },
    colors: ['#53FC18', '#ffffff'],
    scalar: 0.7,
    ticks: 120,
    zIndex: 99999,
  });
}
