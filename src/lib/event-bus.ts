import { DailyStats, StreamerConfig, SubEvent } from '@/domain/types';

export type BusMessage =
  | { type: 'SUB_EVENT'; payload: SubEvent }
  | { type: 'STATS_UPDATE'; payload: DailyStats }
  | { type: 'CONFIG_UPDATE'; payload: StreamerConfig }
  | { type: 'TEST_SUB'; payload: { count: number; name: string; isGift?: boolean } }
  | { type: 'RESET_COUNTER'; payload: { goal: number; timezone: string } };

interface Envelope {
  senderId?: string;
  message: BusMessage;
  timestamp: number;
}

const CHANNEL_NAME = 'kick_sub_counter_sync_v2';

export class EventBus {
  private static instance: EventBus;
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, (msg: BusMessage) => void> = new Map();

  private constructor() {
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.channel = new BroadcastChannel(CHANNEL_NAME);
          this.channel.onmessage = (event) => {
            const env: Envelope = event.data;
            if (env && env.message) {
              this.notifyListeners(env.message, env.senderId);
            }
          };
        }

        // Window storage event fallback for cross-process OBS browser sources
        window.addEventListener('storage', (e) => {
          if (e.key === 'kick_sub_bus_v2' && e.newValue) {
            try {
              const env: Envelope = JSON.parse(e.newValue);
              if (env && env.message) {
                this.notifyListeners(env.message, env.senderId);
              }
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

  public publish(msg: BusMessage, senderId?: string): void {
    if (typeof window === 'undefined') return;

    const env: Envelope = {
      senderId,
      message: msg,
      timestamp: Date.now(),
    };

    // 1. Notify other local in-memory listeners (ignoring the sender itself)
    this.notifyListeners(msg, senderId);

    // 2. BroadcastChannel for same-origin tabs/windows
    if (this.channel) {
      try {
        this.channel.postMessage(env);
      } catch (err) {
        console.warn('BroadcastChannel send error:', err);
      }
    }

    // 3. LocalStorage event for external OBS browser sources
    try {
      localStorage.setItem('kick_sub_bus_v2', JSON.stringify(env));
    } catch {
      // Storage quota or restriction
    }
  }

  public subscribe(listener: (msg: BusMessage) => void, subscriberId: string = Math.random().toString()): () => void {
    this.listeners.set(subscriberId, listener);
    return () => {
      this.listeners.delete(subscriberId);
    };
  }

  private notifyListeners(msg: BusMessage, senderId?: string): void {
    this.listeners.forEach((listener, subId) => {
      // Don't re-dispatch to the originating component
      if (senderId && subId === senderId) return;

      try {
        listener(msg);
      } catch (e) {
        console.error('Error in EventBus listener:', e);
      }
    });
  }
}
