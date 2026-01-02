// app/admin/page.tsx
// 📊 Admin Dashboard Overview Page

import { Suspense } from 'react';
import {
  Users,
  Utensils,
  Brain,
  Activity,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { StatCard, StatGrid, AlertCard, QuickActionCard } from '@/components/admin/StatCard';
import { getDashboardMetrics, getRecentActivity, getTopFoods } from './actions';

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();
  const recentActivity = await getRecentActivity(10);
  const topFoods = await getTopFoods(5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Real-time metrics and insights for Boleh Makan
        </p>
      </div>

      {/* Key Metrics */}
      <StatGrid columns={4}>
        <StatCard
          title="Total Users"
          value={metrics.users.total}
          subtitle={`+${metrics.users.new_week} this week`}
          change={metrics.users.growth_rate}
          changeLabel="vs last week"
          trend={metrics.users.growth_rate > 0 ? 'up' : metrics.users.growth_rate < 0 ? 'down' : 'neutral'}
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          iconBg="bg-indigo-100 dark:bg-indigo-900/30"
        />
        <StatCard
          title="Active Today"
          value={metrics.users.active_today}
          subtitle={`${Math.round((metrics.users.active_today / Math.max(metrics.users.total, 1)) * 100)}% of users`}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-100 dark:bg-green-900/30"
        />
        <StatCard
          title="Meals Logged Today"
          value={metrics.meals.logged_today}
          subtitle={`${metrics.meals.avg_per_user} avg per user`}
          icon={<Utensils className="w-6 h-6 text-orange-600" />}
          iconBg="bg-orange-100 dark:bg-orange-900/30"
        />
        <StatCard
          title="AI Queries Today"
          value={metrics.ai.queries_today}
          subtitle={`~$${metrics.ai.estimated_cost_today.toFixed(2)} cost`}
          icon={<Brain className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
        />
      </StatGrid>

      {/* Secondary Metrics */}
      <StatGrid columns={4}>
        <StatCard
          title="Vitals Logged Today"
          value={metrics.vitals.logged_today}
          subtitle={metrics.vitals.avg_glucose ? `Avg glucose: ${metrics.vitals.avg_glucose} mmol/L` : 'No glucose data'}
          icon={<Activity className="w-6 h-6 text-red-600" />}
          iconBg="bg-red-100 dark:bg-red-900/30"
        />
        <StatCard
          title="7-Day Retention"
          value={`${metrics.engagement.day7_retention_rate}%`}
          subtitle="Users returning after 7 days"
          icon={<Clock className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          title="Onboarding Rate"
          value={`${metrics.engagement.onboarding_completion_rate}%`}
          subtitle="Complete onboarding"
          icon={<Users className="w-6 h-6 text-teal-600" />}
          iconBg="bg-teal-100 dark:bg-teal-900/30"
        />
        <StatCard
          title="Est. Monthly Cost"
          value={`$${metrics.ai.estimated_cost_month.toFixed(2)}`}
          subtitle="AI API costs"
          icon={<DollarSign className="w-6 h-6 text-amber-600" />}
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
      </StatGrid>

      {/* Alerts Section */}
      {metrics.vitals.alerts_triggered > 0 && (
        <AlertCard
          type="warning"
          title="Health Alerts Triggered"
          message={`${metrics.vitals.alerts_triggered} users have triggered glucose alerts in the past 24 hours.`}
          action={{
            label: 'View Alerts',
            onClick: () => {},
          }}
        />
      )}

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            <Suspense fallback={<ActivitySkeleton />}>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'meal' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-200 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        User: {activity.user_id.substring(0, 12)}...
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No recent activity
                </div>
              )}
            </Suspense>
          </div>
        </div>

        {/* Top Foods */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Top Foods (30d)</h3>
          </div>
          <div className="p-4 space-y-3">
            <Suspense fallback={<TopFoodsSkeleton />}>
              {topFoods.length > 0 ? (
                topFoods.map((food, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {food.food_name}
                      </p>
                      <p className="text-xs text-slate-500">{food.category}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-500">
                      {food.count}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-4">
                  No food data yet
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="View All Users"
            description="Manage user accounts"
            icon={<Users className="w-5 h-5" />}
            onClick={() => window.location.href = '/admin/users'}
          />
          <QuickActionCard
            title="Analytics"
            description="Detailed reports"
            icon={<TrendingUp className="w-5 h-5" />}
            onClick={() => window.location.href = '/admin/analytics'}
          />
          <QuickActionCard
            title="Food Database"
            description="Manage food entries"
            icon={<Utensils className="w-5 h-5" />}
            onClick={() => window.location.href = '/admin/content/foods'}
          />
          <QuickActionCard
            title="Announcements"
            description="Send notifications"
            icon={<AlertTriangle className="w-5 h-5" />}
            onClick={() => window.location.href = '/admin/content/announcements'}
          />
        </div>
      </div>
    </div>
  );
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
  return `${diffDays}d ago`;
}

function ActivitySkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="animate-pulse flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-1" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TopFoodsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="animate-pulse flex items-center gap-3">
          <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

