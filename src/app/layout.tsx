import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { AppProvider } from '@/contexts/AppContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Les Parias - Performance Tracking',
  description: 'Suivez les performances de votre équipe LoL avec des analyses détaillées et des descriptions dynamiques',
  keywords: 'League of Legends, LoL, gaming, performance, tracking, squad, team, Les Parias',
  authors: [{ name: 'Les Parias Team' }],
          icons: {
          icon: '/vrai-logo.png',
          apple: '/vrai-logo.png',
        },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AppProvider>
          <Header />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
