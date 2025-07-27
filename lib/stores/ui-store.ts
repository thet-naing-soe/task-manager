import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIStoreState {
  isAddTaskModalOpen: boolean;
  openAddTaskModal: () => void;
  closeAddTaskModal: () => void;
}

export const useUIStore = create<UIStoreState>()(
  devtools(
    (set) => ({
      isAddTaskModalOpen: false,
      openAddTaskModal: () =>
        set({ isAddTaskModalOpen: true }),
      closeAddTaskModal: () =>
        set({ isAddTaskModalOpen: false }),
    }),
    { name: 'UIStore' }
  )
);