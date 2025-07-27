import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SelectionStoreState {
  // State
  selectedTaskIds: Set<string>;

  // Actions
  toggleTaskId: (id: string) => void;
  setSelectedTaskIds: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionStoreState>()(
  devtools(
    (set) => ({
      // --- Initial State ---
      selectedTaskIds: new Set(),

      // --- Actions ---
      toggleTaskId: (id) =>
        set((state) => {
          const newSelectedTaskIds = new Set(state.selectedTaskIds);
          if (newSelectedTaskIds.has(id)) {
            newSelectedTaskIds.delete(id);
          } else {
            newSelectedTaskIds.add(id);
          }
          return { selectedTaskIds: newSelectedTaskIds };
        }),
      setSelectedTaskIds: (ids) =>
        set({ selectedTaskIds: new Set(ids) }),
      clearSelection: () =>
        set({ selectedTaskIds: new Set() }),
    }),
    { name: 'SelectionStore' }
  )
);