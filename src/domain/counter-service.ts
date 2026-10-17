import { DailyStats, GoalProgress, SoundEffectType, SubEvent } from './types';

/**
 * Pure Domain Service - Subscription Counting & Timezone Math
 * Resilient against network edge-cases, date boundaries, and duplicate events.
 */

export function getTodayDateString(timezone: string = 'Europe/Istanbul'): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date()); // Formats as YYYY-MM-DD
  } catch {
    // Fallback if invalid IANA timezone passed
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

export function isNewDay(lastDateStr: string, timezone: string): boolean {
  if (!lastDateStr) return true;
  return getTodayDateString(timezone) !== lastDateStr;
}

export function calculateGoalProgress(current: number, goal: number): GoalProgress {
  const safeGoal = Math.max(1, goal);
  const safeCurrent = Math.max(0, current);
  const percentage = Math.min(100, Math.round((safeCurrent / safeGoal) * 100));
  const remaining = Math.max(0, safeGoal - safeCurrent);

  return {
    current: safeCurrent,
    goal: safeGoal,
    percentage,
    remaining,
    isCompleted: safeCurrent >= safeGoal
  };
}

export function createInitialDailyStats(goal: number = 20, timezone: string = 'Europe/Istanbul'): DailyStats {
  return {
    dateStr: getTodayDateString(timezone),
    targetGoal: goal,
    currentCount: 0,
    giftCount: 0,
    directCount: 0,
    timezone,
    lastEventTime: undefined,
    lastSubName: undefined
  };
}

export function applySubEvent(prev: DailyStats, event: SubEvent): DailyStats {
  // If the event happened on a new day, auto-reset first
  const todayStr = getTodayDateString(prev.timezone);
  const baseStats = prev.dateStr !== todayStr
    ? createInitialDailyStats(prev.targetGoal, prev.timezone)
    : { ...prev };

  const increment = event.giftCount > 0 ? event.giftCount : 1;
  const isGift = event.type === 'gift_purchase' || event.giftCount > 0;

  return {
    ...baseStats,
    dateStr: todayStr,
    currentCount: baseStats.currentCount + increment,
    giftCount: isGift ? baseStats.giftCount + increment : baseStats.giftCount,
    directCount: !isGift ? baseStats.directCount + increment : baseStats.directCount,
    lastEventTime: event.timestamp || Date.now(),
    lastSubName: event.username
  };
}

/**
 * Event Deduplication Cache
 * Prevents double-processing if Pusher or Kick Webhooks re-transmit events
 */
export class EventDeduplicator {
  private seenIds = new Set<string>();
  private readonly maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  public isDuplicate(id: string): boolean {
    if (!id) return false;
    if (this.seenIds.has(id)) return true;

    if (this.seenIds.size >= this.maxSize) {
      // Evict oldest entries
      const firstEntry = this.seenIds.values().next().value;
      if (firstEntry) this.seenIds.delete(firstEntry);
    }

    this.seenIds.add(id);
    return false;
  }

  public clear(): void {
    this.seenIds.clear();
  }
}

/**
 * Pure Web Audio API Sound Synthesizer
 * 0ms latency, zero external network dependency, zero CORS failures.
 */
export function playWebAudioTone(type: SoundEffectType, volume: number = 0.5): void {
  if (typeof window === 'undefined' || type === 'none') return;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const safeVol = Math.max(0, Math.min(1, volume));

    if (type === 'chime') {
      // Soft modern glass chime (Two sine waves: 880Hz, 1320Hz)
      const freqs = [880, 1320, 1760];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(safeVol * 0.3, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.6);
      });
    } else if (type === 'retro-coin') {
      // Classic 8-bit Mario/Arcade coin sound (B5 to E6)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.09); // E6

      gain.gain.setValueAtTime(safeVol * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'arcade-powerup') {
      // Rapid ascending arpeggio
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(safeVol * 0.2, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.25);
      });
    } else if (type === 'sub-alert') {
      // Electronic fanfare
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(safeVol * 0.3, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.8);
      });
    }
  } catch (err) {
    console.warn('Audio playback not allowed or failed:', err);
  }
}
