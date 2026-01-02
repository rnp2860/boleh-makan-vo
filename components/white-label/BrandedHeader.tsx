'use client';

// components/white-label/BrandedHeader.tsx
// 🏷️ Branded Header - Tenant-aware header component

import React from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun, User, Settings, LogOut } from 'lucide-react';
import { useTenant } from './ThemeProvider';
import { BrandedLogo } from './BrandedLogo';

// ============================================
// TYPES
// ============================================

interface NavItem {
  label: string;
  labelMs?: string;
  href: string;
  icon?: React.ReactNode;
}

interface BrandedHeaderProps {
  /**
   * Navigation items
   */
  navItems?: NavItem[];
  
  /**
   * User info for profile menu
   */
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  
  /**
   * Language for content
   */
  language?: 'en' | 'ms';
  
  /**
   * Show theme toggle
   */
  showThemeToggle?: boolean;
  
  /**
   * Custom right-side content
   */
  rightContent?: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Sticky header
   */
  sticky?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function BrandedHeader({
  navItems = [],
  user,
  language = 'en',
  showThemeToggle = true,
  rightContent,
  className = '',
  sticky = true,
}: BrandedHeaderProps) {
  const { colorScheme, setColorScheme, branding } = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  
  const toggleTheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <header
      className={`
        w-full bg-background/95 backdrop-blur-sm border-b border-border z-50
        ${sticky ? 'sticky top-0' : ''}
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <BrandedLogo size="md" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-alt rounded-lg transition-colors"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {language === 'ms' && item.labelMs ? item.labelMs : item.label}
              </Link>
            ))}
          </nav>
          
          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            {showThemeToggle && (
              <button
                onClick={toggleTheme}
                className="p-2 text-foreground-muted hover:text-foreground hover:bg-background-alt rounded-lg transition-colors"
                aria-label={colorScheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {colorScheme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
            )}
            
            {/* Custom Right Content */}
            {rightContent}
            
            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-background-alt rounded-lg transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </button>
                
                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg z-20 py-1">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-foreground-muted truncate">{user.email}</p>
                      </div>
                      
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-background-alt"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-danger hover:bg-danger-light"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          // Handle logout
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground-muted hover:text-foreground hover:bg-background-alt rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-foreground-muted hover:text-foreground hover:bg-background-alt rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {language === 'ms' && item.labelMs ? item.labelMs : item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

// ============================================
// SIMPLE HEADER (for auth pages)
// ============================================

interface SimpleHeaderProps {
  className?: string;
}

export function SimpleHeader({ className = '' }: SimpleHeaderProps) {
  const { colorScheme, setColorScheme } = useTenant();
  
  return (
    <header className={`w-full py-6 px-4 ${className}`}>
      <div className="max-w-md mx-auto flex items-center justify-between">
        <BrandedLogo size="md" />
        
        <button
          onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
          className="p-2 text-foreground-muted hover:text-foreground hover:bg-background-alt rounded-lg transition-colors"
        >
          {colorScheme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}


