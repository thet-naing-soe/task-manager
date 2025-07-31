'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { UserAvatar } from '@/components/auth/user-avatar';
import type { User } from 'next-auth';

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <h1 className="text-xl font-semibold">Task Manager</h1>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserAvatar user={user} />
        </div>
      </div>
    </header>
  );
}
