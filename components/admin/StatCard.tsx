// components/admin/StatCard.tsx
// 📊 Admin Dashboard Statistic Cards

'use client';

import { ReactNode } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  iconBg?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  href?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  iconBg = 'bg-indigo-100 dark:bg-indigo-900/30',
  trend,
  loading = false,
  href,
  onClick,
}: StatCardProps) {
  const Wrapper = href ? 'a' : onClick ? 'button' : 'div';
  
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (trend === 'down') return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <Wrapper
      {...(href ? { href } : {})}
      {...(onClick ? { onClick } : {})}
      className={`block bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 transition-all ${
        href || onClick ? 'hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      {(change !== undefined || changeLabel) && (
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            {change !== undefined && (
              <span>{change > 0 ? '+' : ''}{change}%</span>
            )}
          </span>
          {changeLabel && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{changeLabel}</span>
          )}
        </div>
      )}
    </Wrapper>
  );
}

// Grid wrapper for stat cards
interface StatGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export function StatGrid({ children, columns = 4 }: StatGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {children}
    </div>
  );
}

// Alert Card for warnings/notices
interface AlertCardProps {
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function AlertCard({ type, title, message, action }: AlertCardProps) {
  const styles = {
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  };

  return (
    <div className={`rounded-xl p-4 border ${styles[type]}`}>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm opacity-80">{message}</p>
      {action && (
        action.href ? (
          <a
            href={action.href}
            className="mt-2 inline-block text-sm font-medium underline hover:no-underline"
          >
            {action.label}
          </a>
        ) : (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

// Quick Action Card
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function QuickActionCard({
  title,
  description,
  icon,
  href,
  onClick,
  disabled = false,
}: QuickActionCardProps) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <div>
        <p className="font-medium text-slate-700 dark:text-white">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <ArrowUpRight className="w-5 h-5 text-slate-400 ml-auto" />
    </div>
  );

  const className = `text-left bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 transition-all ${
    disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800'
  }`;

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}

