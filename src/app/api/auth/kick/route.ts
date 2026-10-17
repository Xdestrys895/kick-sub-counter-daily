import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const clientId = process.env.KICK_CLIENT_ID;
  const redirectUri = process.env.KICK_REDIRECT_URI || `${req.nextUrl.origin}/api/auth/callback`;

  // Defensive fallback if developer credentials are not configured yet
  if (!clientId || clientId === 'your_kick_client_id_here') {
    return NextResponse.redirect(
      new URL('/?error=kick_credentials_missing&msg=' + encodeURIComponent('Kick Developer Client ID henüz .env dosyasına eklenmemiş. Ancak direkt Kick Kullanıcı Adı ile anında bağlanabilirsiniz!'), req.url)
    );
  }

  // Generate PKCE code verifier and challenge
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  const state = crypto.randomBytes(16).toString('hex');

  const authUrl = new URL('https://id.kick.com/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'user:read channel:read events:subscribe');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  const response = NextResponse.redirect(authUrl.toString());

  // Store code_verifier and state in temporary http-only cookie for verification in callback
  response.cookies.set('kick_oauth_state', state, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 600 });
  response.cookies.set('kick_code_verifier', codeVerifier, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 600 });

  return response;
}
