'use client';

import { useTasks } from '@/hooks/use-tasks';
import { useFilterStore } from '@/lib/stores/filter-store';
import { TaskItem } from '@/components/tasks/task-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskSkeleton } from '@/components/tasks/task-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { TaskFilters } from '@/components/tasks/task-filter';
import { BulkActionsToolbar } from '@/components/tasks/bulk-actions-toolbar';

export function TaskList() {
  const { searchQuery, status, priority, sortBy } = useFilterStore();
  const {
    data: tasks,
    isLoading,
    error,
  } = useTasks({ searchQuery, status, priority, sortBy });

  if (isLoading) {
    return <TaskSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div>
      <TaskFilters />
      {tasks && tasks.length === 0 ? (
        <EmptyState message="No tasks yet. Create your first task!" />
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {tasks?.map((task) => <TaskItem key={task.id} task={task} />)}
          </div>
        </ScrollArea>
      )}
      <BulkActionsToolbar />
    </div>
  );
}
