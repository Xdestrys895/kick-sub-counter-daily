'use client';

import React, { useState } from 'react';
import { KickUser } from '@/domain/types';
import { Radio, CheckCircle, ExternalLink, LogOut, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface KickLoginCardProps {
  user: KickUser | null;
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error';
  onConnectChannel: (slug: string) => Promise<boolean>;
  onDisconnect: () => void;
}

export const KickLoginCard: React.FC<KickLoginCardProps> = ({
  user,
  connectionState,
  onConnectChannel,
  onDisconnect,
}) => {
  const [channelInput, setChannelInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleQuickConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const ok = await onConnectChannel(channelInput.trim());
      if (!ok) {
        setErrorMessage('Kanal bulunamadı veya Kick sunucusu yanıt vermedi. Kullanıcı adını kontrol ediniz.');
      } else {
        setChannelInput('');
      }
    } catch {
      setErrorMessage('Bağlantı sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (connectionState) {
      case 'connected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Canlı Dinleniyor (WebSocket Aktif)
          </span>
        );
      case 'connecting':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-spin" />
            Bağlanıyor...
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" /> Bağlantı Hatası
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium">
            Bağlı Değil
          </span>
        );
    }
  };

  return (
    <div className="bg-kick-card border border-kick-border rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-kick-green/40 flex items-center justify-center font-black text-kick-green text-xl shadow-[0_0_10px_rgba(83,252,24,0.3)]">
            K
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Kick Hesap Bağlantısı
            </h3>
            <p className="text-xs text-zinc-400">
              Gerçek zamanlı abone ve hediye abonelikleri anında yakalayın
            </p>
          </div>
        </div>

        {getStatusBadge()}
      </div>

      {user ? (
        /* Connected State */
        <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.username}
                className="w-12 h-12 rounded-full border-2 border-kick-green object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white text-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white text-base">
                <span>{user.username}</span>
                {user.verified && (
                  <CheckCircle className="w-4 h-4 text-kick-green fill-kick-green text-black" />
                )}
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                Kanal ID: {user.channelId || 'N/A'} • kick.com/{user.slug}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://kick.com/${user.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              Kanalı Aç <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onDisconnect}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
            </button>
          </div>
        </div>
      ) : (
        /* Not Connected State: Choice of Official OAuth or Quick Connect */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Method A: Direct OAuth Sign-In */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-kick-green" />
                  Yöntem 1: Kick ile Giriş Yap (OAuth 2.0)
                </div>
                <p className="text-xs text-zinc-400 mb-4">
                  Kick hesabınızla yetkilendirme yaparak resmi API entegrasyonunu aktifleştirin.
                </p>
              </div>

              <a
                href="/api/auth/kick"
                className="w-full py-2.5 px-4 rounded-xl bg-kick-green hover:bg-[#46d614] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(83,252,24,0.3)]"
              >
                <span className="font-black">K</span> Kick ile Giriş Yap
              </a>
            </div>

            {/* Method B: Fast Instant Connect by Channel Username */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                <Radio className="w-4 h-4 text-sky-400" />
                Yöntem 2: Hızlı Kanal Bağlantısı (API Keysiz)
              </div>
              <p className="text-xs text-zinc-400 mb-3">
                Herhangi bir API şifresine gerek olmadan sadece Kick kullanıcı adınızı yazarak hemen başlayın.
              </p>

              <form onSubmit={handleQuickConnect} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kick Kullanıcı Adı (örn: xqc)"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-kick-green"
                />
                <button
                  type="submit"
                  disabled={loading || !channelInput.trim()}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {loading ? 'Bağlanıyor...' : 'Bağlan'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              {errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
