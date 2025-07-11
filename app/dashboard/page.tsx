import { redirect } from 'next/navigation';
import { UserAvatar } from '@/components/auth/user-avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { getCurrentUser } from '@/lib/auth-client';
import { AddTaskForm } from '@/components/tasks/add-task-form';
import { TaskList } from '@/components/tasks/task-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      <main className="container py-6 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome, {user.name}
          </h2>
          <p className="text-muted-foreground">Your task will apppear here.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
              <CardDescription>Add a new task to your list</CardDescription>
            </CardHeader>
            <CardContent>
              <AddTaskForm />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>View and manage your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
