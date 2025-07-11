'use client';

import { Task, Priority } from '@prisma/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useDeleteTask, useUpdateTask } from '@/hooks/use-tasks';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const priorityColors = {
    [Priority.LOW]:
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    [Priority.MEDIUM]:
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    [Priority.HIGH]:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    [Priority.URGENT]:
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  };

  const handleToggleComplete = () => {
    updateTask({ id: task.id, data: { completed: !task.completed } });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const isLoading = isUpdating || isDeleting;

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-4 rounded-lg border bg-card transition-all',
        task.completed && 'opacity-60',
        isLoading && 'animate-pulse'
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggleComplete}
        disabled={isLoading}
        className="mt-1"
      />

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p
              className={cn(
                'font-medium leading-none',
                task.completed && 'line-through'
              )}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Badge variant="secondary" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>

          {task.dueDate && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
