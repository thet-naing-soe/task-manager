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
import { PRIORITY_ORDER } from '@/lib/constants/tasks';

export function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();

  const { searchQuery, status, priority, sortBy } = useFilterStore();

  const processedTasks = useMemo(() => {
    if (!tasks) return [];

    const filteredTasks = tasks.filter((task) => {
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

    const sortedTasks = [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];

        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

        case 'createAt':
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
    return sortedTasks;
  }, [tasks, searchQuery, status, priority, sortBy]); // Dependencies

  if (isLoading) {
    return <TaskSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div>
      <TaskFilters />
      {processedTasks.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {processedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
