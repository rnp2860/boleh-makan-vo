'use client';

// app/admin/cgm/page.tsx
// 📊 Admin CGM Waitlist Dashboard - Manage and analyze waitlist

import React, { useState, useEffect } from 'react';
import {
  Activity, Users, TrendingUp, Download, Mail,
  Search, ChevronLeft, ChevronRight, MoreHorizontal,
  Loader2, Check, X, RefreshCw, PieChart, BarChart3
} from 'lucide-react';
import {
  WaitlistStatsResponse,
  CGMWaitlistEntry,
  CGMDeviceType,
  WaitlistStatus,
} from '@/lib/cgm/types';
import { CGM_DEVICES, CGM_FEATURES } from '@/lib/cgm/devices';

// ============================================
// PAGE COMPONENT
// ============================================

export default function AdminCGMPage() {
  const [stats, setStats] = useState<WaitlistStatsResponse | null>(null);
  const [entries, setEntries] = useState<CGMWaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WaitlistStatus | 'all'>('all');
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const pageSize = 20;

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, entriesRes] = await Promise.all([
        fetch('/api/admin/cgm/stats'),
        fetch('/api/admin/cgm/entries'),
      ]);

      const statsData = await statsRes.json();
      const entriesData = await entriesRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
      }

      if (entriesData.success) {
        setEntries(entriesData.entries);
      }
    } catch (error) {
      console.error('Failed to fetch CGM data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.referral_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEntries.length / pageSize);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Export CSV
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/admin/cgm/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cgm-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Invite to beta
  const handleInviteToBeta = async () => {
    if (selectedEntries.length === 0) return;
    
    setIsInviting(true);
    try {
      const response = await fetch('/api/admin/cgm/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryIds: selectedEntries }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Successfully invited ${data.invitedCount} users to beta!`);
        setSelectedEntries([]);
        fetchData();
      }
    } catch (error) {
      console.error('Invite failed:', error);
    } finally {
      setIsInviting(false);
    }
  };

  // Toggle entry selection
  const toggleEntry = (id: string) => {
    setSelectedEntries(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  // Select all on current page
  const toggleAllOnPage = () => {
    const pageIds = paginatedEntries.map(e => e.id);
    const allSelected = pageIds.every(id => selectedEntries.includes(id));
    
    if (allSelected) {
      setSelectedEntries(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedEntries(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="h-7 w-7 mr-3 text-violet-600" />
            CGM Waitlist Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage CGM integration waitlist signups
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Signups"
            value={stats.totalSignups}
            icon={Users}
            color="violet"
          />
          <StatCard
            title="Waiting"
            value={stats.waitingCount}
            icon={Activity}
            color="blue"
          />
          <StatCard
            title="Beta Active"
            value={stats.betaActiveCount}
            icon={Check}
            color="green"
          />
          <StatCard
            title="Converted"
            value={stats.convertedCount}
            icon={TrendingUp}
            color="emerald"
          />
        </div>
      )}

      {/* Charts Row */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-violet-500" />
              Device Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.deviceBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([device, count]) => {
                  const deviceInfo = CGM_DEVICES[device as CGMDeviceType];
                  const percentage = ((count / stats.totalSignups) * 100).toFixed(1);
                  
                  return (
                    <div key={device} className="flex items-center">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {deviceInfo?.name || device.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Feature Interest */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-violet-500" />
              Feature Interest
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.featureBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([feature, count]) => {
                  const featureInfo = CGM_FEATURES.find(f => f.code === feature);
                  const percentage = ((count / stats.totalSignups) * 100).toFixed(1);
                  
                  return (
                    <div key={feature} className="flex items-center">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {featureInfo?.label || feature.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Top Referrers */}
      {stats && stats.topReferrers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            🏆 Top Referrers
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {stats.topReferrers.slice(0, 5).map((referrer, i) => (
              <div
                key={referrer.referralCode}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="text-2xl mb-1">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '⭐'}
                </div>
                <div className="font-mono text-sm text-violet-600 dark:text-violet-400 mb-1">
                  {referrer.referralCode}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {referrer.count} referrals
                </div>
                {referrer.name && (
                  <div className="text-xs text-gray-500 truncate">
                    {referrer.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Waitlist Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, name, or code..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as WaitlistStatus | 'all');
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="waiting">Waiting</option>
                <option value="beta_invited">Beta Invited</option>
                <option value="beta_active">Beta Active</option>
                <option value="converted">Converted</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
              
              {selectedEntries.length > 0 && (
                <button
                  onClick={handleInviteToBeta}
                  disabled={isInviting}
                  className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {isInviting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Invite to Beta ({selectedEntries.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={paginatedEntries.length > 0 && paginatedEntries.every(e => selectedEntries.includes(e.id))}
                    onChange={toggleAllOnPage}
                    className="w-4 h-4 text-violet-600 rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Device
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Referrals
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(entry.id)}
                      onChange={() => toggleEntry(entry.id)}
                      className="w-4 h-4 text-violet-600 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {entry.name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.email}
                      </div>
                      <div className="text-xs text-violet-600 dark:text-violet-400 font-mono">
                        {entry.referral_code}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {entry.current_device?.replace(/_/g, ' ') || 'Not specified'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">
                        #{entry.queue_position - entry.queue_boost}
                      </span>
                      {entry.queue_boost > 0 && (
                        <span className="text-green-600 dark:text-green-400 text-xs ml-1">
                          (+{entry.queue_boost})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      {entry.referral_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              
              {paginatedEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredEntries.length)} of {filteredEntries.length}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages || 1}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'violet' | 'blue' | 'green' | 'emerald';
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: WaitlistStatus }) {
  const statusStyles: Record<WaitlistStatus, string> = {
    waiting: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    beta_invited: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    beta_active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    converted: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    unsubscribed: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}


