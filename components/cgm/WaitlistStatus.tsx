'use client';

// components/cgm/WaitlistStatus.tsx
// 📊 Waitlist Status - Shows user's position and status

import React from 'react';
import { 
  Activity, Trophy, Clock, Users, TrendingUp,
  CheckCircle, Send, Sparkles, Gift
} from 'lucide-react';
import { WaitlistStatusResponse, WaitlistStatus as WaitlistStatusType } from '@/lib/cgm/types';
import { WaitlistShareCard } from './WaitlistShareCard';

// ============================================
// TYPES
// ============================================

interface WaitlistStatusProps {
  status: WaitlistStatusResponse;
  onUpdatePreferences?: () => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function WaitlistStatus({
  status,
  onUpdatePreferences,
  className = '',
}: WaitlistStatusProps) {
  const { entry, effectivePosition, totalWaiting, estimatedWaitWeeks, referralUrl } = status;

  const getStatusInfo = (statusType: WaitlistStatusType) => {
    switch (statusType) {
      case 'beta_invited':
        return {
          icon: Send,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          title: 'Beta Invitation Sent!',
          description: 'Check your email for instructions to join the beta.',
        };
      case 'beta_active':
        return {
          icon: Sparkles,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          title: "You're in the Beta!",
          description: 'You have early access to CGM integration.',
        };
      case 'converted':
        return {
          icon: CheckCircle,
          color: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
          title: 'CGM Integration Active',
          description: 'Your CGM is connected and syncing.',
        };
      default:
        return {
          icon: Clock,
          color: 'text-violet-600 dark:text-violet-400',
          bgColor: 'bg-violet-100 dark:bg-violet-900/30',
          title: "You're on the Waitlist!",
          description: "We'll notify you when it's your turn.",
        };
    }
  };

  const statusInfo = getStatusInfo(entry.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Status Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
        
        <div className="relative">
          {/* Status header */}
          <div className="flex items-start space-x-4 mb-6">
            <div className={`p-3 rounded-xl ${statusInfo.bgColor}`}>
              <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {statusInfo.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {statusInfo.description}
              </p>
            </div>
          </div>

          {/* Waiting status details */}
          {entry.status === 'waiting' && (
            <>
              {/* Position stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-5 w-5 text-amber-500 mr-1" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    #{effectivePosition}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your Position
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-blue-500 mr-1" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalWaiting.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Waiting
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-violet-500 mr-1" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ~{estimatedWaitWeeks}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Weeks Est.
                  </p>
                </div>
              </div>

              {/* Boost info */}
              {entry.queue_boost > 0 && (
                <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    You've moved up <strong>{entry.queue_boost} positions</strong> from referrals!
                  </span>
                </div>
              )}

              {/* Referral encouragement */}
              {entry.referral_count > 0 ? (
                <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                  <span className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>{entry.referral_count}</strong> friend{entry.referral_count > 1 ? 's' : ''} joined using your code!
                  </span>
                </div>
              ) : (
                <div className="flex items-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  <Gift className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" />
                  <span className="text-sm text-violet-700 dark:text-violet-300">
                    Share your referral link to move up the queue!
                  </span>
                </div>
              )}
            </>
          )}

          {/* Update preferences button */}
          {onUpdatePreferences && (
            <button
              onClick={onUpdatePreferences}
              className="mt-4 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Update Preferences
            </button>
          )}
        </div>
      </div>

      {/* Share card for waiting users */}
      {entry.status === 'waiting' && (
        <WaitlistShareCard
          referralCode={entry.referral_code}
          referralUrl={referralUrl}
          referralCount={entry.referral_count}
        />
      )}

      {/* User's preferences summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Your Preferences
        </h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Device</span>
            <span className="text-gray-900 dark:text-white font-medium capitalize">
              {entry.current_device?.replace(/_/g, ' ') || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Usage</span>
            <span className="text-gray-900 dark:text-white font-medium capitalize">
              {entry.usage_frequency?.replace(/_/g, ' ') || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Email Updates</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {entry.email_updates ? 'Yes' : 'No'}
            </span>
          </div>
          {entry.desired_features && entry.desired_features.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400 block mb-2">Interested Features</span>
              <div className="flex flex-wrap gap-1">
                {entry.desired_features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs rounded-full capitalize"
                  >
                    {feature.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


