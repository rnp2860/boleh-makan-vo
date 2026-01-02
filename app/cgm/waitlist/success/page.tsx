'use client';

// app/cgm/waitlist/success/page.tsx
// 📊 CGM Waitlist Success Page - Confirmation after signup

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, Copy, Check, Share2, ArrowRight,
  Twitter, Facebook, MessageCircle, Mail, Gift, Activity
} from 'lucide-react';

// ============================================
// CONTENT COMPONENT
// ============================================

function SuccessContent() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('code') || '';
  const position = parseInt(searchParams.get('pos') || '0');
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://bolehmakan.my';
  const referralUrl = `${baseUrl}/cgm?ref=${referralCode}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareText = encodeURIComponent(
    "I just joined the waitlist for CGM integration on Boleh Makan! Auto-sync your glucose readings and see how food affects your blood sugar. Join me:"
  );

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${shareText}%20${encodeURIComponent(referralUrl)}`,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(referralUrl)}`,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=Join%20the%20CGM%20Waitlist&body=${shareText}%20${encodeURIComponent(referralUrl)}`,
      color: 'bg-gray-700 hover:bg-gray-800',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-violet-500/30">
              <CheckCircle className="h-14 w-14 text-white" />
            </div>
            {/* Confetti-like dots */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-3 w-3 h-3 bg-pink-400 rounded-full animate-ping delay-100" />
            <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-200" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
          You're on the List! 🎉
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
          You're <span className="font-bold text-violet-600 dark:text-violet-400">#{position}</span> in the queue.
          We'll email you when it's your turn!
        </p>

        {/* Share Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-xl">
              <Gift className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Skip the Queue!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Move up +5 positions for each friend who joins
              </p>
            </div>
          </div>

          {/* Referral Code */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              Your Referral Code
            </label>
            <div className="flex items-center">
              <div className="flex-1 px-4 py-3 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 rounded-l-xl font-mono font-bold text-xl text-center text-violet-600 dark:text-violet-400">
                {referralCode}
              </div>
              <button
                onClick={() => copyToClipboard(referralCode)}
                className="px-4 py-3 bg-violet-600 text-white rounded-r-xl hover:bg-violet-700 transition-colors"
              >
                {copied ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Share Link */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              Share Link
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={referralUrl}
                readOnly
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-l-xl text-sm text-gray-600 dark:text-gray-300 truncate"
              />
              <button
                onClick={() => copyToClipboard(referralUrl)}
                className="px-4 py-2.5 bg-gray-800 dark:bg-gray-600 text-white rounded-r-xl hover:bg-gray-900 dark:hover:bg-gray-500 transition-colors flex items-center text-sm font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-3 rounded-xl text-white transition-colors ${link.color}`}
              >
                <link.icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={() => {
                navigator.share({
                  title: 'Join the CGM Waitlist',
                  text: 'Auto-sync your glucose readings with Boleh Makan!',
                  url: referralUrl,
                });
              }}
              className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-fuchsia-700 transition-all"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share with Friends
            </button>
          )}
        </div>

        {/* What's Next */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            What happens next?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We're building CGM integration – expected Q2 2026
              </p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We'll email you monthly updates on progress
              </p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                When ready, you'll get early access based on queue position
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/cgm"
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Activity className="h-5 w-5 mr-2" />
            View Status
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE COMPONENT
// ============================================

export default function WaitlistSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}


