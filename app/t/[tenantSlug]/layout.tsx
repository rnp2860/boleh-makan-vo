// app/t/[tenantSlug]/layout.tsx
// 🏢 Tenant-scoped Layout - Wraps all pages under /t/[tenantSlug]/

import { notFound } from 'next/navigation';
import { getTenantBySlug } from '@/lib/tenant/resolver';
import { TenantProvider } from '@/lib/tenant/context';
import { TenantBrandingProvider } from '@/components/tenant/TenantBrandingProvider';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: {
    tenantSlug: string;
  };
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  // Resolve tenant from slug
  const tenant = await getTenantBySlug(params.tenantSlug);
  
  if (!tenant) {
    notFound();
  }
  
  // Check if tenant is active
  if (tenant.status !== 'active' && tenant.status !== 'trial') {
    notFound();
  }
  
  return (
    <TenantProvider tenant={tenant} method="path_prefix">
      <TenantBrandingProvider>
        {children}
      </TenantBrandingProvider>
    </TenantProvider>
  );
}

// Generate metadata based on tenant
export async function generateMetadata({ params }: TenantLayoutProps) {
  const tenant = await getTenantBySlug(params.tenantSlug);
  
  if (!tenant) {
    return { title: 'Not Found' };
  }
  
  return {
    title: {
      default: tenant.name,
      template: `%s | ${tenant.name}`,
    },
    description: `${tenant.name} - Powered by Boleh Makan`,
    icons: tenant.favicon_url ? [{ rel: 'icon', url: tenant.favicon_url }] : undefined,
  };
}


