'use client';

// app/cgm/page.tsx
// 📊 CGM Landing Page - Main CGM info, waitlist signup, and status

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Activity, Zap, TrendingUp, Bell, Share2, 
  Target, Sparkles, Users, ChevronRight,
  CheckCircle, ArrowRight
} from 'lucide-react';
import { CGMTeaser } from '@/components/cgm/CGMTeaser';
import { WaitlistSignupModal } from '@/components/cgm/WaitlistSignupModal';
import { WaitlistStatus } from '@/components/cgm/WaitlistStatus';
import { WaitlistStatusResponse, CGMWaitlistEntry } from '@/lib/cgm/types';
import { CGM_FEATURES, CGM_DEVICES, POPULAR_DEVICES_MY } from '@/lib/cgm/devices';

// ============================================
// PAGE CONTENT COMPONENT (uses useSearchParams)
// ============================================

function CGMPageContent() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userStatus, setUserStatus] = useState<WaitlistStatusResponse | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ referralCode: string; position: number } | null>(null);

  // Check if user is already on waitlist
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [statusRes, countRes] = await Promise.all([
          fetch('/api/cgm/waitlist/status'),
          fetch('/api/cgm/waitlist/count'),
        ]);
        
        const statusData = await statusRes.json();
        const countData = await countRes.json();
        
        if (statusData.success && statusData.status) {
          setUserStatus(statusData.status);
        }
        
        if (countData.success) {
          setWaitlistCount(countData.count);
        }
      } catch (error) {
        console.error('Failed to check status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStatus();
  }, []);

  const handleSignupSuccess = (data: { referralCode: string; position: number }) => {
    setSuccessData(data);
    setShowSuccess(true);
    setIsModalOpen(false);
    
    // Refetch status
    fetch('/api/cgm/waitlist/status')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.status) {
          setUserStatus(data.status);
        }
      });
  };

  // Success screen
  if (showSuccess && successData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950 py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Success animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            You're on the List! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            You're <span className="font-bold text-violet-600 dark:text-violet-400">#{successData.position}</span> in the queue.
            We'll notify you when CGM integration launches!
          </p>
          
          {/* Share prompt */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Want to move up faster?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Share your referral code and move up +5 positions for each friend who joins!
            </p>
            
            <div className="flex items-center justify-center space-x-3 p-3 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
              <span className="font-mono font-bold text-xl text-violet-600 dark:text-violet-400">
                {successData.referralCode}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => {
              setShowSuccess(false);
            }}
            className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            View My Status
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Coming Soon to Boleh Makan
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Automatic{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
              CGM Integration
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect your FreeStyle Libre, Dexcom, or other CGM device to automatically sync your glucose readings. No more manual logging!
          </p>
          
          {/* Stats */}
          {waitlistCount > 100 && (
            <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 mb-8">
              <Users className="h-5 w-5" />
              <span>
                <strong className="text-gray-900 dark:text-white">{waitlistCount.toLocaleString()}</strong>
                {' '}people on the waitlist
              </span>
            </div>
          )}
          
          {/* CTA */}
          {!isLoading && !userStatus ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="
                inline-flex items-center px-8 py-4 
                bg-gradient-to-r from-violet-600 to-fuchsia-600 
                text-white text-lg font-semibold rounded-xl
                hover:from-violet-700 hover:to-fuchsia-700 
                shadow-lg shadow-violet-500/25
                transition-all duration-300 hover:scale-105
              "
            >
              <Activity className="h-6 w-6 mr-3" />
              Join the Waitlist
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          ) : (
            <p className="text-lg text-violet-600 dark:text-violet-400 font-medium">
              ✓ You're on the waitlist!
            </p>
          )}
          
          {/* Referral notice */}
          {referralCode && !userStatus && (
            <p className="mt-4 text-sm text-green-600 dark:text-green-400">
              🎁 You were referred! You'll get priority access.
            </p>
          )}
        </div>
      </section>

      {/* User Status Section (if on waitlist) */}
      {userStatus && (
        <section className="px-4 py-8 max-w-2xl mx-auto">
          <WaitlistStatus status={userStatus} />
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 py-16 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What You'll Get
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Powerful features to help you manage your diabetes better
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CGM_FEATURES.slice(0, 8).map((feature) => {
              const icons: Record<string, React.ElementType> = {
                auto_sync: Zap,
                meal_correlation: TrendingUp,
                predictive_alerts: Bell,
                doctor_sharing: Share2,
                time_in_range: Target,
                ai_insights: Sparkles,
              };
              const Icon = icons[feature.code] || Sparkles;
              
              return (
                <div
                  key={feature.code}
                  className="relative p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  {feature.isPremium && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded">
                      Premium
                    </span>
                  )}
                  <div className="w-12 h-12 mb-4 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Devices Section */}
      <section className="px-4 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Supported Devices
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We're starting with the most popular CGMs in Malaysia
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {POPULAR_DEVICES_MY.map((deviceId) => {
              const device = CGM_DEVICES[deviceId];
              return (
                <div
                  key={device.id}
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-2xl flex items-center justify-center">
                    <Activity className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {device.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {device.manufacturer}
                  </p>
                  {device.approxPriceMYR && (
                    <p className="text-xs text-gray-400 mt-1">
                      ~RM{device.approxPriceMYR}/sensor
                    </p>
                  )}
                </div>
              );
            })}
            
            {/* More coming */}
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">+</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                More Coming
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dexcom, Medtronic & more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: "When will CGM integration launch?",
                a: "We're targeting Q2 2026 for the initial beta with FreeStyle Libre devices. Join the waitlist to be among the first to try it!"
              },
              {
                q: "How does the waitlist work?",
                a: "When you join, you'll get a position in the queue. You can move up by referring friends. When we launch, we'll invite users in order of their position."
              },
              {
                q: "Will it work with my device?",
                a: "We're starting with FreeStyle Libre devices (which work with LibreView). Dexcom and other devices will follow. Join the waitlist and tell us which device you use!"
              },
              {
                q: "Is there a cost for CGM integration?",
                a: "Basic features like auto-sync will be free. Some advanced features like AI insights and predictive alerts may be part of a premium tier."
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.q}
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      {!userStatus && (
        <section className="px-4 py-16 bg-gradient-to-r from-violet-600 to-fuchsia-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Diabetes Management?
            </h2>
            <p className="text-white/80 mb-8">
              Join the waitlist today and be among the first to experience automatic CGM integration.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="
                inline-flex items-center px-8 py-4 
                bg-white text-violet-700 text-lg font-semibold rounded-xl
                hover:bg-gray-100 shadow-lg
                transition-all duration-300 hover:scale-105
              "
            >
              <Activity className="h-6 w-6 mr-3" />
              Join the Waitlist
            </button>
          </div>
        </section>
      )}

      {/* Signup Modal */}
      <WaitlistSignupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSignupSuccess}
        referralCode={referralCode || undefined}
      />
    </div>
  );
}

// ============================================
// PAGE COMPONENT (wraps content in Suspense)
// ============================================

export default function CGMPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <CGMPageContent />
    </Suspense>
  );
}


