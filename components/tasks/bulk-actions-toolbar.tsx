'use client';

import { useSelectionStore } from '@/lib/stores/selection-store';
import { useBulkDeleteTasks } from '@/hooks/use-tasks';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function BulkActionsToolbar() {
  const { selectedTaskIds, clearSelection } = useSelectionStore();
  const { mutate: deleteTasks, isPending } = useBulkDeleteTasks();
  const selectedCount = selectedTaskIds.size;

  if (selectedCount === 0) {
    return null;
  }

  const handleDeleteSelected = () => {
    const idsToDelete = Array.from(selectedTaskIds);
    deleteTasks(idsToDelete, {
      onSuccess: () => {
        clearSelection();
      },
    });
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-auto bg-background border rounded-lg shadow-lg p-2 z-50 flex items-center space-x-4">
      <p className="text-small font-medium px-2">
        {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isPending}>
            {isPending ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected {selectedCount} task
              {selectedCount > 1 ? 's' : ''}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteSelected}
              disabled={isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button variant="ghost" size="icon" onClick={clearSelection}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
