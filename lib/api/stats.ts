import { Priority } from '@prisma/client';
import { handleResponse } from '@/lib/api/utils';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  byPriority: {
    [Priority.URGENT]: number;
    [Priority.HIGH]: number;
    [Priority.MEDIUM]: number;
    [Priority.LOW]: number;
  };
}

export const fetchTaskStats = async (): Promise<TaskStats> => {
  const response = await fetch('/api/tasks/stats');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch task statistics');
  }
  return handleResponse(response);
};
