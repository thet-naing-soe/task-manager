'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Task } from '@prisma/client';
import * as taskApi from '@/lib/api/tasks';
import { QUERY_KEYS } from '@/lib/constants/tasks';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations/task';
import { convertToDate, getErrorMessage } from '@/lib/utils';

interface TaskFilters {
  searchQuery: string;
  status: string;
  priority: string;
  sortBy: string;
}

// Fetch all tasks with filters
export function useTasks(filters: TaskFilters) {
  const queryKey = [QUERY_KEYS.tasks.all, filters];
  return useQuery<Task[], Error>({
    queryKey,
    queryFn: () => taskApi.fetchTasks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch specific task
export function useTask(taskId: string) {
  return useQuery<Task, Error>({
    queryKey: QUERY_KEYS.tasks.detail(taskId),
    queryFn: () => taskApi.fetchTaskById(taskId),
    enabled: !!taskId,
  });
}

// Create task
export function useCreateTask(filters: TaskFilters) {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.tasks.all, filters];

  return useMutation<Task, Error, CreateTaskInput, { previousTasks?: Task[] }>({
    mutationFn: taskApi.createTask,
    onMutate: async (newTaskData) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        ...newTaskData,
        description: newTaskData.description ?? null,
        completed: false,
        userId: 'temp-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: newTaskData.dueDate ? new Date(newTaskData.dueDate) : null,
      };

      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old ? [...old, optimisticTask] : [optimisticTask]
      );

      return { previousTasks };
    },

    onError: (err, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
      toast.error(getErrorMessage(err));
    },

    onSuccess: (newlyCreatedTask) => {
      queryClient.setQueryData<Task[]>(queryKey, (oldTasks) =>
        oldTasks?.map((task) =>
          task.id.startsWith('temp-') ? newlyCreatedTask : task
        )
      );
      toast.success('Task created successfully!');
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}

// Update task
export function useUpdateTask(filters: TaskFilters) {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.tasks.all, filters];

  return useMutation<
    Task,
    Error,
    { id: string; data: UpdateTaskInput },
    { previousTasks?: Task[] }
  >({
    mutationFn: ({ id, data }) => taskApi.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (oldTasks = []) =>
        oldTasks.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              ...data,
              dueDate:
                data.dueDate !== undefined
                  ? convertToDate(data.dueDate)
                  : task.dueDate,
            };
          }
          return task;
        })
      );

      return { previousTasks };
    },
    onError: (error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
      toast.error(`Update failed: ${getErrorMessage(error)}`);
    },

    onSuccess: (_, { data }) => {
      if (data.completed !== undefined) {
        const message = data.completed
          ? 'Task marked as complete!'
          : 'Task marked as incomplete!';
        toast.success(message);
      } else {
        toast.success('Task updated successfully!');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}

// Delete task
export function useDeleteTask(filters: TaskFilters) {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.tasks.all, filters];

  return useMutation<
    { success: boolean },
    Error,
    string,
    { previousTasks?: Task[] }
  >({
    mutationFn: taskApi.deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey,
      });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (oldTasks = []) =>
        oldTasks.filter((task) => task.id !== taskId)
      );

      return { previousTasks };
    },
    onError: (error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
      toast.error(`Failed to delete task: ${getErrorMessage(error)}`);
    },
    onSuccess: () => {
      toast.success('Task deleted successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}

// Bulk Delete Tasks
export function useBulkDeleteTasks(filters: TaskFilters) {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.tasks.all, filters];

  return useMutation<
    { success: boolean; deletedCount: number },
    Error,
    string[],
    { previousTasks?: Task[] }
  >({
    mutationFn: (taskIds: string[]) => taskApi.bulkDeleteTasks(taskIds),
    onMutate: async (taskIdsToDelete) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (oldTasks = []) =>
        oldTasks.filter((task) => !taskIdsToDelete.includes(task.id))
      );
      return { previousTasks };
    },
    onSuccess: (data) => {
      toast.success(`${data.deletedCount} tasks deleted successfully!`);
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
      toast.error('Failed to delete tasks.Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

// Bulk Update Tasks
export function useBulkUpdateTasks(filters: TaskFilters) {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.tasks.all, filters];

  return useMutation<
    { success: boolean; updatedCount: number },
    Error,
    { taskIds: string[]; completed: boolean },
    { previousTasks?: Task[] }
  >({
    mutationFn: ({ taskIds, completed }) =>
      taskApi.bulkUpdateTasks(taskIds, completed),
    onMutate: async ({ taskIds, completed }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (oldTasks = []) =>
        oldTasks.map((task) =>
          taskIds.includes(task.id) ? { ...task, completed } : task
        )
      );
      return { previousTasks };
    },
    onSuccess: (data) => {
      toast.success(`${data.updatedCount} tasks updated.`);
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(queryKey, context.previousTasks);
      }
      toast.error('Failed to update tasks.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
