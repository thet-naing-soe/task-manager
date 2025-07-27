'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, type CreateTaskInput } from '@/lib/validations/task';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCreateTask } from '@/hooks/use-tasks';
import { Loader2 } from 'lucide-react';
import {
  TitleField,
  DescriptionField,
  PriorityField,
  DueDateField,
} from '@/components/tasks/form-fields';
import { DEFAULT_TASK_VALUES } from '@/lib/constants/tasks';
import { useFilterValues } from '@/lib/stores/filter-store';

interface AddTaskFormProps {
  onSuccess?: () => void;
}

export function AddTaskForm({ onSuccess }: AddTaskFormProps) {
  const form = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: DEFAULT_TASK_VALUES,
  });

  const filters = useFilterValues();

  const { mutate: addTask, isPending } = useCreateTask(filters);

  const handleSubmit = (data: CreateTaskInput) => {
    addTask(data, {
      onSuccess: () => {
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <TitleField control={form.control} isPending={isPending} />
        <DescriptionField control={form.control} isPending={isPending} />
        <PriorityField control={form.control} isPending={isPending} />
        <DueDateField control={form.control} isPending={isPending} />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Task'
          )}
        </Button>
      </form>
    </Form>
  );
}
