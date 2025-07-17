import { ReactNode } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import type { User } from 'next-auth';
import { AddTaskModal } from '@/components/tasks/add-task-modal';

interface DashboardLayoutProps {
  user: User;
  children: ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />
      <main className="container py-6 px-4">{children}</main>
      <AddTaskModal />
    </div>
  );
}
