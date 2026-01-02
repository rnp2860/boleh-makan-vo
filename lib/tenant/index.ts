// lib/tenant/index.ts
// 🏢 Multi-Tenant System - Barrel Export

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
  TenantContext,
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

// Resolver
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

// Context
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

// Hooks
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

// Query Helpers
export {
  getTenantIdFromHeaders,
  getTenantContextFromHeaders,
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


