// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MobileLayout } from '@/components/MobileLayout'; // Import our new shell

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Boleh Makan',
  description: 'The AI Nutritionist for Malaysia',
  manifest: '/manifest.json', // We will add this later for PWA
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* WRAP EVERYTHING IN THE MOBILE SHELL */}
        <MobileLayout>
          {children}
        </MobileLayout>
      </body>
    </html>
  );
}