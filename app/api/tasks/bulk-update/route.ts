import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-client';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bulkUpdateSchema = z.object({
  taskIds: z.array(z.string().cuid()).min(1),
  completed: z.boolean(),
});

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = bulkUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { taskIds, completed } = validation.data;

    const result = await prisma.task.updateMany({
      where: {
        id: { in: taskIds },
        userId: user.id,
      },
      data: {
        completed: completed,
      },
    });

    return NextResponse.json({ success: true, updatedCount: result.count });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update tasks' },
      { status: 500 }
    );
  }
}
