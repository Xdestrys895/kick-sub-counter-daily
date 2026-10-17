import { KickUser } from '@/domain/types';

/**
 * Kick API Client & Adapter
 * Handles official Kick OAuth2, robust channel URL normalization,
 * and public channel discovery with clean headers to prevent Cloudflare blocks.
 */

export interface KickTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface KickLeaderboardDonor {
  user_id: number;
  username: string;
  quantity: number;
}

export interface KickChannelDetails extends KickUser {
  followersCount?: number;
  bannerUrl?: string;
  weeklyGiftDonors?: KickLeaderboardDonor[];
  topGiftDonors?: KickLeaderboardDonor[];
}

/**
 * Cleans and extracts pure Kick username / channel slug from ANY format:
 * - https://kick.com/oscoliat
 * - kick.com/oscoliat/
 * - @oscoliat
 * - oscoliat
 * - https://kick.com/oscoliat?ref=123
 */
export function extractKickSlug(input: string): string {
  if (!input) return '';
  let s = input.trim();
  // Remove protocol
  s = s.replace(/^https?:\/\//i, '');
  // Remove kick.com/ or www.kick.com/
  s = s.replace(/^(www\.)?kick\.com\//i, '');
  // Remove sub-routes like /about, /videos, /chatroom
  s = s.split('/')[0];
  // Remove query params or hashes
  s = s.split('?')[0].split('#')[0];
  // Remove leading @ and trailing slashes
  s = s.replace(/^@+/, '').replace(/\/+$/, '');
  return s.toLowerCase().trim();
}

export class KickApiClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(
    clientId: string = process.env.KICK_CLIENT_ID || '',
    clientSecret: string = process.env.KICK_CLIENT_SECRET || '',
    redirectUri: string = process.env.KICK_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  public getAuthorizationUrl(state: string, codeChallenge?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'user:read channel:read events:subscribe',
      state: state,
    });

    if (codeChallenge) {
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return `https://id.kick.com/oauth/authorize?${params.toString()}`;
  }

  public async exchangeCodeForToken(code: string, codeVerifier?: string): Promise<KickTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code: code,
    });

    if (codeVerifier) {
      tokenVerifier(params, codeVerifier);
    }

    const res = await fetch('https://id.kick.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Kick OAuth token error (${res.status}): ${errText}`);
    }

    return res.json();
  }

  /**
   * Fetches public channel information with clean headers (prevents Cloudflare block)
   */
  public static async fetchPublicChannel(rawInput: string): Promise<KickChannelDetails | null> {
    const slug = extractKickSlug(rawInput);
    if (!slug) return null;

    try {
      // 1. Try v2 endpoint with clean headers
      let res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(slug)}`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      // 2. If v2 fails, fallback to v1 endpoint
      if (!res.ok) {
        res = await fetch(`https://kick.com/api/v1/channels/${encodeURIComponent(slug)}`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
      }

      if (!res.ok) {
        console.warn(`Kick API returned status ${res.status} for ${slug}`);
        return null;
      }

      const data = await res.json();

      // 3. Try to fetch leaderboard for weekly gifts
      let weeklyGifts: KickLeaderboardDonor[] = [];
      let topGifts: KickLeaderboardDonor[] = [];
      try {
        const lbRes = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(slug)}/leaderboards`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        if (lbRes.ok) {
          const lbData = await lbRes.json();
          weeklyGifts = lbData.gifts_week || [];
          topGifts = lbData.gifts || [];
        }
      } catch {
        // Ignore leaderboard error
      }

      const avatar = data.user?.profile_pic || data.user?.profilepic || (data.user?.avatar);
      const banner = data.banner_image?.url || data.offline_banner_image?.url;

      return {
        id: String(data.id || data.user_id),
        username: data.user?.username || slug,
        slug: slug,
        profilePic: avatar,
        channelId: data.id,
        chatroomId: data.chatroom?.id,
        verified: data.verified?.status || false,
        followersCount: data.followers_count || data.followersCount || 0,
        bannerUrl: banner,
        weeklyGiftDonors: weeklyGifts,
        topGiftDonors: topGifts,
      };
    } catch (err) {
      console.error(`Failed to fetch Kick channel info for ${slug}:`, err);
      return null;
    }
  }
}

function tokenVerifier(params: URLSearchParams, verifier?: string) {
  if (verifier) {
    params.append('code_verifier', verifier);
  }
}
