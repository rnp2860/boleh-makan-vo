// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { FoodProvider } from '@/context/FoodContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Boleh Makan',
  description: 'The AI Nutritionist for Malaysia',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <FoodProvider>
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          </FoodProvider>
        </Providers>
      </body>
    </html>
  );
}
