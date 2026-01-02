// app/admin/content/announcements/page.tsx
// 📢 Admin Announcements Management

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import {
  Plus,
  Megaphone,
  AlertTriangle,
  Info,
  Wrench,
  Sparkles,
  Calendar,
  Eye,
  X,
  Edit,
  Trash2,
} from 'lucide-react';
import { getSupabaseServiceClient } from '@/lib/supabase';

async function getAnnouncements() {
  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return data || [];
}

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-blue-500" />;
      case 'feature': return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'promotion': return <Megaphone className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (announcement: any) => {
    const now = new Date();
    const starts = new Date(announcement.starts_at);
    const ends = announcement.ends_at ? new Date(announcement.ends_at) : null;

    if (!announcement.is_active) {
      return <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">Inactive</span>;
    }
    if (starts > now) {
      return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Scheduled</span>;
    }
    if (ends && ends < now) {
      return <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">Expired</span>;
    }
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Announcements</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage system-wide announcements and notifications
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        {announcements.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {announcements.map((announcement: any) => (
              <div key={announcement.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    {getTypeIcon(announcement.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {announcement.title}
                      </h3>
                      {getStatusBadge(announcement)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {announcement.body}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(announcement.starts_at)}
                        {announcement.ends_at && ` - ${formatDate(announcement.ends_at)}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {announcement.view_count} views
                      </span>
                      <span className="flex items-center gap-1">
                        <X className="w-3 h-3" />
                        {announcement.dismiss_count} dismissed
                      </span>
                      <span>Target: {announcement.target_audience}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 dark:text-white mb-2">No announcements yet</h3>
            <p className="text-sm text-slate-500 mb-4">Create your first announcement to notify users</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Announcement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

