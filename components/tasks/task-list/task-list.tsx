'use client';

import { TaskItem } from '@/components/tasks/task-list/task-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTasks } from '@/hooks/use-tasks';
import { TaskSkeleton } from '@/components/tasks/task-list/task-skeleton';
import { EmptyState } from '@/components/tasks/task-list/empty-state';
import { ErrorState } from '@/components/tasks/task-list/error-state';

export function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return <TaskSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </ScrollArea>
  );
}
