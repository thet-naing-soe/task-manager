import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-client';
import { TaskItem } from './task-item';
import { ScrollArea } from '@/components/ui/scroll-area';

export async function TaskList() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No tasks yet. Create your first task!
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </ScrollArea>
  );
}
