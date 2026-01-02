// app/admin/users/[userId]/page.tsx
// 👤 Admin User Detail Page

export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Activity,
  Utensils,
  Heart,
  TrendingUp,
  Download,
  AlertTriangle,
  Shield,
  Trash2,
} from 'lucide-react';
import { getSupabaseServiceClient } from '@/lib/supabase';

async function getUserDetail(userId: string) {
  const supabase = getSupabaseServiceClient();

  // Get user profile
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !profile) {
    return null;
  }

  // Get meal stats
  const { count: totalMeals } = await supabase
    .from('food_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get recent meals
  const { data: recentMeals } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get vitals stats
  const { count: totalVitals } = await supabase
    .from('user_vitals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get recent vitals
  const { data: recentVitals } = await supabase
    .from('user_vitals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get streak info
  const { data: streakData } = await supabase
    .from('user_profiles')
    .select('current_streak, longest_streak')
    .eq('user_id', userId)
    .single();

  // Get analytics events count
  const { count: aiQueries } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('event_name', 'meal_logged');

  return {
    profile,
    stats: {
      totalMeals: totalMeals || 0,
      totalVitals: totalVitals || 0,
      currentStreak: streakData?.current_streak || 0,
      longestStreak: streakData?.longest_streak || 0,
      aiQueries: aiQueries || 0,
    },
    recentMeals: recentMeals || [],
    recentVitals: recentVitals || [],
  };
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const userData = await getUserDetail(userId);

  if (!userData) {
    notFound();
  }

  const { profile, stats, recentMeals, recentVitals } = userData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Details</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            ID: {userId}
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {(profile.display_name || profile.email || 'U')[0].toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {profile.display_name || 'No name set'}
            </h2>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="w-4 h-4" />
                <span>{profile.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button className="px-4 py-2 text-sm font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Suspend
            </button>
            <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatBox
          label="Total Meals"
          value={stats.totalMeals}
          icon={<Utensils className="w-5 h-5 text-orange-500" />}
        />
        <StatBox
          label="Total Vitals"
          value={stats.totalVitals}
          icon={<Activity className="w-5 h-5 text-blue-500" />}
        />
        <StatBox
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
        />
        <StatBox
          label="Longest Streak"
          value={`${stats.longestStreak} days`}
          icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
        />
        <StatBox
          label="AI Queries"
          value={stats.aiQueries}
          icon={<Activity className="w-5 h-5 text-indigo-500" />}
        />
      </div>

      {/* Health Profile */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Health Profile
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem label="Age" value={profile.age || 'Not set'} />
          <InfoItem label="Gender" value={profile.gender || 'Not set'} />
          <InfoItem label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : 'Not set'} />
          <InfoItem label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : 'Not set'} />
          <InfoItem label="Activity Level" value={profile.activity_level || 'Not set'} />
          <InfoItem
            label="Health Conditions"
            value={profile.health_conditions?.join(', ') || 'None'}
          />
          <InfoItem
            label="Health Goals"
            value={profile.health_goals?.join(', ') || 'None'}
          />
          <InfoItem
            label="Calorie Target"
            value={profile.daily_targets?.calories ? `${profile.daily_targets.calories} kcal` : 'Not set'}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Meals */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-500" />
              Recent Meals
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentMeals.length > 0 ? (
              recentMeals.map((meal: any) => (
                <div key={meal.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {meal.food_name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {meal.calories} kcal • {meal.category || 'Unknown'}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatTimeAgo(meal.created_at)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">No meals logged yet</div>
            )}
          </div>
        </div>

        {/* Recent Vitals */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Recent Vitals
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentVitals.length > 0 ? (
              recentVitals.map((vital: any) => (
                <div key={vital.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white capitalize">
                        {vital.vital_type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-slate-500">
                        {vital.reading_value} {vital.unit} • {vital.context_tag || 'General'}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatTimeAgo(vital.created_at)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">No vitals logged yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium text-slate-900 dark:text-white">{value}</p>
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

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(timestamp);
}

