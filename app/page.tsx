// 🇲🇾 Boleh Makan - Consumer Landing Page

import { Metadata } from 'next';
import { Suspense } from 'react';
import {
  Hero,
  ProblemSection,
  FeaturesSection,
  RamadanSection,
  HowItWorks,
  TrustSection,
  FinalCTA,
  Footer,
  LandingNav,
} from '@/components/landing';
import DeletionSuccessToast from '@/components/DeletionSuccessToast';

export const metadata: Metadata = {
  title: 'Boleh Makan - Makan Bijak, Hidup Sihat',
  description: 'Aplikasi kesihatan AI percuma untuk rakyat Malaysia yang menguruskan diabetes, darah tinggi, kolesterol, dan kesihatan buah pinggang. Termasuk mod Ramadan.',
  keywords: ['diabetes malaysia', 'darah tinggi', 'kolesterol', 'kesihatan', 'makanan malaysia', 'ramadan', 'puasa diabetes', 'aplikasi kesihatan', 'diet malaysia'],
  openGraph: {
    title: 'Boleh Makan - Makan Bijak, Hidup Sihat',
    description: 'Malaysia\'s first FREE AI health companion for managing chronic conditions through diet. Includes special Ramadan mode for fasting diabetics.',
    images: ['/og-image.png'],
    locale: 'ms_MY',
    type: 'website',
    siteName: 'Boleh Makan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boleh Makan - Makan Bijak, Hidup Sihat',
    description: 'Malaysia\'s first FREE AI health companion for managing diabetes, darah tinggi, kolesterol, and kidney health.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://bolehmakan.my',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Deletion Success Toast (shown when redirected after account deletion) */}
      <Suspense fallback={null}>
        <DeletionSuccessToast />
      </Suspense>
      
      {/* Navigation */}
      <Suspense fallback={<div className="h-16" />}>
        <LandingNav />
      </Suspense>
      
      {/* Hero Section */}
      <Hero />
      
      {/* Problem Section - Statistics */}
      <ProblemSection />
      
      {/* Features Section */}
      <section id="features">
        <FeaturesSection />
      </section>
      
      {/* Ramadan Special Section */}
      <section id="ramadan">
        <RamadanSection />
      </section>
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Trust Section */}
      <TrustSection />
      
      {/* Final CTA */}
      <section id="signup">
        <FinalCTA />
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
