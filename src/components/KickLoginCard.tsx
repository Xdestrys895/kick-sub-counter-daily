'use client';

import React, { useState } from 'react';
import { KickChannelDetails } from '@/lib/kick-api';
import { Radio, CheckCircle, ExternalLink, LogOut, ArrowRight, ShieldCheck, AlertCircle, Users, Gift, Key } from 'lucide-react';

interface KickLoginCardProps {
  user: KickChannelDetails | null;
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error';
  onConnectChannel: (input: string) => Promise<boolean>;
  onDisconnect: () => void;
}

export const KickLoginCard: React.FC<KickLoginCardProps> = ({
  user,
  connectionState,
  onConnectChannel,
  onDisconnect,
}) => {
  const [channelInput, setChannelInput] = useState('oscoliat');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devClientId, setDevClientId] = useState('');
  const [devClientSecret, setDevClientSecret] = useState('');

  const handleQuickConnect = async (customValue?: string) => {
    const value = customValue || channelInput;
    if (!value.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const ok = await onConnectChannel(value.trim());
      if (!ok) {
        setErrorMessage('Kanal bulunamadı veya Kick sunucusu yanıt vermedi. Lütfen kullanıcı adını kontrol ediniz.');
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
            Kick&apos;e Bağlanıyor...
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-kick-green/40 flex items-center justify-center font-black text-kick-green text-xl shadow-[0_0_10px_rgba(83,252,24,0.3)]">
            K
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Kick Hesap & Yayın Bağlantısı
            </h3>
            <p className="text-xs text-zinc-400">
              Canlı abone, hediye ve destekçi etkinliklerini anında yakalayın
            </p>
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {user ? (
        /* Connected State with Real Kick Data */
        <div className="space-y-4">
          <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="w-14 h-14 rounded-full border-2 border-kick-green object-cover shadow-[0_0_12px_rgba(83,252,24,0.3)]"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-kick-green flex items-center justify-center font-bold text-white text-xl">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">{user.username}</span>
                  {user.verified && (
                    <CheckCircle className="w-4 h-4 text-kick-green fill-kick-green text-black" />
                  )}
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    CANLI BAĞLI
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-400 font-mono">
                  <span>Kanal ID: <strong className="text-white">{user.channelId}</strong></span>
                  {user.followersCount !== undefined && user.followersCount > 0 && (
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Users className="w-3.5 h-3.5 text-kick-green" />
                      {user.followersCount.toLocaleString('tr-TR')} Takipçi
                    </span>
                  )}
                  <a
                    href={`https://kick.com/${user.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-kick-green hover:underline flex items-center gap-1"
                  >
                    kick.com/{user.slug} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onDisconnect}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Bağlantıyı Kes
              </button>
            </div>
          </div>

          {/* Real Channel Weekly Gift Donors If Available */}
          {user.weeklyGiftDonors && user.weeklyGiftDonors.length > 0 && (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3 text-xs">
              <span className="font-bold text-zinc-300 flex items-center gap-1.5 mb-2">
                <Gift className="w-4 h-4 text-pink-400" />
                Bu Haftanın Kick Hediye Liderleri ({user.username}):
              </span>
              <div className="flex flex-wrap gap-2">
                {user.weeklyGiftDonors.slice(0, 6).map((donor) => (
                  <span
                    key={donor.user_id}
                    className="px-2.5 py-1 bg-black/60 border border-zinc-700 rounded-lg text-zinc-300 flex items-center gap-1.5 font-mono text-[11px]"
                  >
                    <span className="font-bold text-white">{donor.username}</span>
                    <span className="text-pink-400 font-bold">🎁 {donor.quantity}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Unconnected State: Simple, Direct & Immediate */
        <div className="space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-kick-green" />
              Kick Kullanıcı Adı veya Kanal Bağlantısı Girin
            </label>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuickConnect();
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                placeholder="Örn: oscoliat veya https://kick.com/oscoliat"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-black/80 border border-zinc-700 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-kick-green font-mono"
              />
              <button
                type="submit"
                disabled={loading || !channelInput.trim()}
                className="px-6 py-2.5 bg-kick-green hover:bg-[#46d614] disabled:opacity-50 text-black rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(83,252,24,0.3)] transition-all"
              >
                {loading ? 'Bağlanıyor...' : 'Hemen Bağlan'}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
              <span>Hızlı Seçim:</span>
              <button
                type="button"
                onClick={() => {
                  setChannelInput('oscoliat');
                  handleQuickConnect('oscoliat');
                }}
                className="px-2.5 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-kick-green font-bold text-[11px] border border-kick-green/30 transition-colors"
              >
                oscoliat (Kanalınızı Bağlayın)
              </button>
            </div>
          </div>

          {/* Optional Official OAuth Developer Button */}
          <div className="flex items-center justify-between p-3.5 bg-black/40 border border-zinc-800/80 rounded-xl text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              <span>Kick Developer Portal (OAuth 2.0) API kimliklerinizi girmek ister misiniz?</span>
            </div>
            <button
              type="button"
              onClick={() => setShowDevModal(true)}
              className="text-xs text-purple-400 hover:underline font-bold"
            >
              Geliştirici Ayarları
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Developer OAuth Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-kick-card border border-kick-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-kick-green" />
              Kick Developer Portal Kimlikleri
            </h4>
            <p className="text-xs text-zinc-400">
              <a href="https://dev.kick.com" target="_blank" rel="noreferrer" className="text-kick-green underline">
                dev.kick.com
              </a>{' '}
              üzerinde oluşturduğunuz uygulamanın Client ID ve Client Secret değerlerini ekleyebilirsiniz:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">CLIENT ID</label>
                <input
                  type="text"
                  value={devClientId}
                  onChange={(e) => setDevClientId(e.target.value)}
                  placeholder="Kick Client ID"
                  className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">CLIENT SECRET</label>
                <input
                  type="password"
                  value={devClientSecret}
                  onChange={(e) => setDevClientSecret(e.target.value)}
                  placeholder="Kick Client Secret"
                  className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDevModal(false)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Geliştirici anahtarlarınız kaydedildi. Artık resmi OAuth akışını kullanabilirsiniz.');
                  setShowDevModal(false);
                }}
                className="px-4 py-2 bg-kick-green text-black rounded-lg text-xs font-bold"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
