// lib/types/admin.ts
// 🔐 Admin Dashboard - TypeScript Types

// ============================================
// ROLES & PERMISSIONS
// ============================================

export type AdminRole = 'super_admin' | 'admin' | 'support' | 'viewer';

export interface AdminPermissions {
  users: {
    read: boolean;
    write: boolean;
    delete: boolean;
    impersonate: boolean;
  };
  analytics: {
    read: boolean;
    export: boolean;
  };
  content: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  system: {
    read: boolean;
    write: boolean;
  };
  audit: {
    read: boolean;
  };
}

export const DEFAULT_PERMISSIONS: Record<AdminRole, AdminPermissions> = {
  super_admin: {
    users: { read: true, write: true, delete: true, impersonate: true },
    analytics: { read: true, export: true },
    content: { read: true, write: true, delete: true },
    system: { read: true, write: true },
    audit: { read: true },
  },
  admin: {
    users: { read: true, write: true, delete: false, impersonate: true },
    analytics: { read: true, export: true },
    content: { read: true, write: true, delete: false },
    system: { read: true, write: false },
    audit: { read: true },
  },
  support: {
    users: { read: true, write: true, delete: false, impersonate: false },
    analytics: { read: true, export: false },
    content: { read: true, write: false, delete: false },
    system: { read: false, write: false },
    audit: { read: false },
  },
  viewer: {
    users: { read: true, write: false, delete: false, impersonate: false },
    analytics: { read: true, export: false },
    content: { read: true, write: false, delete: false },
    system: { read: false, write: false },
    audit: { read: false },
  },
};

// ============================================
// DATABASE TYPES
// ============================================

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: AdminRole;
  permissions: AdminPermissions;
  is_active: boolean;
  last_login_at: string | null;
  last_activity_at: string | null;
  two_factor_enabled: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_user_id: string | null;
  admin_email: string;
  action: string;
  action_category: AuditCategory;
  target_type: string | null;
  target_id: string | null;
  target_name: string | null;
  metadata: Record<string, any>;
  changes: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  request_path: string | null;
  status: 'success' | 'failure' | 'pending';
  error_message: string | null;
  created_at: string;
}

