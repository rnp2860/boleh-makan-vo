// src/app/dashboard/layout.tsx
import { MobileLayout } from '@/components/MobileLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileLayout>{children}</MobileLayout>;
}

