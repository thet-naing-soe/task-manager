import type { Task } from '@prisma/client';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations/task';
import { handleResponse, getHeaders } from '@/lib/api/utils';

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks', {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function fetchTaskById(id: string): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateTask(
  id: string,
  data: UpdateTaskInput
): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function bulkDeleteTasks(
  taskIds: string[]
): Promise<{ success: boolean; deletedCount: number }> {
  const response = await fetch(`/api/tasks/bulk-delete`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ taskIds }),
  });
  return handleResponse(response);
}

export async function bulkUpdateTasks(
  taskIds: string[],
  completed: boolean
): Promise<{ success: boolean; updatedCount: number }> {
  const response = await fetch(`/api/tasks/bulk-update`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ taskIds, completed }),
  });
  return handleResponse(response);
}