export type AuditCategory = 
  | 'user_management'
  | 'content_management'
  | 'system_config'
  | 'data_export'
  | 'authentication'
  | 'other';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  action_url: string | null;
  action_label: string | null;
  type: 'info' | 'warning' | 'maintenance' | 'feature' | 'promotion';
  priority: number;
  dismissible: boolean;
  target_audience: string;
  target_conditions: Record<string, any>;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
  view_count: number;
  dismiss_count: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeatureFlag {
  id: string;
  flag_key: string;
  display_name: string;
  description: string | null;
  is_enabled: boolean;
  rollout_percentage: number;
  target_users: string[];
  target_conditions: Record<string, any>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  user_email: string | null;
  subject: string;
  description: string;
  category: 'bug' | 'feature_request' | 'account' | 'billing' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  assigned_to: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// DASHBOARD METRICS
// ============================================

export interface DashboardMetrics {
  users: {
    total: number;
    active_today: number;
    active_week: number;
    active_month: number;
    new_today: number;
    new_week: number;
    new_month: number;
    growth_rate: number;
  };
  meals: {
    logged_today: number;
    logged_week: number;
    logged_month: number;
    avg_per_user: number;
  };
  ai: {
    queries_today: number;
    queries_week: number;
    tokens_today: number;
    estimated_cost_today: number;
    estimated_cost_month: number;
  };
  vitals: {
    logged_today: number;
    avg_glucose: number | null;
    alerts_triggered: number;
  };
  engagement: {
    onboarding_completion_rate: number;
    day7_retention_rate: number;
    day30_retention_rate: number;
    avg_session_duration: number;
  };
}

export interface UserGrowthData {
  date: string;
  total_users: number;
  new_users: number;
  active_users: number;
}

export interface FoodLogStats {
  food_name: string;
  count: number;
  category: string;
}

export interface RetentionCohort {
  cohort_date: string;
  users: number;
  retention: Record<string, number>;
}

// ============================================
// USER MANAGEMENT
// ============================================

export interface AdminUserListItem {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_active_at: string | null;
  meals_logged: number;
  health_conditions: string[];
  status: 'active' | 'inactive' | 'suspended';
  onboarding_completed: boolean;
}

export interface AdminUserDetail extends AdminUserListItem {
  profile: {
    age: number | null;
    gender: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    activity_level: string | null;
    health_goals: string[];
    daily_targets: {
      calories: number;
      carbs: number;
      protein: number;
      fat: number;
    };
  };
  stats: {
    total_meals: number;
    total_vitals: number;
    streak: number;
    boleh_score_avg: number | null;
    ai_queries: number;
  };
  recent_activity: {
    type: 'meal' | 'vital' | 'chat' | 'login';
    description: string;
    timestamp: string;
  }[];
  flags: {
    is_premium: boolean;
    ramadan_mode: boolean;
    email_verified: boolean;
  };
}

// ============================================
// API RESPONSES
// ============================================

export interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    has_more?: boolean;
  };
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// ============================================
// SIDEBAR NAVIGATION
// ============================================

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  permission?: keyof AdminPermissions;
  children?: AdminNavItem[];
  badge?: number | string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: 'Overview',
    href: '/admin',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: 'Users',
    permission: 'users',
  },
  {
    label: 'Tenants',
    href: '/admin/tenants',
    icon: 'Building2',
    permission: 'system',
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: 'BarChart3',
    permission: 'analytics',
  },
  {
    label: 'Content',
    href: '/admin/content',
    icon: 'FileText',
    permission: 'content',
    children: [
      { label: 'Foods', href: '/admin/content/foods', icon: 'Apple' },
      { label: 'Announcements', href: '/admin/content/announcements', icon: 'Megaphone' },
    ],
  },
  {
    label: 'Support',
    href: '/admin/support',
    icon: 'HeadphonesIcon',
    permission: 'users',
  },
  {
    label: 'System',
    href: '/admin/system',
    icon: 'Settings',
    permission: 'system',
    children: [
      { label: 'Feature Flags', href: '/admin/system/feature-flags', icon: 'Flag' },
      { label: 'Audit Log', href: '/admin/system/audit', icon: 'ScrollText' },
    ],
  },
];

// ============================================
// AUDIT ACTIONS
// ============================================

export const AUDIT_ACTIONS = {
  // User Management
  USER_VIEWED: 'user_viewed',
  USER_UPDATED: 'user_updated',
  USER_SUSPENDED: 'user_suspended',
  USER_UNSUSPENDED: 'user_unsuspended',
  USER_DELETED: 'user_deleted',
  USER_IMPERSONATED: 'user_impersonated',
  USER_DATA_EXPORTED: 'user_data_exported',
  
  // Content Management
  FOOD_CREATED: 'food_created',
  FOOD_UPDATED: 'food_updated',
  FOOD_DELETED: 'food_deleted',
  ANNOUNCEMENT_CREATED: 'announcement_created',
  ANNOUNCEMENT_UPDATED: 'announcement_updated',
  ANNOUNCEMENT_DELETED: 'announcement_deleted',
  
  // System Config
  FEATURE_FLAG_TOGGLED: 'feature_flag_toggled',
  FEATURE_FLAG_CREATED: 'feature_flag_created',
  FEATURE_FLAG_DELETED: 'feature_flag_deleted',
  SETTINGS_UPDATED: 'settings_updated',
  
  // Authentication
  ADMIN_LOGIN: 'admin_login',
  ADMIN_LOGOUT: 'admin_logout',
  ADMIN_CREATED: 'admin_created',
  ADMIN_UPDATED: 'admin_updated',
  ADMIN_DELETED: 'admin_deleted',
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];

