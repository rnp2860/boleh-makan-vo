'use client';

// app/admin/tenants/new/page.tsx
// 🏢 Create New Tenant - Wizard for creating a new tenant

export const dynamic = 'force-dynamic';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Building2, Palette, Settings, Loader2, Check } from 'lucide-react';
import { TenantType, TenantPlan } from '@/lib/types/tenant';

// ============================================
// TYPES
// ============================================

interface FormData {
  // Step 1: Basic Info
  name: string;
  slug: string;
  type: TenantType;
  plan: TenantPlan;
  contact_email: string;
  
  // Step 2: Branding
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  
  // Step 3: Configuration
  custom_domain: string;
  subdomain: string;
  ai_enabled: boolean;
  ramadan_mode: boolean;
  max_users: string;
  ai_queries_per_day: number;
}

// ============================================
// COMPONENT
// ============================================

export default function CreateTenantPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    type: 'corporate',
    plan: 'trial',
    contact_email: '',
    logo_url: '',
    primary_color: '#10B981',
    secondary_color: '#059669',
    custom_domain: '',
    subdomain: '',
    ai_enabled: true,
    ramadan_mode: true,
    max_users: '',
    ai_queries_per_day: 50,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    
    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/tenants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug,
            type: formData.type,
            plan: formData.plan,
            contact_email: formData.contact_email,
            logo_url: formData.logo_url || null,
            primary_color: formData.primary_color,
            secondary_color: formData.secondary_color,
            custom_domain: formData.custom_domain || null,
            subdomain: formData.subdomain || null,
            settings: {
              features: {
                ai_enabled: formData.ai_enabled,
                ramadan_mode: formData.ramadan_mode,
                cgm_integration: false,
                export_enabled: true,
                voice_logging: true,
                custom_foods: true,
                reports: true,
                vitals_tracking: true,
              },
              limits: {
                max_users: formData.max_users ? parseInt(formData.max_users) : null,
                ai_queries_per_day: formData.ai_queries_per_day,
                storage_gb: 10,
                data_retention_days: 365,
              },
              onboarding: {
                required_fields: ['age', 'diabetes_type'],
                skip_allowed: false,
                custom_welcome_message: null,
              },
              notifications: {
                email_enabled: true,
                push_enabled: true,
                sms_enabled: false,
              },
              privacy: {
                anonymized_analytics: false,
                data_sharing_allowed: true,
              },
            },
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          router.push(`/admin/tenants/${data.data.id}`);
        } else {
          setError(data.error || 'Failed to create tenant');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      }
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.slug && formData.contact_email;
      case 2:
        return true; // Branding is optional
      case 3:
        return true; // Config has defaults
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link
          href="/admin/tenants"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Tenant
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Set up a new white-label deployment
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[
          { num: 1, label: 'Basic Info', icon: Building2 },
          { num: 2, label: 'Branding', icon: Palette },
          { num: 3, label: 'Configuration', icon: Settings },
        ].map(({ num, label, icon: Icon }, idx) => (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-colors
                  ${step >= num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {step > num ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{label}</span>
            </div>
            {idx < 2 && (
              <div
                className={`
                  w-20 h-0.5 mx-2
                  ${step > num ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="IJM Corporation Wellness"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="ijm-wellness"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                URL-safe identifier: /t/{formData.slug || 'your-slug'}
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
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
                  <option value="corporate">Corporate</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="insurance">Insurance</option>
                  <option value="government">Government</option>
                  <option value="public">Public</option>
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
                  <option value="trial">Trial (14 days)</option>
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="wellness@ijm.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Branding */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
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
            
            <div className="grid gap-4 md:grid-cols-2">
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
                    className="h-10 w-12 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="h-10 w-12 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</p>
              <div className="flex items-center space-x-4">
                {formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo" className="h-10 object-contain" />
                ) : (
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: formData.primary_color + '20' }}
                  >
                    <Building2 className="h-5 w-5" style={{ color: formData.primary_color }} />
                  </div>
                )}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formData.name || 'Organization Name'}
                </span>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: formData.secondary_color }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Configuration */}
        {step === 3 && (
          <div className="space-y-4">
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
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Features</p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="ai_enabled"
                    checked={formData.ai_enabled}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">AI Features (Dr. Reza)</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="ramadan_mode"
                    checked={formData.ramadan_mode}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Ramadan Mode</span>
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Limits</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Max Users (empty = unlimited)
                  </label>
                  <input
                    type="number"
                    name="max_users"
                    value={formData.max_users}
                    onChange={handleInputChange}
                    placeholder="Unlimited"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    AI Queries per Day
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
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create Tenant
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


