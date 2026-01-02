// lib/admin/audit.ts
// 📋 Admin Audit Logging Utility

import { getSupabaseServiceClient } from '@/lib/supabase';
import { 
  AuditAction, 
  AuditCategory,
  AdminUser 
} from '@/lib/types/admin';

interface AuditLogEntry {
  admin: AdminUser;
  action: AuditAction;
  category: AuditCategory;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, any>;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  requestPath?: string;
  status?: 'success' | 'failure' | 'pending';
  errorMessage?: string;
}

/**
 * Log an admin action to the audit log
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = getSupabaseServiceClient();

    const { error } = await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: entry.admin.id,
        admin_email: entry.admin.email,
        action: entry.action,
        action_category: entry.category,
        target_type: entry.targetType || null,
        target_id: entry.targetId || null,
        target_name: entry.targetName || null,
        metadata: entry.metadata || {},
        changes: entry.changes || {},
        ip_address: entry.ipAddress || null,
        user_agent: entry.userAgent || null,
        request_path: entry.requestPath || null,
        status: entry.status || 'success',
        error_message: entry.errorMessage || null,
      });

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (err) {
    // Don't throw - audit logging should never break the main flow
    console.error('Audit logging error:', err);
  }
}

/**
 * Helper to log user management actions
 */
export async function logUserAction(
  admin: AdminUser,
  action: AuditAction,
  userId: string,
  userEmail: string,
  details?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    admin,
    action,
    category: 'user_management',
    targetType: 'user',
    targetId: userId,
    targetName: userEmail,
    metadata: details,
  });
}

/**
 * Helper to log content management actions
 */
export async function logContentAction(
  admin: AdminUser,
  action: AuditAction,
  contentType: string,
  contentId: string,
  contentName: string,
  changes?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    admin,
    action,
    category: 'content_management',
    targetType: contentType,
    targetId: contentId,
    targetName: contentName,
    changes,
  });
}

/**
 * Helper to log system config changes
 */
export async function logSystemAction(
  admin: AdminUser,
  action: AuditAction,
  settingName: string,
  changes?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    admin,
    action,
    category: 'system_config',
    targetType: 'setting',
    targetName: settingName,
    changes,
  });
}

/**
 * Helper to log authentication events
 */
export async function logAuthEvent(
  admin: AdminUser,
  action: AuditAction,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    admin,
    action,
    category: 'authentication',
    ipAddress,
    userAgent,
  });
}

/**
 * Get recent audit logs
 */
export async function getAuditLogs(options: {
  limit?: number;
  offset?: number;
  adminId?: string;
  action?: string;
  category?: AuditCategory;
  targetType?: string;
  targetId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ logs: any[]; total: number }> {
  const supabase = getSupabaseServiceClient();
  const { limit = 50, offset = 0 } = options;

  let query = supabase
    .from('admin_audit_log')
    .select('*, admin_users(email, display_name, role)', { count: 'exact' });

  if (options.adminId) {
    query = query.eq('admin_user_id', options.adminId);
  }

  if (options.action) {
    query = query.eq('action', options.action);
  }

  if (options.category) {
    query = query.eq('action_category', options.category);
  }

  if (options.targetType) {
    query = query.eq('target_type', options.targetType);
  }

  if (options.targetId) {
    query = query.eq('target_id', options.targetId);
  }

  if (options.startDate) {
    query = query.gte('created_at', options.startDate);
  }

  if (options.endDate) {
    query = query.lte('created_at', options.endDate);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching audit logs:', error);
    return { logs: [], total: 0 };
  }

  return { logs: data || [], total: count || 0 };
}

/**
 * Get audit log summary for dashboard
 */
export async function getAuditSummary(days: number = 7): Promise<{
  totalActions: number;
  byCategory: Record<string, number>;
  byAdmin: { email: string; count: number }[];
  recentCritical: any[];
}> {
  const supabase = getSupabaseServiceClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get total count
  const { count: totalActions } = await supabase
    .from('admin_audit_log')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString());

  // Get by category
  const { data: categoryData } = await supabase
    .from('admin_audit_log')
    .select('action_category')
    .gte('created_at', startDate.toISOString());

  const byCategory: Record<string, number> = {};
  categoryData?.forEach(row => {
    const cat = row.action_category || 'other';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });

  // Get by admin
  const { data: adminData } = await supabase
    .from('admin_audit_log')
    .select('admin_email')
    .gte('created_at', startDate.toISOString());

  const adminCounts: Record<string, number> = {};
  adminData?.forEach(row => {
    const email = row.admin_email || 'unknown';
    adminCounts[email] = (adminCounts[email] || 0) + 1;
  });

  const byAdmin = Object.entries(adminCounts)
    .map(([email, count]) => ({ email, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Get recent critical actions
  const criticalActions = ['user_deleted', 'user_suspended', 'admin_created', 'admin_deleted'];
  const { data: recentCritical } = await supabase
    .from('admin_audit_log')
    .select('*')
    .in('action', criticalActions)
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    totalActions: totalActions || 0,
    byCategory,
    byAdmin,
    recentCritical: recentCritical || [],
  };
}

