// app/admin/tenants/[tenantId]/page.tsx
// 🏢 Tenant Detail - View and manage individual tenant

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Building2, Users, Calendar, Globe, 
  Settings, Mail, Palette, Key, BarChart, 
  Shield, CreditCard, AlertTriangle
} from 'lucide-react';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { Tenant, TenantAdmin, TenantInviteCode } from '@/lib/types/tenant';
import { format } from 'date-fns';
import { TenantSettingsForm } from './TenantSettingsForm';
import { InviteCodesManager } from './InviteCodesManager';
import { TenantAdminsManager } from './TenantAdminsManager';

// ============================================
// DATA FETCHING
// ============================================

async function getTenantDetails(tenantId: string) {
  const supabase = getSupabaseServiceClient();
  
  // Fetch tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single();
  
  if (tenantError || !tenant) {
    return null;
  }
  
  // Fetch tenant admins
  const { data: admins } = await supabase
    .from('tenant_admins')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });
  
  // Fetch invite codes
  const { data: inviteCodes } = await supabase
    .from('tenant_invite_codes')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });
  
  // Fetch usage stats
  const { data: usageStats } = await supabase
    .from('tenant_usage_logs')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('period_start', { ascending: false })
    .limit(3);
  
  return {
    tenant: tenant as Tenant,
    admins: (admins || []) as TenantAdmin[],
    inviteCodes: (inviteCodes || []) as TenantInviteCode[],
    usageStats: usageStats || [],
  };
}

// ============================================
// COMPONENTS
// ============================================

function StatCard({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function BrandingPreview({ tenant }: { tenant: Tenant }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Palette className="h-5 w-5 mr-2" />
        Branding Preview
      </h3>
      
      <div className="space-y-4">
        {/* Logo */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Logo</p>
          {tenant.logo_url ? (
            <img 
              src={tenant.logo_url} 
              alt={tenant.name} 
              className="h-12 object-contain"
            />
          ) : (
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: tenant.primary_color + '20' }}
            >
              <Building2 className="h-6 w-6" style={{ color: tenant.primary_color }} />
            </div>
          )}
        </div>
        
        {/* Colors */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Colors</p>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: tenant.primary_color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Primary</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: tenant.secondary_color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Secondary</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: tenant.accent_color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Accent</span>
            </div>
          </div>
        </div>
        
        {/* Button Preview */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Button Preview</p>
          <button
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: tenant.primary_color }}
          >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturesOverview({ tenant }: { tenant: Tenant }) {
  const features = tenant.settings?.features || {};
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Settings className="h-5 w-5 mr-2" />
        Features
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(features).map(([key, enabled]) => (
          <div 
            key={key}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium
              ${enabled 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}
            `}
          >
            {key.replace(/_/g, ' ')}
          </div>
        ))}
      </div>
    </div>
  );
}

function DomainInfo({ tenant }: { tenant: Tenant }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Globe className="h-5 w-5 mr-2" />
        Domain Configuration
      </h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
          <p className="font-mono text-gray-900 dark:text-white">{tenant.slug}</p>
        </div>
        
        {tenant.custom_domain && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Custom Domain</p>
            <a 
              href={`https://${tenant.custom_domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {tenant.custom_domain}
            </a>
          </div>
        )}
        
        {tenant.subdomain && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Subdomain</p>
            <a 
              href={`https://${tenant.subdomain}.bolehmakan.my`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {tenant.subdomain}.bolehmakan.my
            </a>
          </div>
        )}
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Path-based URL</p>
          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            /t/{tenant.slug}
          </code>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE COMPONENT
// ============================================

interface TenantDetailPageProps {
  params: {
    tenantId: string;
  };
}

export default async function TenantDetailPage({ params }: TenantDetailPageProps) {
  const data = await getTenantDetails(params.tenantId);
  
  if (!data) {
    notFound();
  }
  
  const { tenant, admins, inviteCodes, usageStats } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/tenants"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          
          {tenant.logo_url ? (
            <img 
              src={tenant.logo_url} 
              alt={tenant.name}
              className="h-12 w-12 rounded-lg object-contain bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: tenant.primary_color + '20' }}
            >
              <Building2 className="h-6 w-6" style={{ color: tenant.primary_color }} />
            </div>
          )}
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tenant.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                tenant.status === 'active' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {tenant.status}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {tenant.type}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {tenant.plan} plan
              </span>
            </div>
          </div>
        </div>
        
        {tenant.status === 'trial' && tenant.trial_ends_at && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-700 dark:text-yellow-300">
              Trial ends {format(new Date(tenant.trial_ends_at), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Users" 
          value={tenant.user_count.toLocaleString()} 
          icon={Users}
        />
        <StatCard 
          label="Monthly AI Queries" 
          value={tenant.monthly_ai_queries.toLocaleString()} 
          icon={BarChart}
        />
        <StatCard 
          label="Storage Used" 
          value={`${(tenant.storage_used_mb / 1024).toFixed(2)} GB`} 
          icon={Shield}
        />
        <StatCard 
          label="Created" 
          value={format(new Date(tenant.created_at), 'MMM d, yyyy')} 
          icon={Calendar}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <BrandingPreview tenant={tenant} />
          <DomainInfo tenant={tenant} />
          <FeaturesOverview tenant={tenant} />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Contact Information
            </h3>
            <div className="space-y-3">
              {tenant.contact_email && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contact Email</p>
                  <a 
                    href={`mailto:${tenant.contact_email}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {tenant.contact_email}
                  </a>
                </div>
              )}
              {tenant.support_email && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Support Email</p>
                  <a 
                    href={`mailto:${tenant.support_email}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {tenant.support_email}
                  </a>
                </div>
              )}
              {tenant.billing_email && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Billing Email</p>
                  <a 
                    href={`mailto:${tenant.billing_email}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {tenant.billing_email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Invite Codes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Invite Codes ({inviteCodes.length})
            </h3>
            <InviteCodesManager 
              tenantId={tenant.id} 
              initialCodes={inviteCodes}
            />
          </div>

          {/* Tenant Admins */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Tenant Admins ({admins.length})
            </h3>
            <TenantAdminsManager 
              tenantId={tenant.id} 
              initialAdmins={admins}
            />
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Tenant Settings
        </h3>
        <TenantSettingsForm tenant={tenant} />
      </div>
    </div>
  );
}


