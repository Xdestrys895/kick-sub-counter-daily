import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kick Günlük Abone Sayacı (Daily Sub Counter) & OBS Overlay',
  description: 'Kick.com yayıncıları için 15 farklı temaya sahip, gerçek zamanlı günlük abone sayacı ve OBS şeffaf widget.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-kick-darker text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
