'use client';

import { Task } from '@prisma/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useDeleteTask, useUpdateTask } from '@/hooks/use-tasks';
import { PRIORITY_STYLES } from '@/lib/constants/tasks';
import { useEditingStore } from '@/lib/stores/editing-store';
import { EditTaskForm } from '@/components/tasks/edit-task-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const isLoading = isUpdating || isDeleting;
  const { editingTaskId, setEditingTaskId } = useEditingStore();
  const isEditing = editingTaskId === task.id;

  const handleToggleComplete = () => {
    updateTask({ id: task.id, data: { completed: !task.completed } });
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

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
        aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <EditTaskForm task={task} />
        ) : (
          <>
            <TaskContent task={task} />
            <TaskMetadata task={task} />
          </>
        )}
      </div>
      {!isEditing && (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingTaskId(task.id)}
            disabled={isLoading}
            aria-label="Edit Task"
          >
            <Pencil className="w -4 h-4" />
          </Button>
          <DeleteTaskDialog onDelete={handleDelete} isDisabled={isLoading} />
        </div>
      )}
    </div>
  );
}

function TaskContent({ task }: { task: Task }) {
  return (
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
        <p className="text-sm text-muted-foreground">{task.description}</p>
      )}
    </div>
  );
}

function TaskMetadata({ task }: { task: Task }) {
  return (
    <div className="flex items-center space-x-2 text-sm mt-2">
      <Badge variant="secondary" className={PRIORITY_STYLES[task.priority]}>
        {task.priority.toLowerCase()}
      </Badge>

      {task.dueDate && (
        <div className="flex items-center text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          {format(new Date(task.dueDate), 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
}

interface TaskActionsProps {
  onDelete: () => void;
  isDisabled: boolean;
}
function DeleteTaskDialog({ onDelete, isDisabled }: TaskActionsProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isDisabled}
          aria-label="Delete Task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be done. This will permanetly delete the task.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onDelete}
          >
            Delete Task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
