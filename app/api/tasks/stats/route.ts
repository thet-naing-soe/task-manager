import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-client';
import { prisma } from '@/lib/prisma';
import { Priority } from '@prisma/client';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const totalTasksPromise = prisma.task.count({
      where: { userId },
    });
    const completedTasksPromise = prisma.task.count({
      where: { userId, completed: true },
    });
    const priorityCountsPromise = prisma.task.groupBy({
      by: ['priority'],
      where: { userId },
      _count: {
        priority: true,
      },
    });

    const [totalTasks, completedTasks, priorityGroups] = await Promise.all([
      totalTasksPromise,
      completedTasksPromise,
      priorityCountsPromise,
    ]);

    const priorityCounts = {
      [Priority.URGENT]: 0,
      [Priority.HIGH]: 0,
      [Priority.MEDIUM]: 0,
      [Priority.LOW]: 0,
    };

    priorityGroups.forEach((group) => {
      priorityCounts[group.priority] = group._count.priority;
    });

    const stats = {
      total: totalTasks,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
      byPriority: priorityCounts,
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch task statistics' },
      { status: 500 }
    );
  }
}
