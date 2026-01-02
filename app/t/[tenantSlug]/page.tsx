// app/t/[tenantSlug]/page.tsx
// 🏢 Tenant Home Page - Redirects to dashboard or shows tenant-specific landing

import { redirect } from 'next/navigation';

interface TenantHomePageProps {
  params: {
    tenantSlug: string;
  };
}

export default function TenantHomePage({ params }: TenantHomePageProps) {
  // Redirect to the tenant's dashboard
  redirect(`/t/${params.tenantSlug}/dashboard`);
}


