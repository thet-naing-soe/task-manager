import type { Task } from '@prisma/client';
import type { CreateTaskInput, UpdateTaskInput } from '../validations/task';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    } catch (error) {
      throw new Error('Network error occurred');
    }
  }
  const data = response.json();
  return data;
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks', {
    headers: getHeaders(),
  });
  return handleResponse<Task[]>(response);
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(response);
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
  return handleResponse<Task>(response);
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse<{ success: boolean }>(response);
}
