import Pusher, { Channel } from 'pusher-js';
import { SubEvent } from '@/domain/types';

export type PusherConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface KickPusherListenerOptions {
  channelId: number | string;
  chatroomId?: number | string;
  onSubEvent: (event: SubEvent) => void;
  onStateChange?: (state: PusherConnectionState) => void;
}

const KICK_PUSHER_KEY = 'eb1d5f283081a78b932c';
const KICK_PUSHER_CLUSTER = 'us2';

export class KickPusherListener {
  private pusher: Pusher | null = null;
  private channel: Channel | null = null;
  private chatroomChannel: Channel | null = null;
  private options: KickPusherListenerOptions;

  constructor(options: KickPusherListenerOptions) {
    this.options = options;
  }

  public connect(): void {
    if (typeof window === 'undefined') return;
    this.disconnect();

    this.options.onStateChange?.('connecting');

    try {
      this.pusher = new Pusher(KICK_PUSHER_KEY, {
        cluster: KICK_PUSHER_CLUSTER,
        forceTLS: true,
        activityTimeout: 30000,
        pongTimeout: 10000,
      });

      this.pusher.connection.bind('connected', () => {
        this.options.onStateChange?.('connected');
      });

      this.pusher.connection.bind('error', (err: unknown) => {
        console.warn('Pusher connection error:', err);
        this.options.onStateChange?.('error');
      });

      this.pusher.connection.bind('disconnected', () => {
        this.options.onStateChange?.('disconnected');
      });

      // 1. Channel level subscriptions
      const channelName = `channel.${this.options.channelId}`;
      this.channel = this.pusher.subscribe(channelName);

      // Direct Subscription Event
      this.channel.bind('App\\Events\\SubscriptionEvent', (data: unknown) => {
        try {
          const payload = typeof data === 'string' ? JSON.parse(data) : data;
          const subEvent: SubEvent = {
            id: payload?.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            timestamp: Date.now(),
            type: 'subscription',
            username: payload?.username || payload?.user?.username || 'Gizli Destekçi',
            giftCount: 0,
            months: payload?.months || 1,
          };
          this.options.onSubEvent(subEvent);
        } catch (e) {
          console.error('Error parsing SubscriptionEvent:', e);
        }
      });

      // Gifted Subscriptions Event (e.g. 5 gifted subs)
      this.channel.bind('App\\Events\\GiftedSubscriptionsEvent', (data: unknown) => {
        try {
          const payload = typeof data === 'string' ? JSON.parse(data) : data;
          const giftCount = Number(payload?.gifts_count || (payload?.gifted_usernames?.length || 1));
          const subEvent: SubEvent = {
            id: payload?.id || `gift_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            timestamp: Date.now(),
            type: 'gift_purchase',
            username: payload?.gifter_username || payload?.username || 'Hediye Eden Yayınsever',
            giftCount: giftCount,
          };
          this.options.onSubEvent(subEvent);
        } catch (e) {
          console.error('Error parsing GiftedSubscriptionsEvent:', e);
        }
      });

      // 2. Chatroom level backup (Lucky users gifted subs)
      if (this.options.chatroomId) {
        const chatroomChannelName = `chatrooms.${this.options.chatroomId}.v2`;
        this.chatroomChannel = this.pusher.subscribe(chatroomChannelName);

        this.chatroomChannel.bind('App\\Events\\ChatMessageEvent', (data: unknown) => {
          try {
            const payload = typeof data === 'string' ? JSON.parse(data) : data;
            // Check if message is a system subscription alert
            if (payload?.type === 'subscription' || payload?.type === 'gift') {
              const count = payload?.type === 'gift' ? (payload?.metadata?.gift_count || 1) : 0;
              const subEvent: SubEvent = {
                id: payload?.id || `chat_sub_${Date.now()}`,
                timestamp: Date.now(),
                type: count > 0 ? 'gift_purchase' : 'subscription',
                username: payload?.sender?.username || 'Kick Üyesi',
                giftCount: count,
              };
              this.options.onSubEvent(subEvent);
            }
          } catch {
            // Ignore chat parse errors
          }
        });
      }
    } catch (err) {
      console.error('Failed to initialize Kick Pusher client:', err);
      this.options.onStateChange?.('error');
    }
  }

  public disconnect(): void {
    if (this.channel) {
      this.channel.unbind_all();
      this.pusher?.unsubscribe(`channel.${this.options.channelId}`);
      this.channel = null;
    }
    if (this.chatroomChannel && this.options.chatroomId) {
      this.chatroomChannel.unbind_all();
      this.pusher?.unsubscribe(`chatrooms.${this.options.chatroomId}.v2`);
      this.chatroomChannel = null;
    }
    if (this.pusher) {
      this.pusher.disconnect();
      this.pusher = null;
    }
    this.options.onStateChange?.('disconnected');
  }
}
