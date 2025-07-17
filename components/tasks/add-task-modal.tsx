'use client';

import { useUIStore } from '@/lib/stores/ui-store';
import { AddTaskForm } from '@/components/tasks/add-task-form/add-task-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function AddTaskModal() {
  const { isAddTaskModalOpen, closeAddTaskModal } = useUIStore();

  return (
    <Dialog open={isAddTaskModalOpen} onOpenChange={closeAddTaskModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new task to your list.
          </DialogDescription>
        </DialogHeader>
        <AddTaskForm onSuccess={closeAddTaskModal} />
      </DialogContent>
    </Dialog>
  );
}
