// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MobileLayout } from '@/components/MobileLayout';
import { FoodProvider } from '@/context/FoodContext'; // Import the Brain

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
        {/* 1. ACTIVATE THE BRAIN */}
        <FoodProvider>
          {/* 2. RENDER THE SHELL */}
          <MobileLayout>
            {children}
          </MobileLayout>
        </FoodProvider>
      </body>
    </html>
  );
}