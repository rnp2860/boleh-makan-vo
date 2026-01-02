'use client';

// hooks/useTenantBranding.ts
// 🏷️ Tenant Branding Hook - Fetch and manage tenant branding

import { useState, useEffect, useCallback } from 'react';
import {
  WhiteLabelConfig,
  TenantTheme,
  TenantBranding,
  TenantContent,
  TenantAISettings,
  TenantAsset,
  TenantCustomDomain,
  TenantInviteCode,
} from '@/lib/white-label/types';
import {
  DEFAULT_THEME,
  DEFAULT_BRANDING,
  DEFAULT_CONTENT,
  DEFAULT_AI_SETTINGS,
} from '@/lib/white-label/constants';

// ============================================
// TENANT CONFIG HOOK
// ============================================

interface UseTenantConfigResult {
  config: WhiteLabelConfig | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateBranding: (branding: Partial<TenantBranding>) => Promise<{ success: boolean; error?: string }>;
  updateTheme: (theme: Partial<TenantTheme>) => Promise<{ success: boolean; error?: string }>;
  updateContent: (content: Partial<TenantContent>) => Promise<{ success: boolean; error?: string }>;
  updateAISettings: (settings: Partial<TenantAISettings>) => Promise<{ success: boolean; error?: string }>;
}

export function useTenantConfig(tenantId: string | null): UseTenantConfigResult {
  const [config, setConfig] = useState<WhiteLabelConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    if (!tenantId) {
      setConfig(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tenants/${tenantId}/config`);
      const data = await response.json();

      if (data.success) {
        setConfig(data.config);
      } else {
        setError(data.error || 'Failed to fetch config');
      }
    } catch (err) {
      setError('Failed to load tenant config');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateBranding = useCallback(async (branding: Partial<TenantBranding>) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/branding`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding),
      });

      const data = await response.json();

      if (data.success) {
        await fetchConfig();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to update branding' };
    }
  }, [tenantId, fetchConfig]);

  const updateTheme = useCallback(async (theme: Partial<TenantTheme>) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/theme`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });

      const data = await response.json();

      if (data.success) {
        await fetchConfig();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to update theme' };
    }
  }, [tenantId, fetchConfig]);

  const updateContent = useCallback(async (content: Partial<TenantContent>) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const data = await response.json();

      if (data.success) {
        await fetchConfig();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to update content' };
    }
  }, [tenantId, fetchConfig]);

  const updateAISettings = useCallback(async (settings: Partial<TenantAISettings>) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/ai-settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        await fetchConfig();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to update AI settings' };
    }
  }, [tenantId, fetchConfig]);

  return {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
    updateBranding,
    updateTheme,
    updateContent,
    updateAISettings,
  };
}

// ============================================
// TENANT ASSETS HOOK
// ============================================

interface UseTenantAssetsResult {
  assets: TenantAsset[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  uploadAsset: (type: TenantAsset['assetType'], file: File) => Promise<{ success: boolean; error?: string }>;
  deleteAsset: (assetId: string) => Promise<{ success: boolean; error?: string }>;
  getAssetUrl: (type: TenantAsset['assetType']) => string | undefined;
}

export function useTenantAssets(tenantId: string | null): UseTenantAssetsResult {
  const [assets, setAssets] = useState<TenantAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    if (!tenantId) {
      setAssets([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tenants/${tenantId}/assets`);
      const data = await response.json();

      if (data.success) {
        setAssets(data.assets);
      } else {
        setError(data.error || 'Failed to fetch assets');
      }
    } catch (err) {
      setError('Failed to load assets');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const uploadAsset = useCallback(async (type: TenantAsset['assetType'], file: File) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assetType', type);

      const response = await fetch(`/api/tenants/${tenantId}/assets`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        await fetchAssets();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to upload asset' };
    }
  }, [tenantId, fetchAssets]);

  const deleteAsset = useCallback(async (assetId: string) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/assets/${assetId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchAssets();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to delete asset' };
    }
  }, [tenantId, fetchAssets]);

  const getAssetUrl = useCallback((type: TenantAsset['assetType']) => {
    return assets.find(a => a.assetType === type)?.fileUrl;
  }, [assets]);

  return {
    assets,
    isLoading,
    error,
    refetch: fetchAssets,
    uploadAsset,
    deleteAsset,
    getAssetUrl,
  };
}

// ============================================
// TENANT DOMAINS HOOK
// ============================================

interface UseTenantDomainsResult {
  domains: TenantCustomDomain[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addDomain: (domain: string) => Promise<{ success: boolean; error?: string }>;
  verifyDomain: (domainId: string) => Promise<{ success: boolean; verified: boolean; error?: string }>;
  deleteDomain: (domainId: string) => Promise<{ success: boolean; error?: string }>;
}

export function useTenantDomains(tenantId: string | null): UseTenantDomainsResult {
  const [domains, setDomains] = useState<TenantCustomDomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = useCallback(async () => {
    if (!tenantId) {
      setDomains([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tenants/${tenantId}/domains`);
      const data = await response.json();

      if (data.success) {
        setDomains(data.domains);
      } else {
        setError(data.error || 'Failed to fetch domains');
      }
    } catch (err) {
      setError('Failed to load domains');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const addDomain = useCallback(async (domain: string) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchDomains();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to add domain' };
    }
  }, [tenantId, fetchDomains]);

  const verifyDomain = useCallback(async (domainId: string) => {
    if (!tenantId) return { success: false, verified: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/domains/${domainId}/verify`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        await fetchDomains();
        return { success: true, verified: data.verified };
      }

      return { success: false, verified: false, error: data.error };
    } catch (err) {
      return { success: false, verified: false, error: 'Failed to verify domain' };
    }
  }, [tenantId, fetchDomains]);

  const deleteDomain = useCallback(async (domainId: string) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/domains/${domainId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchDomains();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to delete domain' };
    }
  }, [tenantId, fetchDomains]);

  return {
    domains,
    isLoading,
    error,
    refetch: fetchDomains,
    addDomain,
    verifyDomain,
    deleteDomain,
  };
}

// ============================================
// INVITE CODES HOOK
// ============================================

interface UseTenantInviteCodesResult {
  codes: TenantInviteCode[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCode: (options?: { maxUses?: number; expiresAt?: string; note?: string }) => Promise<{ success: boolean; code?: string; error?: string }>;
  deleteCode: (codeId: string) => Promise<{ success: boolean; error?: string }>;
}

export function useTenantInviteCodes(tenantId: string | null): UseTenantInviteCodesResult {
  const [codes, setCodes] = useState<TenantInviteCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    if (!tenantId) {
      setCodes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tenants/${tenantId}/invite-codes`);
      const data = await response.json();

      if (data.success) {
        setCodes(data.codes);
      } else {
        setError(data.error || 'Failed to fetch invite codes');
      }
    } catch (err) {
      setError('Failed to load invite codes');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const createCode = useCallback(async (options: { maxUses?: number; expiresAt?: string; note?: string } = {}) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/invite-codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCodes();
        return { success: true, code: data.code.code };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to create invite code' };
    }
  }, [tenantId, fetchCodes]);

  const deleteCode = useCallback(async (codeId: string) => {
    if (!tenantId) return { success: false, error: 'No tenant ID' };

    try {
      const response = await fetch(`/api/tenants/${tenantId}/invite-codes/${codeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchCodes();
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Failed to delete invite code' };
    }
  }, [tenantId, fetchCodes]);

  return {
    codes,
    isLoading,
    error,
    refetch: fetchCodes,
    createCode,
    deleteCode,
  };
}


