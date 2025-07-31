import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-client';
import { prisma } from '@/lib/prisma';
import { Priority, Prisma, Task } from '@prisma/client';
import { z } from 'zod';
import { taskSchema } from '@/lib/validations/task';

export const dynamic = 'force-dynamic';

interface TaskFilters {
  status: string;
  priority: string;
  search: string;
  sortBy: string;
}

function parseTaskFilters(request: Request): TaskFilters {
  const { searchParams } = new URL(request.url);
  return {
    status: searchParams.get('status') || 'all',
    priority: searchParams.get('priority') || 'all',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
  };
}

function buildWhereClause(
  userId: string,
  filters: TaskFilters
): Prisma.TaskWhereInput {
  const whereClause: Prisma.TaskWhereInput = { userId };

  if (filters.status !== 'all') {
    whereClause.completed = filters.status === 'completed';
  }

  if (
    filters.priority !== 'all' &&
    Object.values(Priority).includes(filters.priority as Priority)
  ) {
    whereClause.priority = filters.priority as Priority;
  }

  if (filters.search) {
    whereClause.title = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  return whereClause;
}

function sortTasks(tasks: Task[], sortBy: string): Task[] {
  if (sortBy === 'priority') {
    const priorityOrder: Record<Priority, number> = {
      [Priority.URGENT]: 4,
      [Priority.HIGH]: 3,
      [Priority.MEDIUM]: 2,
      [Priority.LOW]: 1,
    };

    tasks.sort((a, b) => {
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];

      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  return tasks;
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const filters = parseTaskFilters(request);
    const whereClause = buildWhereClause(user.id, filters);

    const orderByClause =
      filters.sortBy === 'dueDate'
        ? { dueDate: 'asc' as const }
        : { createdAt: 'desc' as const };

    let tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: filters.sortBy !== 'priority' ? orderByClause : undefined,
    });

    tasks = sortTasks(tasks, filters.sortBy);

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = taskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        userId: user.id,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : undefined,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
