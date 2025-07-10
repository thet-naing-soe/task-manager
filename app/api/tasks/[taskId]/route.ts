import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-client';
import { updateTaskSchema } from '@/lib/validations/task';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

interface RoutePrams {
  params: {
    taskId: string;
  };
}

export async function PATCH(request: Request, { params }: RoutePrams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: {
        id: params.taskId,
      },
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : undefined,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RoutePrams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({
      where: {
        id: params.taskId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
