'use client';

// components/cgm/WaitlistShareCard.tsx
// 📊 Waitlist Share Card - Referral sharing component

import React, { useState } from 'react';
import { 
  Share2, Copy, Check, Gift, 
  Twitter, Facebook, MessageCircle, Mail
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface WaitlistShareCardProps {
  referralCode: string;
  referralUrl: string;
  referralCount: number;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function WaitlistShareCard({
  referralCode,
  referralUrl,
  referralCount,
  className = '',
}: WaitlistShareCardProps) {
  const [copied, setCopied] = useState(false);

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
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(referralUrl)}`,
      color: 'hover:bg-sky-500 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${shareText}%20${encodeURIComponent(referralUrl)}`,
      color: 'hover:bg-green-500 hover:text-white',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=Join%20the%20CGM%20Waitlist&body=${shareText}%20${encodeURIComponent(referralUrl)}`,
      color: 'hover:bg-gray-700 hover:text-white',
    },
  ];

  return (
    <div className={`
      relative overflow-hidden
      bg-gradient-to-br from-violet-50 to-fuchsia-50
      dark:from-violet-950/50 dark:to-fuchsia-950/50
      border border-violet-200 dark:border-violet-800
      rounded-2xl p-6
      ${className}
    `}>
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-violet-500 rounded-xl">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Move Up the Queue!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Each friend who joins moves you +5 positions
            </p>
          </div>
        </div>

        {/* Referral stats */}
        {referralCount > 0 && (
          <div className="flex items-center p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg mb-4">
            <span className="text-2xl font-bold text-violet-600 dark:text-violet-400 mr-2">
              {referralCount}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              friend{referralCount > 1 ? 's' : ''} joined • You've moved up <strong>{referralCount * 5}</strong> spots!
            </span>
          </div>
        )}

        {/* Referral code */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Your Referral Code
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono font-bold text-lg text-center text-violet-600 dark:text-violet-400">
              {referralCode}
            </div>
            <button
              onClick={() => copyToClipboard(referralCode)}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Referral link */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Share Link
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-lg text-sm text-gray-600 dark:text-gray-300 truncate"
            />
            <button
              onClick={() => copyToClipboard(referralUrl)}
              className="px-4 py-2.5 bg-violet-600 text-white rounded-r-lg hover:bg-violet-700 transition-colors flex items-center"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social share buttons */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Share on Social Media
          </label>
          <div className="flex items-center space-x-2">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex-1 flex items-center justify-center p-3 
                  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                  rounded-lg transition-colors
                  ${link.color}
                `}
                title={`Share on ${link.name}`}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Native share (mobile) */}
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
    </div>
  );
}

// ============================================
// MINI SHARE BUTTON
// ============================================

interface MiniShareButtonProps {
  referralUrl: string;
  className?: string;
}

export function MiniShareButton({ referralUrl, className = '' }: MiniShareButtonProps) {
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'Join the CGM Waitlist',
          text: 'Auto-sync your glucose readings with Boleh Makan!',
          url: referralUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(referralUrl);
        alert('Link copied to clipboard!');
      } else {
        // Final fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = referralUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`
        inline-flex items-center px-4 py-2 
        bg-violet-100 dark:bg-violet-900/50 
        text-violet-700 dark:text-violet-300 
        rounded-lg font-medium text-sm
        hover:bg-violet-200 dark:hover:bg-violet-900/70 
        transition-colors
        ${className}
      `}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share & Move Up
    </button>
  );
}


