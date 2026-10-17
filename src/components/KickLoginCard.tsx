'use client';

import React, { useState } from 'react';
import { KickChannelDetails } from '@/lib/kick-api';
import { Radio, CheckCircle, ExternalLink, LogOut, ArrowRight, AlertCircle, Users } from 'lucide-react';

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
  const [channelInput, setChannelInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const ok = await onConnectChannel(channelInput.trim());
      if (!ok) {
        setErrorMessage('Kanal bulunamadı. Lütfen kullanıcı adını veya linki kontrol edin.');
      } else {
        setChannelInput('');
      }
    } catch {
      setErrorMessage('Bağlantı sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-kick-card border border-kick-border rounded-2xl p-4 sm:p-5 shadow-lg">
      {user ? (
        /* Connected: Ultra Clean Status Bar */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.username}
                className="w-10 h-10 rounded-full border-2 border-kick-green object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-kick-green flex items-center justify-center font-bold text-white text-base">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">{user.username}</span>
                {user.verified && <CheckCircle className="w-3.5 h-3.5 text-kick-green fill-kick-green text-black" />}
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Canlı Dinleniyor
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-0.5">
                {user.followersCount !== undefined && user.followersCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-zinc-500" />
                    {user.followersCount.toLocaleString('tr-TR')} Takipçi
                  </span>
                )}
                <a
                  href={`https://kick.com/${user.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-kick-green hover:underline flex items-center gap-0.5"
                >
                  kick.com/{user.slug} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={onDisconnect}
            className="self-start sm:self-center px-3 py-1.5 bg-zinc-800/80 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 border border-zinc-700 text-zinc-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3 h-3" /> Kanalı Değiştir
          </button>
        </div>
      ) : (
        /* Not Connected: Simple Direct Link Input */
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Kick Linki veya Kullanıcı Adı (Örn: oscoliat veya kick.com/oscoliat)"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/70 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm placeholder:text-zinc-600 focus:outline-none focus:border-kick-green"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !channelInput.trim()}
              className="px-5 py-2.5 bg-kick-green hover:bg-[#46d614] disabled:opacity-50 text-black font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(83,252,24,0.3)] transition-all shrink-0"
            >
              {loading ? (
                'Bağlanıyor...'
              ) : (
                <>
                  <span>Bağlan</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-2.5 text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
