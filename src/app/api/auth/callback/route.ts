import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=kick_auth_denied&details=${encodeURIComponent(error)}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', req.url));
  }

  const savedState = req.cookies.get('kick_oauth_state')?.value;
  const codeVerifier = req.cookies.get('kick_code_verifier')?.value;

  if (savedState && state !== savedState) {
    return NextResponse.redirect(new URL('/?error=state_mismatch', req.url));
  }

  const clientId = process.env.KICK_CLIENT_ID || '';
  const clientSecret = process.env.KICK_CLIENT_SECRET || '';
  const redirectUri = process.env.KICK_REDIRECT_URI || `${req.nextUrl.origin}/api/auth/callback`;

  try {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
    });

    if (codeVerifier) {
      tokenParams.append('code_verifier', codeVerifier);
    }

    const tokenRes = await fetch('https://id.kick.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('Kick OAuth token exchange failed:', errText);
      return NextResponse.redirect(
        new URL(`/?error=token_exchange_failed&details=${encodeURIComponent(errText)}`, req.url)
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch authorized user profile
    const userRes = await fetch('https://api.kick.com/public/v1/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    let username = '';
    let profilePic = '';
    let userId = '';

    if (userRes.ok) {
      const userData = await userRes.json();
      username = userData?.data?.[0]?.name || userData?.username || '';
      profilePic = userData?.data?.[0]?.profile_picture || '';
      userId = userData?.data?.[0]?.user_id || '';
    }

    const redirectTarget = new URL('/', req.url);
    redirectTarget.searchParams.set('kick_login', 'success');
    if (username) redirectTarget.searchParams.set('username', username);
    if (userId) redirectTarget.searchParams.set('user_id', String(userId));
    if (profilePic) redirectTarget.searchParams.set('pic', profilePic);

    const res = NextResponse.redirect(redirectTarget);
    res.cookies.delete('kick_oauth_state');
    res.cookies.delete('kick_code_verifier');
    return res;
  } catch (err) {
    console.error('Unhandled callback exception:', err);
    return NextResponse.redirect(
      new URL('/?error=callback_exception', req.url)
    );
  }
}
