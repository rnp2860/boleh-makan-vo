// app/admin/system/feature-flags/page.tsx
// 🚩 Feature Flags Management

import {
  Flag,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Users,
  Percent,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';
import { getSupabaseServiceClient } from '@/lib/supabase';

async function getFeatureFlags() {
  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from('feature_flags')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching feature flags:', error);
    return [];
  }

  return data || [];
}

export default async function FeatureFlagsPage() {
  const flags = await getFeatureFlags();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Feature Flags</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Control feature rollouts and experiments
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Flag
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search flags..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Feature Flags List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        {flags.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {flags.map((flag: any) => (
              <div key={flag.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${flag.is_enabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {flag.is_enabled ? (
                      <ToggleRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {flag.display_name}
                      </h3>
                      <code className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                        {flag.flag_key}
                      </code>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {flag.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        {flag.rollout_percentage}% rollout
                      </span>
                      {flag.target_users?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {flag.target_users.length} targeted users
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(flag.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Toggle Switch */}
                    <button
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        flag.is_enabled
                          ? 'bg-green-500'
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          flag.is_enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Flag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 dark:text-white mb-2">No feature flags yet</h3>
            <p className="text-sm text-slate-500 mb-4">Create flags to control feature rollouts</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create First Flag
            </button>
          </div>
        )}
      </div>

      {/* Common Flags Suggestions */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
        <h3 className="font-medium text-slate-900 dark:text-white mb-4">Suggested Flags</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'ramadan_mode', name: 'Ramadan Mode', description: 'Enable Ramadan fasting features' },
            { key: 'ai_food_scan', name: 'AI Food Scan', description: 'Vision-based food analysis' },
            { key: 'premium_features', name: 'Premium Features', description: 'Gate premium functionality' },
            { key: 'dr_reza_chat', name: 'Dr. Reza Chat', description: 'AI nutrition advisor' },
            { key: 'glucose_tracking', name: 'Glucose Tracking', description: 'Blood sugar monitoring' },
            { key: 'beta_ui', name: 'Beta UI', description: 'New interface experiments' },
          ].map(suggestion => (
            <button
              key={suggestion.key}
              className="text-left p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <p className="font-medium text-slate-700 dark:text-white text-sm">{suggestion.name}</p>
              <p className="text-xs text-slate-500 mt-1">{suggestion.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

