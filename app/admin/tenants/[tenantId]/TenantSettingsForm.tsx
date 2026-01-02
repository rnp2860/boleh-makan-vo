'use client';

// app/admin/tenants/[tenantId]/TenantSettingsForm.tsx
// 🏢 Tenant Settings Form - Edit tenant configuration

import React, { useState, useTransition } from 'react';
import { Tenant, TenantStatus, TenantPlan, TenantType } from '@/lib/types/tenant';
import { Loader2, Save, Check } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface TenantSettingsFormProps {
  tenant: Tenant;
}

// ============================================
// SERVER ACTION
// ============================================

async function updateTenant(tenantId: string, data: Partial<Tenant>) {
  const response = await fetch(`/api/admin/tenants/${tenantId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  return response.json();
}

// ============================================
// COMPONENT
// ============================================

export function TenantSettingsForm({ tenant }: TenantSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: tenant.name,
    type: tenant.type,
    status: tenant.status,
    plan: tenant.plan,
    custom_domain: tenant.custom_domain || '',
    subdomain: tenant.subdomain || '',
    contact_email: tenant.contact_email || '',
    support_email: tenant.support_email || '',
    billing_email: tenant.billing_email || '',
    primary_color: tenant.primary_color,
    secondary_color: tenant.secondary_color,
    accent_color: tenant.accent_color,
    logo_url: tenant.logo_url || '',
    // Features
    ai_enabled: tenant.settings?.features?.ai_enabled ?? true,
    ramadan_mode: tenant.settings?.features?.ramadan_mode ?? true,
    cgm_integration: tenant.settings?.features?.cgm_integration ?? false,
    export_enabled: tenant.settings?.features?.export_enabled ?? true,
    voice_logging: tenant.settings?.features?.voice_logging ?? true,
    custom_foods: tenant.settings?.features?.custom_foods ?? true,
    // Limits
    max_users: tenant.settings?.limits?.max_users || '',
    ai_queries_per_day: tenant.settings?.limits?.ai_queries_per_day ?? 50,
    storage_gb: tenant.settings?.limits?.storage_gb ?? 10,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      try {
        const updateData: Partial<Tenant> = {
          name: formData.name,
          type: formData.type as TenantType,
          status: formData.status as TenantStatus,
          plan: formData.plan as TenantPlan,
          custom_domain: formData.custom_domain || null,
          subdomain: formData.subdomain || null,
          contact_email: formData.contact_email || null,
          support_email: formData.support_email || null,
          billing_email: formData.billing_email || null,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          accent_color: formData.accent_color,
          logo_url: formData.logo_url || null,
          settings: {
            ...tenant.settings,
            features: {
              ai_enabled: formData.ai_enabled,
              ramadan_mode: formData.ramadan_mode,
              cgm_integration: formData.cgm_integration,
              export_enabled: formData.export_enabled,
              voice_logging: formData.voice_logging,
              custom_foods: formData.custom_foods,
              reports: tenant.settings?.features?.reports ?? true,
              vitals_tracking: tenant.settings?.features?.vitals_tracking ?? true,
            },
            limits: {
              max_users: formData.max_users ? Number(formData.max_users) : null,
              ai_queries_per_day: Number(formData.ai_queries_per_day),
              storage_gb: Number(formData.storage_gb),
              data_retention_days: tenant.settings?.limits?.data_retention_days ?? 365,
            },
            onboarding: tenant.settings?.onboarding,
            notifications: tenant.settings?.notifications,
            privacy: tenant.settings?.privacy,
          },
        };
        
        const result = await updateTenant(tenant.id, updateData);
        
        if (result.success) {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        } else {
          setError(result.error || 'Failed to update tenant');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tenant Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="public">Public</option>
            <option value="corporate">Corporate</option>
            <option value="healthcare">Healthcare</option>
            <option value="insurance">Insurance</option>
            <option value="government">Government</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
            <option value="churned">Churned</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Plan
          </label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="trial">Trial</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Domain Settings */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Domain Configuration</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Custom Domain
            </label>
            <input
              type="text"
              name="custom_domain"
              value={formData.custom_domain}
              onChange={handleInputChange}
              placeholder="wellness.ijm.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subdomain
            </label>
            <div className="flex">
              <input
                type="text"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleInputChange}
                placeholder="ijm"
                className="flex-1 px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-500 dark:text-gray-400 text-sm">
                .bolehmakan.my
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Branding</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Primary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                name="primary_color"
                value={formData.primary_color}
                onChange={handleInputChange}
                className="h-10 w-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.primary_color}
                onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Secondary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                name="secondary_color"
                value={formData.secondary_color}
                onChange={handleInputChange}
                className="h-10 w-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.secondary_color}
                onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: 'ai_enabled', label: 'AI Features' },
            { name: 'ramadan_mode', label: 'Ramadan Mode' },
            { name: 'cgm_integration', label: 'CGM Integration' },
            { name: 'export_enabled', label: 'Data Export' },
            { name: 'voice_logging', label: 'Voice Logging' },
            { name: 'custom_foods', label: 'Custom Foods' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name={name}
                checked={(formData as any)[name]}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Limits */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Limits</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Users (empty = unlimited)
            </label>
            <input
              type="number"
              name="max_users"
              value={formData.max_users}
              onChange={handleInputChange}
              placeholder="Unlimited"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              AI Queries/Day
            </label>
            <input
              type="number"
              name="ai_queries_per_day"
              value={formData.ai_queries_per_day}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Storage (GB)
            </label>
            <input
              type="number"
              name="storage_gb"
              value={formData.storage_gb}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Support Email
            </label>
            <input
              type="email"
              name="support_email"
              value={formData.support_email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Billing Email
            </label>
            <input
              type="email"
              name="billing_email"
              value={formData.billing_email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isPending}
          className={`
            inline-flex items-center px-4 py-2 rounded-lg font-medium text-white
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${saved 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}


