import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'League Squad Tracker',
  description: 'Suivez les performances de votre équipe LoL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-900 text-white overflow-x-hidden`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
