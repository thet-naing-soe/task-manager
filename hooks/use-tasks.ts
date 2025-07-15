'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Task } from '@prisma/client';
import * as taskApi from '@/lib/api/tasks';
import { QUERY_KEYS } from '@/lib/constants/tasks';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations/task';

// Helper function for error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

// Helper function for date conversion
function convertToDate(
  dateValue: string | Date | null | undefined
): Date | null {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;

  try {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

// Fetch all tasks
export function useTasks() {
  return useQuery<Task[], Error>({
    queryKey: QUERY_KEYS.tasks.all,
    queryFn: taskApi.fetchTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput>({
    mutationFn: taskApi.createTask,
    onSuccess: (newTask) => {
      // Optimistically add to cache
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (oldTasks) => {
        if (!oldTasks) return [newTask];
        return [...oldTasks, newTask];
      });

      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tasks.all,
      });
    },
  });
}

// Update task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<
    Task,
    Error,
    { id: string; data: UpdateTaskInput },
    { previousTasks?: Task[] }
  >({
    mutationFn: ({ id, data }) => taskApi.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any in-flight queries
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.tasks.all,
      });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(
        QUERY_KEYS.tasks.all
      );

      // Optimistically update
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.map((task) => {
          if (task.id === id) {
            const updateTask = { ...task, data };
            if (data.dueDate !== undefined) {
              updateTask.dueDate = convertToDate(data.dueDate);
            }
            return updateTask;
          }
          return task;
        });
      });

      return { previousTasks };
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
      }
      toast.error(getErrorMessage(error));
    },
    onSuccess: (_, variables) => {
      // Show appropriate message
      if (variables.data.completed !== undefined) {
        const message = variables.data.completed
          ? 'Task marked as complete!'
          : 'Task marked as incomplete!';
        toast.success(message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tasks.all,
      });
    },
  });
}

// Delete task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    string,
    { previousTasks?: Task[] }
  >({
    mutationFn: taskApi.deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.tasks.all,
      });

      const previousTasks = queryClient.getQueryData<Task[]>(
        QUERY_KEYS.tasks.all
      );

      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.filter((task) => task.id !== taskId);
      });

      return { previousTasks };
    },
    onError: (error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.tasks.all, context.previousTasks);
      }
      toast.error(getErrorMessage(error));
    },
    onSuccess: () => {
      toast.success('Task deleted successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tasks.all,
      });
    },
  });
}
