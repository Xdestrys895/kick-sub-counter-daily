import { DailyStats, StreamerConfig } from '@/domain/types';
import { createInitialDailyStats, getTodayDateString, isNewDay } from '@/domain/counter-service';

const CONFIG_KEY = 'kick_sub_counter_config_v1';
const STATS_KEY = 'kick_sub_counter_stats_v1';

export const DEFAULT_CONFIG: StreamerConfig = {
  channelSlug: '',
  kickUser: null,
  dailyGoal: 20,
  goalTitle: 'GÜNLÜK ABONE HEDEFİ',
  selectedThemeId: 'kick-electric',
  timezone: 'Europe/Istanbul',
  soundEnabled: true,
  soundVolume: 0.6,
  autoResetAtMidnight: true,
  showRecentSub: true,
  showPercentage: true,
  showRemaining: true,
};

export function loadStreamerConfig(): StreamerConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading streamer config from localStorage:', err);
    return DEFAULT_CONFIG;
  }
}

export function saveStreamerConfig(config: StreamerConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving streamer config to localStorage:', err);
  }
}

export function loadDailyStats(targetGoal: number = 20, timezone: string = 'Europe/Istanbul'): DailyStats {
  if (typeof window === 'undefined') {
    return createInitialDailyStats(targetGoal, timezone);
  }

  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      const initial = createInitialDailyStats(targetGoal, timezone);
      saveDailyStats(initial);
      return initial;
    }

    const parsed: DailyStats = JSON.parse(raw);

    // Check if midnight passed in user's timezone!
    if (isNewDay(parsed.dateStr, timezone)) {
      console.log(`[Daily Counter] New day detected (${getTodayDateString(timezone)} vs ${parsed.dateStr}). Auto-resetting stats.`);
      const fresh = createInitialDailyStats(targetGoal, timezone);
      saveDailyStats(fresh);
      return fresh;
    }

    // Keep goal synchronized with streamer settings
    parsed.targetGoal = targetGoal;
    parsed.timezone = timezone;
    return parsed;
  } catch (err) {
    console.error('Error loading daily stats:', err);
    return createInitialDailyStats(targetGoal, timezone);
  }
}

export function saveDailyStats(stats: DailyStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Error saving daily stats to localStorage:', err);
  }
}

export function resetDailyStats(goal: number = 20, timezone: string = 'Europe/Istanbul'): DailyStats {
  const fresh = createInitialDailyStats(goal, timezone);
  saveDailyStats(fresh);
  return fresh;
}
