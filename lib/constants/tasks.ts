import { Priority } from '@prisma/client';

// Priority enum value
export const PRIORITY_OPTIONS = [
  { value: Priority.LOW, label: 'low' },
  { value: Priority.MEDIUM, label: 'medium' },
  { value: Priority.HIGH, label: 'high' },
  { value: Priority.URGENT, label: 'urgent' },
] as const;

export const PRIORITY_STYLES = {
  [Priority.LOW]:
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  [Priority.MEDIUM]:
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  [Priority.HIGH]:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  [Priority.URGENT]:
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
} as const;

export const QUERY_KEYS = {
  tasks: {
    all: ['tasks'],
  },
} as const;

export const DEFAULT_TASK_VALUES = {
  title: '',
  description: '',
  priority: Priority.MEDIUM,
  dueDate: '',
} as const;
