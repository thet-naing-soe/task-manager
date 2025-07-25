'use client';

import { useStats } from '@/hooks/use-stats';
import { ErrorState } from '../shared/error-state';
import { EmptyState } from '../shared/empty-state';
import { StatsSkeleton } from './stats-skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import {
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Siren,
} from 'lucide-react';

export function StatsSection() {
  const { data: stats, isLoading, error } = useStats();

  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!stats || stats.total === 0) {
    return <EmptyState message="No statistics to show yet. Add some tasks!" />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
        <StatCard title="Total Tasks" value={stats.total} Icon={ListTodo} />
        <StatCard
          title="Completed"
          value={stats.completed}
          Icon={CheckCircle2}
        />
        <StatCard title="Pending" value={stats.pending} Icon={AlertTriangle} />
        <StatCard
          title="Urgent Priority"
          value={stats.byPriority.URGENT}
          Icon={Siren}
        />
        <StatCard
          title="High Priority"
          value={stats.byPriority.HIGH}
          Icon={SignalHigh}
        />
        <StatCard
          title="Medium Priority"
          value={stats.byPriority.MEDIUM}
          Icon={SignalMedium}
        />
        <StatCard
          title="Low Priority"
          value={stats.byPriority.LOW}
          Icon={SignalLow}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  Icon,
}: {
  title: string;
  value: number;
  Icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
