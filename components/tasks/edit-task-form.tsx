'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema, type UpdateTaskInput } from '@/lib/validations/task';
import { useUpdateTask } from '@/hooks/use-tasks';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Task } from '@prisma/client';
import { useEditingStore } from '@/lib/stores/editing-store';
import {
  TitleField,
  DescriptionField,
  PriorityField,
  DueDateField,
} from '@/components/tasks/form-fields';
import { format } from 'date-fns';

interface EditTaskFormProps {
  task: Task;
}

export function EditTaskForm({ task }: EditTaskFormProps) {
  const { clearEditingTaskId } = useEditingStore();

  const form = useForm<UpdateTaskInput>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
    },
  });

  const { mutate: updateTask, isPending } = useUpdateTask();

  const handleSubmit = (data: UpdateTaskInput) => {
    updateTask(
      { id: task.id, data },
      {
        onSuccess: () => {
          clearEditingTaskId();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <TitleField control={form.control} isPending={isPending} />
        <DescriptionField control={form.control} isPending={isPending} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PriorityField control={form.control} isPending={isPending} />
          <DueDateField control={form.control} isPending={isPending} />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={clearEditingTaskId}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
