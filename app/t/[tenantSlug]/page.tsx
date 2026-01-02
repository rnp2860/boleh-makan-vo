// app/t/[tenantSlug]/page.tsx
// 🏢 Tenant Home Page - Redirects to dashboard or shows tenant-specific landing

import { redirect } from 'next/navigation';

interface TenantHomePageProps {
  params: Promise<{
    tenantSlug: string;
  }>;
}

export default async function TenantHomePage({ params }: TenantHomePageProps) {
  const { tenantSlug } = await params;
  // Redirect to the tenant's dashboard
  redirect(`/t/${tenantSlug}/dashboard`);
}


