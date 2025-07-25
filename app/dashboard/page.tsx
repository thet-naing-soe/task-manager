import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-client';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { WelcomeSection } from '@/components/dashboard/welcome-section';
import { TaskSection } from '@/components/dashboard/task-section';
import { StatsSection } from '@/components/dashboard/stats-section';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <DashboardLayout user={user}>
      <WelcomeSection userName={user.name || 'User'} />
      <StatsSection />
      <TaskSection />
    </DashboardLayout>
  );
}
