// components/admin/AdminSidebar.tsx
// 🎛️ Admin Dashboard Sidebar Navigation

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  Apple,
  Megaphone,
  HeadphonesIcon,
  Flag,
  ScrollText,
  ChevronDown,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { AdminUser, ADMIN_NAV_ITEMS } from '@/lib/types/admin';
import { filterNavByPermissions, getRoleBadgeColor, getRoleDisplayName } from '@/lib/admin/permissions';

interface AdminSidebarProps {
  admin: AdminUser;
  onLogout: () => void;
}

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  Apple,
  Megaphone,
  HeadphonesIcon,
  Flag,
  ScrollText,
};

export default function AdminSidebar({ admin, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const filteredNavItems = filterNavByPermissions(ADMIN_NAV_ITEMS, admin);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const NavItem = ({ item, depth = 0 }: { item: typeof ADMIN_NAV_ITEMS[0]; depth?: number }) => {
    const Icon = ICON_MAP[item.icon] || FileText;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.href);
    const active = isActive(item.href);

    return (
      <div>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.href)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => (
              <NavItem key={child.href} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo & Brand */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-white">Boleh Makan</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map(item => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      {/* User Info & Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        {/* Admin Profile */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            {admin.display_name?.[0] || admin.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-700 dark:text-white truncate">
              {admin.display_name || admin.email.split('@')[0]}
            </p>
            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getRoleBadgeColor(admin.role)}`}>
              {getRoleDisplayName(admin.role)}
            </span>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mb-2"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">Admin</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        <SidebarContent />
      </aside>
    </>
  );
}

