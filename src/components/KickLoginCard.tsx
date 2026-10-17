'use client';

import React, { useState } from 'react';
import { KickChannelDetails } from '@/lib/kick-api';
import { AlertCircle, ArrowRight, BadgeCheck, ExternalLink, Loader2 } from 'lucide-react';
import { Button, Panel, PanelHeader } from './ui';

interface KickLoginCardProps {
  user: KickChannelDetails | null;
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error';
  onConnectChannel: (input: string) => Promise<boolean>;
  onDisconnect: () => void;
}

export const KickLoginCard: React.FC<KickLoginCardProps> = ({ user, onConnectChannel, onDisconnect }) => {
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
      if (!ok) setErrorMessage('Kanal bulunamadı. Kullanıcı adını veya linki kontrol edin.');
      else setChannelInput('');
    } catch {
      setErrorMessage('Bağlantı sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel>
      <PanelHeader title="Kanal" hint="Abone olayları bu kanaldan canlı dinlenir." />
      <div className="p-5">
        {user ? (
          <div className="flex items-center gap-3">
            {user.profilePic ? (
              <img src={user.profilePic} alt="" className="h-11 w-11 rounded-full object-cover ring-1 ring-line-strong" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-raised text-sm font-semibold ring-1 ring-line-strong">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold">{user.username}</span>
                {user.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />}
              </div>
              <a
                href={`https://kick.com/${user.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"
              >
                kick.com/{user.slug} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Button size="sm" variant="ghost" onClick={onDisconnect}>
              Değiştir
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="kick.com/kanaladi veya kanaladi"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-base px-3 text-sm placeholder:text-muted/70 focus:border-accent/60 focus:outline-none"
              />
              <Button type="submit" variant="primary" disabled={loading || !channelInput.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Bağlan
              </Button>
            </div>
            {errorMessage && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" /> {errorMessage}
              </p>
            )}
          </form>
        )}
      </div>
    </Panel>
  );
};
