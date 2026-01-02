'use client';

// app/admin/tenants/[tenantId]/InviteCodesManager.tsx
// 🎫 Invite Codes Manager - Create and manage tenant invite codes

import React, { useState, useTransition } from 'react';
import { TenantInviteCode } from '@/lib/types/tenant';
import { Plus, Copy, Trash2, Loader2, Check, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

// ============================================
// TYPES
// ============================================

interface InviteCodesManagerProps {
  tenantId: string;
  initialCodes: TenantInviteCode[];
}

// ============================================
// COMPONENT
// ============================================

export function InviteCodesManager({ tenantId, initialCodes }: InviteCodesManagerProps) {
  const [codes, setCodes] = useState<TenantInviteCode[]>(initialCodes);
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New code form state
  const [newCode, setNewCode] = useState({
    code: '',
    description: '',
    max_uses: '',
    expires_at: '',
  });

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/tenants/${tenantId}/invite-codes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: newCode.code.toUpperCase(),
            description: newCode.description || null,
            max_uses: newCode.max_uses ? parseInt(newCode.max_uses) : null,
            expires_at: newCode.expires_at || null,
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setCodes([data.data, ...codes]);
          setShowCreate(false);
          setNewCode({ code: '', description: '', max_uses: '', expires_at: '' });
        }
      } catch (error) {
        console.error('Failed to create invite code:', error);
      }
    });
  };

  const handleDeleteCode = async (codeId: string) => {
    if (!confirm('Are you sure you want to delete this invite code?')) return;
    
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/tenants/${tenantId}/invite-codes/${codeId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setCodes(codes.filter(c => c.id !== codeId));
        }
      } catch (error) {
        console.error('Failed to delete invite code:', error);
      }
    });
  };

  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(prev => ({ ...prev, code: result }));
  };

  return (
    <div className="space-y-4">
      {/* Create Form */}
      {showCreate ? (
        <form onSubmit={handleCreateCode} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCode.code}
                  onChange={(e) => setNewCode(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="IJMSTAFF"
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-2 py-1.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Random
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newCode.description}
                onChange={(e) => setNewCode(prev => ({ ...prev, description: e.target.value }))}
                placeholder="For HR department"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Max Uses (empty = unlimited)
              </label>
              <input
                type="number"
                value={newCode.max_uses}
                onChange={(e) => setNewCode(prev => ({ ...prev, max_uses: e.target.value }))}
                placeholder="Unlimited"
                min="1"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Expires At (optional)
              </label>
              <input
                type="datetime-local"
                value={newCode.expires_at}
                onChange={(e) => setNewCode(prev => ({ ...prev, expires_at: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !newCode.code}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowCreate(true)}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 border border-dashed border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Invite Code</span>
        </button>
      )}

      {/* Codes List */}
      {codes.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No invite codes created yet
        </p>
      ) : (
        <div className="space-y-2">
          {codes.map((code) => {
            const isExpired = code.expires_at && new Date(code.expires_at) < new Date();
            const isExhausted = code.max_uses && code.current_uses >= code.max_uses;
            
            return (
              <div
                key={code.id}
                className={`
                  flex items-center justify-between p-3 rounded-lg border
                  ${isExpired || isExhausted || !code.is_active
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <code className="font-mono font-semibold text-gray-900 dark:text-white">
                      {code.code}
                    </code>
                    {isExpired && (
                      <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                        Expired
                      </span>
                    )}
                    {isExhausted && (
                      <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
                        Exhausted
                      </span>
                    )}
                  </div>
                  
                  {code.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {code.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {code.current_uses}{code.max_uses ? `/${code.max_uses}` : ''} uses
                    </span>
                    {code.expires_at && (
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Expires {format(new Date(code.expires_at), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => copyToClipboard(code.code, code.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    title="Copy code"
                  >
                    {copiedId === code.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteCode(code.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete code"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


