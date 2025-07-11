'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Task } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput } from '@/lib/validations/task';
import { toast } from 'sonner';

// Tasks fetch function
const getTasks = async (): Promise<Task[]> => {
  const res = await fetch('/api/tasks');
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return res.json();
};

// Tasks hook
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
}

// Create task function
const createTask = async (data: CreateTaskInput): Promise<Task[]> => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => {
      error: 'Failed to create task';
    });
    throw new Error(errorData.error || 'Failed to create task');
  }
  return res.json();
};

// Create task hook
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Faild to create task.');
    },
  });
}

// Update task function
const updateTask = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateTaskInput;
}): Promise<Task[]> => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update task');
  }
  return res.json();
};

// Update task hook
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update task.');
    },
  });
}

// Delete task function
const deleteTask = async (id: string): Promise<any> => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete task');
  }
  return res.json();
};

// Delete task hook
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete task.');
    },
  });
}
