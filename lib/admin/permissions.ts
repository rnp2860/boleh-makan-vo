// lib/admin/permissions.ts
// 🔐 Admin Permission Utilities

import { 
  AdminRole, 
  AdminPermissions, 
  DEFAULT_PERMISSIONS,
  AdminUser,
  AdminNavItem 
} from '@/lib/types/admin';

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  admin: AdminUser | null,
  resource: keyof AdminPermissions,
  action: string
): boolean {
  if (!admin) return false;
  if (!admin.is_active) return false;

  const permissions = admin.permissions || DEFAULT_PERMISSIONS[admin.role];
  const resourcePerms = permissions[resource] as Record<string, boolean>;
  
  return resourcePerms?.[action] === true;
}

/**
 * Check if admin can access a resource (read permission)
 */
export function canAccess(
  admin: AdminUser | null,
  resource: keyof AdminPermissions
): boolean {
  return hasPermission(admin, resource, 'read');
}

/**
 * Check if admin can write to a resource
 */
export function canWrite(
  admin: AdminUser | null,
  resource: keyof AdminPermissions
): boolean {
  return hasPermission(admin, resource, 'write');
}

/**
 * Check if admin can delete from a resource
 */
export function canDelete(
  admin: AdminUser | null,
  resource: keyof AdminPermissions
): boolean {
  return hasPermission(admin, resource, 'delete');
}

/**
 * Check if admin is super_admin
 */
export function isSuperAdmin(admin: AdminUser | null): boolean {
  return admin?.role === 'super_admin';
}

/**
 * Check if admin can impersonate users
 */
export function canImpersonate(admin: AdminUser | null): boolean {
  return hasPermission(admin, 'users', 'impersonate');
}

/**
 * Check if admin can export data
 */
export function canExport(admin: AdminUser | null): boolean {
  return hasPermission(admin, 'analytics', 'export');
}

/**
 * Get permissions for a role
 */
export function getDefaultPermissions(role: AdminRole): AdminPermissions {
  return DEFAULT_PERMISSIONS[role];
}

/**
 * Merge custom permissions with defaults
 */
export function mergePermissions(
  role: AdminRole,
  customPermissions?: Partial<AdminPermissions>
): AdminPermissions {
  const defaults = DEFAULT_PERMISSIONS[role];
  
  if (!customPermissions) return defaults;

  return {
    users: { ...defaults.users, ...customPermissions.users },
    analytics: { ...defaults.analytics, ...customPermissions.analytics },
    content: { ...defaults.content, ...customPermissions.content },
    system: { ...defaults.system, ...customPermissions.system },
    audit: { ...defaults.audit, ...customPermissions.audit },
  };
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: AdminRole): string {
  const names: Record<AdminRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrator',
    support: 'Support Staff',
    viewer: 'Viewer',
  };
  return names[role];
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: AdminRole): string {
  const colors: Record<AdminRole, string> = {
    super_admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    support: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  };
  return colors[role];
}

/**
 * Validate admin access to route
 */
export function validateRouteAccess(
  admin: AdminUser | null,
  pathname: string
): { allowed: boolean; reason?: string } {
  if (!admin) {
    return { allowed: false, reason: 'Not authenticated as admin' };
  }

  if (!admin.is_active) {
    return { allowed: false, reason: 'Admin account is disabled' };
  }

  // Route-specific checks
  if (pathname.startsWith('/admin/users') && !canAccess(admin, 'users')) {
    return { allowed: false, reason: 'No permission to access user management' };
  }

  if (pathname.startsWith('/admin/analytics') && !canAccess(admin, 'analytics')) {
    return { allowed: false, reason: 'No permission to access analytics' };
  }

  if (pathname.startsWith('/admin/content') && !canAccess(admin, 'content')) {
    return { allowed: false, reason: 'No permission to access content management' };
  }

  if (pathname.startsWith('/admin/system') && !canAccess(admin, 'system')) {
    return { allowed: false, reason: 'No permission to access system settings' };
  }

  return { allowed: true };
}

/**
 * Filter navigation items based on permissions
 */
export function filterNavByPermissions(
  items: AdminNavItem[],
  admin: AdminUser | null
): AdminNavItem[] {
  return items.filter(item => {
    if (!item.permission) return true;
    return canAccess(admin, item.permission);
  });
}

