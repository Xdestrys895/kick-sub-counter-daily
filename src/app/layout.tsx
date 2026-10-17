import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Kick Günlük Abone Sayacı',
  description: 'Kick.com yayıncıları için gerçek zamanlı günlük abone sayacı ve OBS overlay.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`dark ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-base font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
