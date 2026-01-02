// lib/tenant/index.ts
// 🏢 Multi-Tenant System - Barrel Export
//
// ⚠️ This file exports CLIENT-SAFE code only.
// For server-only functions (using next/headers), import from:
//   import { getTenantIdFromHeaders } from '@/lib/tenant/server'

// Types
export type {
  Tenant,
  TenantType,
  TenantStatus,
  TenantPlan,
  TenantAdmin,
  TenantAdminRole,
  TenantAdminPermissions,
  TenantFood,
  TenantInviteCode,
  TenantUsageLog,
  TenantContextData,
  TenantFeatures,
  TenantBranding,
  TenantLimits,
  TenantSettings,
  TenantResolutionMethod,
  TenantResolutionResult,
  TenantCreateRequest,
  TenantUpdateRequest,
  InviteCodeCreateRequest,
  TenantFoodCreateRequest,
  TenantApiResponse,
} from '@/lib/types/tenant';

// Constants
export {
  DEFAULT_TENANT_ID,
  DEFAULT_TENANT_SLUG,
  DEFAULT_FEATURES,
  DEFAULT_LIMITS,
  DEFAULT_BRANDING,
  TENANT_ADMIN_PERMISSIONS,
} from '@/lib/types/tenant';

// Resolver (client-safe parts)
export {
  resolveTenant,
  resolveTenantByCustomDomain,
  resolveTenantBySubdomain,
  resolveTenantByPath,
  resolveTenantByInviteCode,
  resolveTenantByUser,
  getDefaultTenant,
  getTenantById,
  getTenantBySlug,
  stripTenantFromPath,
  addTenantToPath,
  pathNeedsTenantPrefix,
} from './resolver';

// Context (React Context - client components)
export {
  TenantProvider,
  TenantContext,
  useTenant,
  useTenantOptional,
  useTenantFeatures,
  useTenantBranding,
  useTenantLimits,
  useFeatureEnabled,
  useWithinLimit,
} from './context';
export type { TenantContextValue, TenantProviderProps } from './context';

// Hooks (client-side hooks)
export {
  useAIEnabled,
  useRamadanModeEnabled,
  useCGMEnabled,
  useExportEnabled,
  useVoiceLoggingEnabled,
  useCustomFoodsEnabled,
  useTenantCSSVariables,
  useTenantLogo,
  useTenantFavicon,
  useRemainingAIQueries,
  useUserLimitReached,
  useTenantUrl,
  useTenantApiUrl,
  useTenantAdminPermissions,
  useTenantAdminPermission,
  useTenantLanguages,
  useTenantDefaultLanguage,
  useTenantTimezone,
  useIsDefaultTenant,
  useTenantType,
  useTenantPlan,
  useIsTenantTrial,
  useTenantTrialEndingSoon,
  useTenantTrialDaysRemaining,
} from './hooks';

// Query Helpers (client-safe - NO next/headers usage)
// ⚠️ For getTenantIdFromHeaders/getTenantContextFromHeaders, use:
//    import { getTenantIdFromHeaders } from '@/lib/tenant/server'
export {
  createTenantQuery,
  getUserGoals,
  getRamadanSettings,
  getTenantFoods,
  logTenantAction,
  validateUserTenant,
  isTenantAdmin,
  getTenantAdminRole,
  checkTenantUserLimit,
  incrementTenantUserCount,
  decrementTenantUserCount,
} from './query';


