import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-client';
import { prisma } from '@/lib/prisma';
import { taskSchema } from '@/lib/validations/task';
import { Priority, Prisma } from '@prisma/client';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'completed', 'pending', or 'all'
    const priority = searchParams.get('priority'); // 'LOW', 'MEDIUM', 'HIGH', 'URGENT' or 'all'
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt'; // 'createdAt', 'dueDate', 'priority'

    const whereClause: Prisma.TaskWhereInput = {
      userId: user.id,
    };

    if (status && status !== 'all') {
      whereClause.completed = status === 'completed';
    }

    if (priority && priority !== 'all') {
      whereClause.priority = priority as Priority;
    }

    if (search) {
      whereClause.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const orderByClause: Prisma.TaskOrderByWithRelationInput = {};

    if (sortBy === 'priority') {
      orderByClause.createdAt = 'desc';
    } else if (sortBy === 'dueDate') {
      orderByClause.dueDate = 'asc';
    } else {
      orderByClause.createdAt = 'desc';
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: orderByClause,
    });

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
