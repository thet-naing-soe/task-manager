import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme-toggle';
import { getCurrentUser } from '@/lib/auth-client';
import Link from 'next/link';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center space-y-6">
        <h1 className=" text-4xl font-bold">Task Manager</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your task management system
        </p>
        <div>
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
