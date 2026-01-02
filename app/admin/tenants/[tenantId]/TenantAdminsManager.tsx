'use client';

// app/admin/tenants/[tenantId]/TenantAdminsManager.tsx
// 👥 Tenant Admins Manager - Manage tenant administrators

import React, { useState, useTransition } from 'react';
import { TenantAdmin, TenantAdminRole } from '@/lib/types/tenant';
import { Plus, Trash2, Loader2, Mail, Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';

// ============================================
// TYPES
// ============================================

interface TenantAdminsManagerProps {
  tenantId: string;
  initialAdmins: TenantAdmin[];
}

// ============================================
// COMPONENT
// ============================================

export function TenantAdminsManager({ tenantId, initialAdmins }: TenantAdminsManagerProps) {
  const [admins, setAdmins] = useState<TenantAdmin[]>(initialAdmins);
  const [showInvite, setShowInvite] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Invite form state
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'admin' as TenantAdminRole,
  });

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/tenants/${tenantId}/admins`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inviteData),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setAdmins([data.data, ...admins]);
          setShowInvite(false);
          setInviteData({ email: '', role: 'admin' });
        }
      } catch (error) {
        console.error('Failed to invite admin:', error);
      }
    });
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;
    
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/tenants/${tenantId}/admins/${adminId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setAdmins(admins.filter(a => a.id !== adminId));
        }
      } catch (error) {
        console.error('Failed to remove admin:', error);
      }
    });
  };

  const handleUpdateRole = async (adminId: string, newRole: TenantAdminRole) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/tenants/${tenantId}/admins/${adminId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        });
        
        if (response.ok) {
          setAdmins(admins.map(a => 
            a.id === adminId ? { ...a, role: newRole } : a
          ));
        }
      } catch (error) {
        console.error('Failed to update admin role:', error);
      }
    });
  };

  const getRoleBadgeColor = (role: TenantAdminRole) => {
    const colors: Record<TenantAdminRole, string> = {
      owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      manager: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
    };
    return colors[role];
  };

  return (
    <div className="space-y-4">
      {/* Invite Form */}
      {showInvite ? (
        <form onSubmit={handleInviteAdmin} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={inviteData.email}
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@company.com"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Role
              </label>
              <select
                value={inviteData.role}
                onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value as TenantAdminRole }))}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !inviteData.email}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Invite'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowInvite(true)}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 border border-dashed border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Invite Admin</span>
        </button>
      )}

      {/* Admins List */}
      {admins.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No administrators added yet
        </p>
      ) : (
        <div className="space-y-2">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {admin.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      {admin.display_name ? (
                        <span className="font-medium text-gray-900 dark:text-white">
                          {admin.display_name}
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic">
                          Invited
                        </span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getRoleBadgeColor(admin.role)}`}>
                        {admin.role}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Mail className="h-3 w-3" />
                      <span>{admin.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {admin.accepted_at ? (
                    <span className="flex items-center text-green-600 dark:text-green-400">
                      <Shield className="h-3 w-3 mr-1" />
                      Accepted
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </span>
                  )}
                  {admin.last_login_at && (
                    <span>
                      Last login: {format(new Date(admin.last_login_at), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {/* Role selector */}
                <select
                  value={admin.role}
                  onChange={(e) => handleUpdateRole(admin.id, e.target.value as TenantAdminRole)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={admin.role === 'owner' && admins.filter(a => a.role === 'owner').length === 1}
                >
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
                
                <button
                  onClick={() => handleRemoveAdmin(admin.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove admin"
                  disabled={admin.role === 'owner' && admins.filter(a => a.role === 'owner').length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


