/**
 * Sentinel Architecture - Domain Core Types
 * Pure TypeScript definitions decoupled from any UI framework or external API.
 */

export type SubEventType = 'subscription' | 'gift_purchase' | 'gift_received';

export interface KickUser {
  id: string;
  username: string;
  slug: string;
  profilePic?: string;
  channelId?: number | string;
  chatroomId?: number | string;
  verified?: boolean;
}

export interface SubEvent {
  id: string;
  timestamp: number;
  type: SubEventType;
  username: string;
  recipient?: string;
  giftCount: number;
  months?: number;
  tier?: string;
}

export interface DailyStats {
  dateStr: string; // YYYY-MM-DD in the active timezone
  targetGoal: number;
  currentCount: number;
  giftCount: number;
  directCount: number;
  lastEventTime?: number;
  lastSubName?: string;
  timezone: string;
}

export interface GoalProgress {
  current: number;
  goal: number;
  percentage: number;
  remaining: number;
  isCompleted: number | boolean;
}

export type SoundEffectType = 'chime' | 'retro-coin' | 'arcade-powerup' | 'sub-alert' | 'none';

export interface WidgetTheme {
  id: string;
  name: string;
  nameTr: string;
  description: string;
  descriptionTr: string;
  category: 'Modern' | 'Gaming' | 'Retro' | 'Minimal' | 'Special';
  previewBadgeColor: string;
  styles: {
    container: string;
    title: string;
    counterText: string;
    goalText: string;
    progressTrack: string;
    progressFill: string;
    badge: string;
    statsText: string;
    accentGlow?: string;
    fontFamily?: string;
  };
  soundPreset: SoundEffectType;
}

export interface StreamerConfig {
  channelSlug: string;
  kickUser: KickUser | null;
  dailyGoal: number;
  goalTitle: string;
  selectedThemeId: string;
  timezone: string;
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  autoResetAtMidnight: boolean;
  showRecentSub: boolean;
  showPercentage: boolean;
  showRemaining: boolean;
}

export interface OverlayQueryParams {
  theme?: string;
  goal?: number;
  title?: string;
  sound?: boolean;
  channel?: string;
  tz?: string;
  showStats?: boolean;
}
