'use client';

import { useMemo } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { useFilterStore } from '@/lib/stores/filter-store';
import { TaskItem } from '@/components/tasks/task-list/task-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskSkeleton } from '@/components/tasks/task-list/task-skeleton';
import { EmptyState } from '@/components/tasks/task-list/empty-state';
import { ErrorState } from '@/components/tasks/task-list/error-state';
import { TaskFilters } from '@/components/tasks/task-list/task-filter';

export function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();

  const { searchQuery, status, priority } = useFilterStore();

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      // Status filter
      if (status !== 'all') {
        if (status === 'completed' && !task.completed) return false;
        if (status === 'pending' && task.completed) return false;
      }

      // Priority filter
      if (priority !== 'all' && task.priority !== priority) {
        return false;
      }

      // Search query filter
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, status, priority]); // Dependencies

  if (isLoading) {
    return <TaskSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div>
      <TaskFilters /> {/* Filter UI */}
      {filteredTasks.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
