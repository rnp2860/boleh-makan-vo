// app/admin/users/page.tsx
// 👥 Admin User Management Page

import { Suspense } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { getSupabaseServiceClient } from '@/lib/supabase';

interface SearchParams {
  page?: string;
  search?: string;
  status?: string;
  sort?: string;
}

async function getUsers(params: SearchParams) {
  const supabase = getSupabaseServiceClient();
  const page = parseInt(params.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;
  const search = params.search || '';

  let query = supabase
    .from('user_profiles')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0 };
  }

  // Enrich with activity data
  const enrichedUsers = await Promise.all((data || []).map(async (user) => {
    // Get meal count
    const { count: mealCount } = await supabase
      .from('food_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.user_id);

    // Get last activity
    const { data: lastMeal } = await supabase
      .from('food_logs')
      .select('created_at')
      .eq('user_id', user.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return {
      ...user,
      meals_logged: mealCount || 0,
      last_active_at: lastMeal?.created_at || user.created_at,
      status: 'active', // TODO: Implement actual status tracking
    };
  }));

  return { users: enrichedUsers, total: count || 0 };
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { users, total } = await getUsers(params);
  const page = parseInt(params.page || '1');
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {total.toLocaleString()} total users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <form>
              <input
                type="text"
                name="search"
                placeholder="Search by email or name..."
                defaultValue={params.search}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Status Filter */}
          <select
            name="status"
            defaultValue={params.status}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Sort */}
          <select
            name="sort"
            defaultValue={params.sort}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="meals_desc">Most Active</option>
            <option value="name_asc">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Meals Logged
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Health Conditions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <Suspense fallback={<UserTableSkeleton />}>
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                            {(user.display_name || user.email || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {user.display_name || 'No name'}
                            </p>
                            <p className="text-sm text-slate-500">{user.email || user.user_id.substring(0, 20)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : user.status === 'suspended'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {user.meals_logged}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.health_conditions?.slice(0, 2).map((condition: string, i: number) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            >
                              {condition}
                            </span>
                          )) || <span className="text-slate-400 text-sm">None</span>}
                          {user.health_conditions?.length > 2 && (
                            <span className="text-xs text-slate-400">
                              +{user.health_conditions.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-slate-500">
                          {formatDate(user.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-slate-500">
                          {formatTimeAgo(user.last_active_at)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/admin/users/${user.user_id}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                )}
              </Suspense>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, total)} of {total} users
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/users?page=${page - 1}&search=${params.search || ''}`}
                className={`p-2 rounded-lg border ${
                  page <= 1
                    ? 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 pointer-events-none'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Page {page} of {totalPages}
              </span>
              <Link
                href={`/admin/users?page=${page + 1}&search=${params.search || ''}`}
                className={`p-2 rounded-lg border ${
                  page >= totalPages
                    ? 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 pointer-events-none'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
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

function UserTableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <tr key={i} className="animate-pulse">
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-8 w-12 bg-slate-200 dark:bg-slate-700 rounded ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

