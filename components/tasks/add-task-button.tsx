import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/stores/ui-store';

export function AddTaskButton() {
  const openAddTaskModal = useUIStore((state) => state.openAddTaskModal);

  return (
    <Button onClick={openAddTaskModal}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Task
    </Button>
  );
}
