import {
  Task as PrismaTask,
  User as PrismaUser,
  Priority,
} from '@prisma/client';

// Re-exporting Prisma types
export type Task = PrismaTask;
export type User = PrismaUser;
export type TaskPriority = Priority;
