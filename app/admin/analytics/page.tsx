// app/admin/analytics/page.tsx
// 📈 Admin Analytics Dashboard

import { Suspense } from 'react';
import {
  TrendingUp,
  Users,
  Utensils,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { getSupabaseServiceClient } from '@/lib/supabase';

async function getAnalyticsData() {
  const supabase = getSupabaseServiceClient();
  const now = new Date();
  
  // Get user growth data (last 30 days)
  const userGrowth: { date: string; total: number; new: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const nextDateStr = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { count: newUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateStr)
      .lt('created_at', nextDateStr);

    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', nextDateStr);

    userGrowth.push({
      date: dateStr,
      total: totalUsers || 0,
      new: newUsers || 0,
    });
  }

  // Get meal logging trends (last 30 days)
  const mealTrends: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const nextDateStr = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { count } = await supabase
      .from('food_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateStr)
      .lt('created_at', nextDateStr);

    mealTrends.push({
      date: dateStr,
      count: count || 0,
    });
  }

  // Get top foods (last 30 days)
  const { data: foodLogs } = await supabase
    .from('food_logs')
    .select('food_name, category')
    .gte('created_at', new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const foodCounts: Record<string, { count: number; category: string }> = {};
  foodLogs?.forEach(log => {
    const name = log.food_name || 'Unknown';
    if (!foodCounts[name]) {
      foodCounts[name] = { count: 0, category: log.category || 'Other' };
    }
    foodCounts[name].count++;
  });

  const topFoods = Object.entries(foodCounts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Get category breakdown
  const { data: categoryData } = await supabase
    .from('food_logs')
    .select('category')
    .gte('created_at', new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const categoryCounts: Record<string, number> = {};
  categoryData?.forEach(log => {
    const cat = log.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate retention (simplified)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const { count: usersThirtyDaysAgo } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .lt('created_at', thirtyDaysAgo.toISOString());

  const { data: activeLastWeek } = await supabase
    .from('food_logs')
    .select('user_id')
    .gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const uniqueActiveUsers = new Set(activeLastWeek?.map(l => l.user_id) || []).size;
  const retentionRate = usersThirtyDaysAgo && usersThirtyDaysAgo > 0
    ? Math.round((uniqueActiveUsers / usersThirtyDaysAgo) * 100)
    : 0;

  return {
    userGrowth,
    mealTrends,
    topFoods,
    categoryBreakdown,
    retentionRate,
  };
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();

  // Calculate summary stats
  const totalNewUsers = data.userGrowth.reduce((sum, d) => sum + d.new, 0);
  const avgDailyMeals = Math.round(
    data.mealTrends.reduce((sum, d) => sum + d.count, 0) / data.mealTrends.length
  );
  const lastWeekMeals = data.mealTrends.slice(-7).reduce((sum, d) => sum + d.count, 0);
  const prevWeekMeals = data.mealTrends.slice(-14, -7).reduce((sum, d) => sum + d.count, 0);
  const mealGrowth = prevWeekMeals > 0
    ? Math.round(((lastWeekMeals - prevWeekMeals) / prevWeekMeals) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Insights and trends for the past 30 days
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="New Users (30d)"
          value={totalNewUsers}
          icon={<Users className="w-5 h-5 text-indigo-500" />}
        />
        <SummaryCard
          title="Avg Daily Meals"
          value={avgDailyMeals}
          icon={<Utensils className="w-5 h-5 text-orange-500" />}
        />
        <SummaryCard
          title="Weekly Meal Change"
          value={`${mealGrowth > 0 ? '+' : ''}${mealGrowth}%`}
          icon={mealGrowth >= 0 
            ? <ArrowUpRight className="w-5 h-5 text-green-500" />
            : <ArrowDownRight className="w-5 h-5 text-red-500" />
          }
        />
        <SummaryCard
          title="Retention Rate"
          value={`${data.retentionRate}%`}
          icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">User Growth</h3>
          <SimpleChart
            data={data.userGrowth.map(d => ({
              label: formatShortDate(d.date),
              value: d.total,
            }))}
            color="indigo"
          />
        </div>

        {/* Meals Logged Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Daily Meals Logged</h3>
          <SimpleChart
            data={data.mealTrends.map(d => ({
              label: formatShortDate(d.date),
              value: d.count,
            }))}
            color="orange"
          />
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Foods */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Top 20 Foods</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-96 overflow-y-auto">
            {data.topFoods.map((food, index) => (
              <div key={index} className="p-3 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {food.name}
                  </p>
                  <p className="text-xs text-slate-500">{food.category}</p>
                </div>
                <span className="text-sm font-medium text-slate-500">
                  {food.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Food Categories</h3>
          </div>
          <div className="p-4 space-y-3">
            {data.categoryBreakdown.slice(0, 10).map((cat, index) => {
              const total = data.categoryBreakdown.reduce((sum, c) => sum + c.count, 0);
              const percentage = Math.round((cat.count / total) * 100);
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {cat.category}
                    </span>
                    <span className="text-sm text-slate-500">
                      {cat.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

function SimpleChart({
  data,
  color,
}: {
  data: { label: string; value: number }[];
  color: 'indigo' | 'orange' | 'green' | 'purple';
}) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const colors = {
    indigo: 'bg-indigo-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="h-48 flex items-end gap-1">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100;
        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-1"
            title={`${item.label}: ${item.value}`}
          >
            <div
              className={`w-full ${colors[color]} rounded-t opacity-80 hover:opacity-100 transition-opacity`}
              style={{ height: `${Math.max(height, 2)}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

