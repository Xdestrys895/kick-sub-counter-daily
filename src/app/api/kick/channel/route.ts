import { NextRequest, NextResponse } from 'next/server';
import { KickApiClient, extractKickSlug } from '@/lib/kick-api';

export async function GET(req: NextRequest) {
  const rawInput = req.nextUrl.searchParams.get('slug');

  if (!rawInput) {
    return NextResponse.json({ error: 'Channel slug parameter is required' }, { status: 400 });
  }

  const cleanSlug = extractKickSlug(rawInput);
  if (!cleanSlug) {
    return NextResponse.json({ error: 'Geçersiz Kick kullanıcı adı veya bağlantısı.' }, { status: 400 });
  }

  try {
    const channel = await KickApiClient.fetchPublicChannel(cleanSlug);

    if (!channel) {
      return NextResponse.json(
        { error: `"${cleanSlug}" adlı Kick kanalı bulunamadı. Lütfen kullanıcı adını kontrol edin.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, channel });
  } catch (err) {
    console.error('Kick channel fetch error:', err);
    return NextResponse.json(
      { error: 'Kick kanal bilgileri alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
