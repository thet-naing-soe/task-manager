import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-client';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bulkDeleteSchema = z.object({
  taskIds: z.array(z.string().cuid()).min(1),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = bulkDeleteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { taskIds } = validation.data;

    const result = await prisma.task.deleteMany({
      where: {
        id: {
          in: taskIds,
        },
        userId: user.id,
      },
    });
    return NextResponse.json({ success: true, deletedCount: result.count });
  } catch (error) {
    NextResponse.json({ error: 'Failed to delete tasks' }, { status: 500 });
  }
}
