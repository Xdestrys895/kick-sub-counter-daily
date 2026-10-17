import { NextRequest, NextResponse } from 'next/server';
import { KickApiClient } from '@/lib/kick-api';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Channel slug parameter is required' }, { status: 400 });
  }

  try {
    const channel = await KickApiClient.fetchPublicChannel(slug);

    if (!channel) {
      return NextResponse.json(
        { error: 'Kanal bulunamadı veya Kick API yanıt vermedi. Lütfen kullanıcı adını kontrol edin.' },
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
