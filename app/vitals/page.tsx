'use client';

// app/vitals/page.tsx
// 💓 Vitals Hub - Central page for health vitals logging and viewing

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, History, Settings, HeartPulse, Plus } from 'lucide-react';

// Vitals Components
import { VitalsSummaryCard } from '@/components/vitals/VitalsSummaryCard';
import { QuickLogFAB, QuickLogButtons } from '@/components/vitals/QuickLogFAB';
import { BPLogModal } from '@/components/vitals/BPLogModal';
import { WeightLogModal } from '@/components/vitals/WeightLogModal';
import { GlucoseLogModal } from '@/components/vitals/GlucoseLogModal';
import { LabResultsForm } from '@/components/vitals/LabResultsForm';

// Hooks
import { useVitals } from '@/hooks/useVitals';

// Types
import { VitalType } from '@/lib/vitals/types';

// Context (for user profile)
import { useFood } from '@/context/FoodContext';

// ============================================
// USER ID HELPER
// ============================================

function getUserId(): string {
  if (typeof window === 'undefined') return '';
  let userId = localStorage.getItem('boleh_makan_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('boleh_makan_user_id', userId);
  }
  return userId;
}

// ============================================
// LOADING SKELETON
// ============================================

function VitalsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-slate-200 rounded-lg" />
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
      </div>
      
      {/* Summary card skeleton */}
      <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="h-5 w-28 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-px bg-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-3 w-16 bg-slate-200 rounded mb-1" />
                  <div className="h-6 w-20 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick log buttons skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-20 bg-slate-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function VitalsPage() {
  const router = useRouter();
  const { userProfile } = useFood();
  
  // User identification
  const [userId, setUserId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  
  // Modal states
  const [showBPModal, setShowBPModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showGlucoseModal, setShowGlucoseModal] = useState(false);
  const [showLabsModal, setShowLabsModal] = useState(false);
  
  // Get user height from profile (for BMI calculation)
  const userHeightCm = userProfile?.details?.height || undefined;
  const previousWeight = userProfile?.details?.weight || undefined;
  
  // Initialize user ID on client
  useEffect(() => {
    setIsClient(true);
    setUserId(getUserId());
  }, []);
  
  // Vitals data and mutations
  const {
    summary,
    isSummaryLoading,
    summaryError,
    refetchSummary,
    logBP,
    isLoggingBP,
    logWeight,
    isLoggingWeight,
    logGlucose,
    isLoggingGlucose,
    logLabs,
    isLoggingLabs,
  } = useVitals(userId, userHeightCm);
  
  // Handle opening the right modal
  const handleLogClick = (type: VitalType) => {
    switch (type) {
      case 'bp':
        setShowBPModal(true);
        break;
      case 'weight':
        setShowWeightModal(true);
        break;
      case 'glucose':
        setShowGlucoseModal(true);
        break;
      case 'labs':
        setShowLabsModal(true);
        break;
    }
  };
  
  // Handle navigation to history
  const handleViewHistory = (type?: VitalType) => {
    if (type) {
      router.push(`/vitals/history?type=${type}`);
    } else {
      router.push('/vitals/history');
    }
  };
  
  // Don't render on server
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-lg mx-auto px-4 py-6">
          <VitalsSkeleton />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back + Title */}
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard"
                className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Vitals</h1>
                <p className="text-xs text-slate-500">Track your health metrics</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/vitals/history"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Loading State */}
        {isSummaryLoading && <VitalsSkeleton />}
        
        {/* Error State */}
        {summaryError && !isSummaryLoading && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-red-700 font-medium mb-2">
              Failed to load vitals
            </p>
            <p className="text-sm text-red-600 mb-4">
              {(summaryError as Error)?.message || 'Something went wrong'}
            </p>
            <button
              onClick={() => refetchSummary()}
              className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-xl hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Main Content (when loaded) */}
        {!isSummaryLoading && !summaryError && (
          <>
            {/* Hero Card - If no vitals yet */}
            {Object.keys(summary).length === 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <HeartPulse className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1">
                      Start Tracking Your Vitals
                    </h2>
                    <p className="text-emerald-100 text-sm mb-4">
                      Log your blood pressure, weight, glucose, and lab results to get personalized health insights from Dr. Reza.
                    </p>
                    <button
                      onClick={() => setShowBPModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Log Your First Vital
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Vitals Summary Card */}
            {Object.keys(summary).length > 0 && (
              <VitalsSummaryCard
                summary={summary}
                onLogClick={handleLogClick}
                onViewClick={handleViewHistory}
              />
            )}
            
            {/* Quick Log Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Quick Log
              </h3>
              <QuickLogButtons
                onSelectType={handleLogClick}
              />
            </div>
            
            {/* Tips Section */}
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-medium text-amber-900 mb-1">Tip</p>
                  <p className="text-sm text-amber-700">
                    Regular tracking helps identify patterns. Try to log your blood pressure at the same time each day for the most accurate trends.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Lab Results Banner */}
            <button
              onClick={() => setShowLabsModal(true)}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 text-left hover:border-blue-200 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🧪</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    Got Lab Results?
                  </p>
                  <p className="text-sm text-slate-600">
                    Add your HbA1c, cholesterol, kidney function tests
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </button>
          </>
        )}
      </main>
      
      {/* Floating Action Button */}
      <QuickLogFAB
        onSelectType={handleLogClick}
        position="bottom-right"
      />
      
      {/* Modals */}
      <BPLogModal
        isOpen={showBPModal}
        onClose={() => setShowBPModal(false)}
        onSubmit={logBP}
        isLoading={isLoggingBP}
      />
      
      <WeightLogModal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        onSubmit={logWeight}
        isLoading={isLoggingWeight}
        userHeightCm={userHeightCm}
        previousWeight={previousWeight}
      />
      
      <GlucoseLogModal
        isOpen={showGlucoseModal}
        onClose={() => setShowGlucoseModal(false)}
        onSubmit={logGlucose}
        isLoading={isLoggingGlucose}
      />
      
      <LabResultsForm
        isOpen={showLabsModal}
        onClose={() => setShowLabsModal(false)}
        onSubmit={logLabs}
        isLoading={isLoggingLabs}
      />
    </div>
  );
}


