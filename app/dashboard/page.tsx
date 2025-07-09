import { redirect } from 'next/navigation';
import { UserAvatar } from '@/components/auth/user-avatar';
import ThemeToggle from '@/components/theme-toggle';
import { getCurrentUser } from '@/lib/auth-client';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Task Manager</h1>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <UserAvatar user={user} />
          </div>
        </div>
      </header>
      <main className="container py-6">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
        <p className="text-muted-foreground">Your task will apppear here.</p>
      </main>
    </div>
  );
}
