import { DailyStats, StreamerConfig, SubEvent } from '@/domain/types';

export type BusMessage =
  | { type: 'SUB_EVENT'; payload: SubEvent }
  | { type: 'STATS_UPDATE'; payload: DailyStats }
  | { type: 'CONFIG_UPDATE'; payload: StreamerConfig }
  | { type: 'TEST_SUB'; payload: { count: number; name: string; isGift?: boolean } }
  | { type: 'RESET_COUNTER'; payload: { goal: number; timezone: string } };

const CHANNEL_NAME = 'kick_sub_counter_sync_v1';

export class EventBus {
  private static instance: EventBus;
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(msg: BusMessage) => void> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.channel = new BroadcastChannel(CHANNEL_NAME);
          this.channel.onmessage = (event) => {
            this.notifyListeners(event.data);
          };
        }

        // Window storage event fallback for cross-process OBS browser sources
        window.addEventListener('storage', (e) => {
          if (e.key === 'kick_sub_bus_event' && e.newValue) {
            try {
              const parsed: BusMessage = JSON.parse(e.newValue);
              this.notifyListeners(parsed);
            } catch {
              // Ignore invalid storage messages
            }
          }
        });
      } catch (err) {
        console.warn('BroadcastChannel not supported in this environment, using local fallback:', err);
      }
    }
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public publish(msg: BusMessage): void {
    if (typeof window === 'undefined') return;

    // 1. Notify local in-memory listeners
    this.notifyListeners(msg);

    // 2. BroadcastChannel for same-origin tabs/windows
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (err) {
        console.warn('BroadcastChannel send error:', err);
      }
    }

    // 3. LocalStorage event for external OBS browser sources on same machine
    try {
      localStorage.setItem('kick_sub_bus_event', JSON.stringify({ ...msg, _t: Date.now() }));
    } catch {
      // Storage quota or restriction
    }
  }

  public subscribe(listener: (msg: BusMessage) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(msg: BusMessage): void {
    this.listeners.forEach((listener) => {
      try {
        listener(msg);
      } catch (e) {
        console.error('Error in EventBus listener:', e);
      }
    });
  }
}
