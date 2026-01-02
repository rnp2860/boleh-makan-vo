// middleware.ts
// 🏢 Next.js Middleware - Tenant Resolution & Route Protection

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================
// CONFIGURATION
// ============================================

const MAIN_DOMAINS = [
  'bolehmakan.my',
  'www.bolehmakan.my',
  'app.bolehmakan.my',
  'localhost',
  '127.0.0.1',
];

const RESERVED_SUBDOMAINS = [
  'www',
  'app',
  'api',
  'admin',
  'staging',
  'dev',
  'test',
];

// Paths that don't need tenant resolution
const EXCLUDED_PATHS = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/.well-known',
];

// Admin paths that require admin auth check
const ADMIN_PATHS = ['/admin'];

// ============================================
// MIDDLEWARE
// ============================================

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Skip excluded paths
  if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Handle API routes with tenant context
  if (pathname.startsWith('/api/t/')) {
    return handleTenantApiRoute(request);
  }
  
  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    return handleAdminRoute(request);
  }
  
  // Resolve tenant from hostname
  const tenantInfo = resolveTenantFromHostname(hostname);
  
  // Handle path-based tenant routing
  if (pathname.startsWith('/t/')) {
    return handlePathBasedTenant(request);
  }
  
  // If we have a subdomain tenant, inject it into headers
  if (tenantInfo.subdomain && !tenantInfo.isMainDomain) {
    return addTenantHeaders(request, tenantInfo.subdomain, 'subdomain');
  }
  
  // Check for custom domain (will be resolved at runtime)
  if (!tenantInfo.isMainDomain && !tenantInfo.isLocalhost) {
    return addTenantHeaders(request, hostname, 'custom_domain');
  }
  
  return NextResponse.next();
}

// ============================================
// ROUTE HANDLERS
// ============================================

/**
 * Handle tenant-scoped API routes
 * /api/t/[tenantSlug]/endpoint → /api/endpoint with tenant context
 */
function handleTenantApiRoute(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  
  // Extract tenant slug from path: /api/t/ijm/users → ijm
  const match = pathname.match(/^\/api\/t\/([a-zA-Z0-9-]+)(\/.*)?$/);
  
  if (!match) {
    return NextResponse.json(
      { error: 'Invalid tenant API path' },
      { status: 400 }
    );
  }
  
  const tenantSlug = match[1];
  const actualPath = match[2] || '';
  
  // Rewrite to regular API path
  const url = request.nextUrl.clone();
  url.pathname = `/api${actualPath}`;
  
  // Add tenant header
  const response = NextResponse.rewrite(url);
  response.headers.set('x-tenant-slug', tenantSlug);
  response.headers.set('x-tenant-resolution', 'path_api');
  
  return response;
}

/**
 * Handle path-based tenant routes
 * /t/ijm/dashboard → /dashboard with tenant context
 */
function handlePathBasedTenant(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;
  
  // Extract tenant slug from path: /t/ijm/dashboard → ijm
  const match = pathname.match(/^\/t\/([a-zA-Z0-9-]+)(\/.*)?$/);
  
  if (!match) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  const tenantSlug = match[1];
  const actualPath = match[2] || '/';
  
  // Rewrite URL but keep the original path for client-side routing
  const url = request.nextUrl.clone();
  url.pathname = actualPath;
  
  const response = NextResponse.rewrite(url);
  response.headers.set('x-tenant-slug', tenantSlug);
  response.headers.set('x-tenant-resolution', 'path_prefix');
  response.headers.set('x-tenant-path', pathname);
  
  return response;
}

/**
 * Handle admin routes - check for admin session
 */
function handleAdminRoute(request: NextRequest): NextResponse {
  // Check for admin session cookie
  const adminSession = request.cookies.get('admin-session');
  
  // If no session and not on login page, we still allow access
  // The actual auth check happens at the page level
  // This is just for adding any necessary headers
  
  const response = NextResponse.next();
  response.headers.set('x-admin-route', 'true');
  
  return response;
}

/**
 * Add tenant headers to request
 */
function addTenantHeaders(
  request: NextRequest,
  identifier: string,
  method: string
): NextResponse {
  const response = NextResponse.next();
  
  // Add tenant identification headers
  // These will be read by server components and API routes
  response.headers.set('x-tenant-identifier', identifier);
  response.headers.set('x-tenant-resolution', method);
  
  return response;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

interface TenantInfo {
  isMainDomain: boolean;
  isLocalhost: boolean;
  subdomain: string | null;
  hostname: string;
}

/**
 * Extract tenant information from hostname
 */
function resolveTenantFromHostname(hostname: string): TenantInfo {
  // Remove port from hostname
  const hostnameWithoutPort = hostname.split(':')[0].toLowerCase();
  
  // Check if localhost
  const isLocalhost = 
    hostnameWithoutPort === 'localhost' || 
    hostnameWithoutPort === '127.0.0.1';
  
  if (isLocalhost) {
    return {
      isMainDomain: true,
      isLocalhost: true,
      subdomain: null,
      hostname: hostnameWithoutPort,
    };
  }
  
  // Check if it's a main domain
  const isMainDomain = MAIN_DOMAINS.some(
    domain => hostnameWithoutPort === domain || 
              hostnameWithoutPort === domain.toLowerCase()
  );
  
  if (isMainDomain) {
    return {
      isMainDomain: true,
      isLocalhost: false,
      subdomain: null,
      hostname: hostnameWithoutPort,
    };
  }
  
  // Try to extract subdomain
  // Pattern: subdomain.bolehmakan.my
  const parts = hostnameWithoutPort.split('.');
  
  if (parts.length >= 3) {
    const potentialSubdomain = parts[0];
    const baseDomain = parts.slice(1).join('.');
    
    // Check if base domain matches our main domain
    if (baseDomain === 'bolehmakan.my') {
      // Skip reserved subdomains
      if (!RESERVED_SUBDOMAINS.includes(potentialSubdomain)) {
        return {
          isMainDomain: false,
          isLocalhost: false,
          subdomain: potentialSubdomain,
          hostname: hostnameWithoutPort,
        };
      }
    }
  }
  
  // Custom domain - not main domain and no subdomain match
  return {
    isMainDomain: false,
    isLocalhost: false,
    subdomain: null,
    hostname: hostnameWithoutPort,
  };
}

// ============================================
// MATCHER
// ============================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g., images)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};


