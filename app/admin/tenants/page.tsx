// app/admin/tenants/page.tsx
// 🏢 Tenant Management - List all tenants

import { Suspense } from 'react';
import Link from 'next/link';
import { Building2, Plus, Users, Calendar, ExternalLink, Search } from 'lucide-react';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { Tenant } from '@/lib/types/tenant';
import { format } from 'date-fns';

// ============================================
// DATA FETCHING
// ============================================

async function getTenants(search?: string, status?: string) {
  const supabase = getSupabaseServiceClient();
  
  let query = supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  }
  
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching tenants:', error);
    return [];
  }
  
  return data as Tenant[];
}

// ============================================
// COMPONENTS
// ============================================

function TenantCard({ tenant }: { tenant: Tenant }) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      trial: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      churned: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };
    return styles[status] || styles.churned;
  };

  const getPlanBadge = (plan: string) => {
    const styles: Record<string, string> = {
      trial: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      professional: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      enterprise: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      custom: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    };
    return styles[plan] || styles.starter;
  };

  return (
    <Link
      href={`/admin/tenants/${tenant.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
    >
      <div className="flex items-start justify-between">
        {/* Logo and Info */}
        <div className="flex items-start space-x-4">
          {tenant.logo_url ? (
            <img
              src={tenant.logo_url}
              alt={tenant.name}
              className="h-12 w-12 rounded-lg object-contain bg-gray-100 dark:bg-gray-700 p-1"
            />
          ) : (
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: tenant.primary_color + '20' }}
            >
              <Building2 
                className="h-6 w-6" 
                style={{ color: tenant.primary_color }}
              />
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {tenant.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {tenant.slug}
            </p>
            
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(tenant.status)}`}>
                {tenant.status}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getPlanBadge(tenant.plan)}`}>
                {tenant.plan}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {tenant.type}
              </span>
            </div>
          </div>
        </div>

        {/* External Link Icon */}
        <ExternalLink className="h-4 w-4 text-gray-400" />
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {tenant.user_count} users
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {format(new Date(tenant.created_at), 'MMM d, yyyy')}
          </span>
        </div>

        {tenant.custom_domain && (
          <div className="text-sm text-blue-600 dark:text-blue-400 truncate">
            {tenant.custom_domain}
          </div>
        )}
      </div>
    </Link>
  );
}

function TenantListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 animate-pulse"
        >
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// PAGE COMPONENT
// ============================================

interface TenantsPageProps {
  searchParams: {
    search?: string;
    status?: string;
  };
}

export default async function TenantsPage({ searchParams }: TenantsPageProps) {
  const tenants = await getTenants(searchParams.search, searchParams.status);
  
  // Stats
  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'active').length,
    trial: tenants.filter(t => t.status === 'trial').length,
    totalUsers: tenants.reduce((sum, t) => sum + t.user_count, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tenants
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage white-label deployments and corporate clients
          </p>
        </div>
        
        <Link
          href="/admin/tenants/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Tenant
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Tenants</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">On Trial</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.trial}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalUsers.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <form className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="search"
            placeholder="Search tenants..."
            defaultValue={searchParams.search}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          name="status"
          defaultValue={searchParams.status || 'all'}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="suspended">Suspended</option>
          <option value="churned">Churned</option>
        </select>
        
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Tenant List */}
      <Suspense fallback={<TenantListSkeleton />}>
        {tenants.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tenants found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchParams.search 
                ? `No tenants match "${searchParams.search}"`
                : 'Get started by creating your first tenant'}
            </p>
            <Link
              href="/admin/tenants/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Tenant
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => (
              <TenantCard key={tenant.id} tenant={tenant} />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}


