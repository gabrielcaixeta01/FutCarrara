import type { Metadata, Viewport } from 'next';
import './globals.css';

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
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
