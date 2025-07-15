import { ReactNode } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import type { User } from 'next-auth';

interface DashboardLayoutProps {
  user: User;
  children: ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />
      <main className="container py-6 px-4">{children}</main>
    </div>
  );
}
