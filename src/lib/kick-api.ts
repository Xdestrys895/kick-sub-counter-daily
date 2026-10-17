import { KickUser } from '@/domain/types';

/**
 * Kick API Client & Adapter
 * Handles official Kick OAuth2 and public channel discovery.
 */

export interface KickTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
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

  /**
   * Generates Kick OAuth 2.0 authorization URL
   */
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

  /**
   * Exchanges authorization code for access token
   */
  public async exchangeCodeForToken(code: string, codeVerifier?: string): Promise<KickTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code: code,
    });

    if (codeVerifier) {
      params.append('code_verifier', codeVerifier);
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
   * Fetches public channel information by channel slug (username)
   * Resilient with fallback headers
   */
  public static async fetchPublicChannel(slug: string): Promise<KickUser | null> {
    if (!slug) return null;
    const cleanSlug = slug.trim().toLowerCase().replace('@', '');

    try {
      const res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(cleanSlug)}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'KickSubCounter/1.0.0',
        },
        next: { revalidate: 60 } // Next.js cache 60s
      });

      if (!res.ok) {
        // Try v1 fallback
        const v1Res = await fetch(`https://kick.com/api/v1/channels/${encodeURIComponent(cleanSlug)}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!v1Res.ok) return null;
        const v1Data = await v1Res.json();
        return {
          id: String(v1Data.id || v1Data.user_id),
          username: v1Data.user?.username || cleanSlug,
          slug: cleanSlug,
          profilePic: v1Data.user?.profile_pic || v1Data.user?.profilepic,
          channelId: v1Data.id,
          chatroomId: v1Data.chatroom?.id,
          verified: v1Data.verified?.status || false
        };
      }

      const data = await res.json();
      return {
        id: String(data.id || data.user_id),
        username: data.user?.username || cleanSlug,
        slug: cleanSlug,
        profilePic: data.user?.profile_pic || data.user?.profilepic,
        channelId: data.id,
        chatroomId: data.chatroom?.id,
        verified: data.verified?.status || false
      };
    } catch (err) {
      console.error(`Failed to fetch Kick channel info for ${slug}:`, err);
      return null;
    }
  }
}
