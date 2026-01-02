'use client';

// components/tenant/TenantSwitcher.tsx
// 🔄 Tenant Switcher - For super admins to switch between tenants

import React, { useState, useCallback, useEffect } from 'react';
import { Building2, ChevronDown, Check, Search, Plus, Loader2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface TenantListItem {
  id: string;
  slug: string;
  name: string;
  type: string;
  logo_url: string | null;
  user_count: number;
  status: string;
}

interface TenantSwitcherProps {
  /** Currently selected tenant */
  currentTenantId: string;
  /** Called when tenant is switched */
  onSwitch: (tenantId: string, tenantSlug: string) => void;
  /** Whether to show the "Create Tenant" button */
  showCreate?: boolean;
  /** Called when create button is clicked */
  onCreate?: () => void;
  /** Custom className */
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function TenantSwitcher({
  currentTenantId,
  onSwitch,
  showCreate = true,
  onCreate,
  className = '',
}: TenantSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<TenantListItem | null>(null);

  // Fetch tenants list
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/admin/tenants');
        const data = await response.json();
        
        if (data.success) {
          setTenants(data.data);
          const current = data.data.find((t: TenantListItem) => t.id === currentTenantId);
          setCurrentTenant(current || null);
        }
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, [currentTenantId]);

  // Filter tenants by search term
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle tenant selection
  const handleSelect = useCallback((tenant: TenantListItem) => {
    onSwitch(tenant.id, tenant.slug);
    setCurrentTenant(tenant);
    setIsOpen(false);
    setSearchTerm('');
  }, [onSwitch]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-tenant-switcher]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'trial': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className={`relative ${className}`} data-tenant-switcher>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 
          rounded-lg shadow-sm
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-150
          min-w-[200px]
        `}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
        ) : currentTenant?.logo_url ? (
          <img 
            src={currentTenant.logo_url} 
            alt="" 
            className="h-5 w-5 rounded object-contain"
          />
        ) : (
          <Building2 className="h-5 w-5 text-gray-400" />
        )}
        
        <span className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white truncate">
          {currentTenant?.name || 'Select Tenant'}
        </span>
        
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {/* Search */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tenants..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tenant List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredTenants.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No tenants found
              </div>
            ) : (
              filteredTenants.map((tenant) => (
                <button
                  key={tenant.id}
                  type="button"
                  onClick={() => handleSelect(tenant)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors duration-150
                    ${tenant.id === currentTenantId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  `}
                >
                  {/* Logo */}
                  {tenant.logo_url ? (
                    <img 
                      src={tenant.logo_url} 
                      alt="" 
                      className="h-8 w-8 rounded object-contain bg-white dark:bg-gray-900 p-0.5"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-gray-500" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {tenant.name}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(tenant.status)}`}>
                        {tenant.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{tenant.type}</span>
                      <span>•</span>
                      <span>{tenant.user_count} users</span>
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {tenant.id === currentTenantId && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Create button */}
          {showCreate && onCreate && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onCreate();
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Tenant</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// MINIMAL VERSION
// ============================================

interface MinimalTenantIndicatorProps {
  tenantName: string;
  tenantLogo?: string | null;
  className?: string;
}

export function MinimalTenantIndicator({
  tenantName,
  tenantLogo,
  className = '',
}: MinimalTenantIndicatorProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {tenantLogo ? (
        <img 
          src={tenantLogo} 
          alt="" 
          className="h-6 w-6 rounded object-contain"
        />
      ) : (
        <Building2 className="h-5 w-5 text-gray-400" />
      )}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {tenantName}
      </span>
    </div>
  );
}


