import { z } from 'zod';
import { Priority } from '@prisma/client';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  dueDate: z.string().optional(),
  completed: z.boolean().default(false),
});

export const createTaskSchema = taskSchema.omit({ completed: true });

export const updateTaskSchema = taskSchema.partial();

export type TaskFormData = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
