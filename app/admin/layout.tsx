// app/admin/layout.tsx
// 🎛️ Admin Dashboard Layout

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';
import { getAdminFromRequest } from './actions';

export const metadata = {
  title: 'Admin Dashboard | Boleh Makan',
  description: 'Boleh Makan Admin Dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side admin verification
  const admin = await getAdminFromRequest();

  // If no admin access, redirect to main app
  if (!admin) {
    redirect('/dashboard?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Suspense fallback={<AdminLayoutSkeleton />}>
        <AdminLayoutClient admin={admin}>
          {children}
        </AdminLayoutClient>
      </Suspense>
    </div>
  );
}

function AdminLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        <div className="p-4 animate-pulse">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-6" />
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

