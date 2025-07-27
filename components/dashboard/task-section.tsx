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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

export function TaskSection() {
  const openAddTaskModal = useUIStore((state) => state.openAddTaskModal);
  const handleExport = (type: 'csv' | 'pdf') => {
    window.location.href = `/api/tasks/export?type=${type}`;
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>View and manage your tasks</CardDescription>
        </div>
        <div className="flex flex-col space-y-2 w-full items-center md:flex-row md:items-center md:space-y-0 md:space-x-2 md:w-auto">
          <Button onClick={openAddTaskModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <TaskList />
      </CardContent>
    </Card>
  );
}
