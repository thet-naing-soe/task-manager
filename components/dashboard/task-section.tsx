'use client';

import { useUIStore } from '@/lib/stores/ui-store';
import { TaskList } from '@/components/tasks/task-list';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function TaskSection() {
  const openAddTaskModal = useUIStore((state) => state.openAddTaskModal);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>View and manage your tasks</CardDescription>
        </div>
        <div>
          <Button onClick={openAddTaskModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TaskList />
      </CardContent>
    </Card>
  );
}
