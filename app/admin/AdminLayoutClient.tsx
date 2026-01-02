// app/admin/AdminLayoutClient.tsx
// 🎛️ Admin Layout Client Component

'use client';

import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminUser } from '@/lib/types/admin';

interface AdminLayoutClientProps {
  admin: AdminUser;
  children: React.ReactNode;
}

export default function AdminLayoutClient({
  admin,
  children,
}: AdminLayoutClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar admin={admin} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile header spacer */}
        <div className="h-16 lg:hidden" />
        
        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

