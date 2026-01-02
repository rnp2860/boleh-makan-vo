'use client';

// app/t/[tenantSlug]/dashboard/page.tsx
// 🏢 Tenant Dashboard - Main dashboard for tenant users

import { useTenant, useTenantFeatures } from '@/lib/tenant';
import { TenantLogo } from '@/components/tenant/TenantBrandingProvider';
import Link from 'next/link';
import { 
  Utensils, Activity, MessageSquare, Moon, 
  ChevronRight, BarChart3, Settings 
} from 'lucide-react';

export default function TenantDashboardPage() {
  const { tenant, tenantName, branding } = useTenant();
  const features = useTenantFeatures();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header 
        className="border-b"
        style={{ 
          backgroundColor: branding.primary_color + '10',
          borderColor: branding.primary_color + '30',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <TenantLogo maxHeight={36} />
          <nav className="flex items-center space-x-4">
            <Link 
              href={`/t/${tenant.slug}/profile`}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Profile
            </Link>
            <Link 
              href={`/t/${tenant.slug}/settings`}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to {tenantName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your meals, monitor your health, and get personalized recommendations.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Log Meal */}
          <Link
            href={`/t/${tenant.slug}/check-food`}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
            style={{ '--hover-color': branding.primary_color } as any}
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: branding.primary_color + '20' }}
            >
              <Utensils className="h-6 w-6" style={{ color: branding.primary_color }} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
              Log a Meal
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Take a photo or search for food items
            </p>
          </Link>

          {/* Log Vitals */}
          <Link
            href={`/t/${tenant.slug}/vitals`}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: branding.secondary_color + '20' }}
            >
              <Activity className="h-6 w-6" style={{ color: branding.secondary_color }} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
              Log Vitals
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Record blood glucose, weight, and more
            </p>
          </Link>

          {/* AI Advisor */}
          {features.ai_enabled && (
            <Link
              href={`/t/${tenant.slug}/chat`}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: branding.accent_color + '20' }}
              >
                <MessageSquare className="h-6 w-6" style={{ color: branding.accent_color }} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                Dr. Reza AI
                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Get personalized nutrition advice
              </p>
            </Link>
          )}

          {/* Reports */}
          <Link
            href={`/t/${tenant.slug}/reports`}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
              Reports
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View your health trends and insights
            </p>
          </Link>

          {/* Ramadan Mode */}
          {features.ramadan_mode && (
            <Link
              href={`/t/${tenant.slug}/ramadan`}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <Moon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                Ramadan Mode
                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fasting tracker and iftar planning
              </p>
            </Link>
          )}
        </div>

        {/* Today's Summary Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0g</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0g</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Blood Sugar</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Powered by <span className="font-medium">Boleh Makan</span>
        </div>
      </footer>
    </div>
  );
}


