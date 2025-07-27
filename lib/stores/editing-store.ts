import { devtools } from 'zustand/middleware';
import { create } from 'zustand';

interface EditingStoreState {
  // State
  editingTaskId: string | null;

  // Actions
  setEditingTaskId: (taskId: string) => void;
  clearEditingTaskId: () => void;
}

export const useEditingStore = create<EditingStoreState>()(
  devtools(
    (set) => ({
      // --- Initial State ---
      editingTaskId: null,

      // --- Actions ---
      setEditingTaskId: (taskId) =>
        set({ editingTaskId: taskId }),

      clearEditingTaskId: () =>
        set({ editingTaskId: null }),
    }),
    { name: 'EditingStore' }
  )
);