import type { Metadata, Viewport } from 'next';
import { Anton, Manrope } from 'next/font/google';
import './globals.css';
import { MobileNav } from '@/components/ui/MobileNav';
import { ServiceWorkerRegister } from '@/components/ui/ServiceWorkerRegister';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fut Carrara',
  description: 'Marque quem chegou e tire times equilibrados em segundos.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fut Carrara',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b1a12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${manrope.variable}`}>
      <body className="min-h-dvh pb-[calc(7rem+env(safe-area-inset-bottom))] font-body">
        {children}
        <MobileNav />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
