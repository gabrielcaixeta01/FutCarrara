import type { Metadata, Viewport } from 'next';
import './globals.css';
import { MobileNav } from '@/components/ui/MobileNav';

export const metadata: Metadata = {
  title: 'Fut Carrara',
  description: 'Sorteio de times equilibrados para o futebol do grupo.',
};

export const viewport: Viewport = {
  themeColor: '#0d1f17',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh pb-[calc(7rem+env(safe-area-inset-bottom))]">
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
