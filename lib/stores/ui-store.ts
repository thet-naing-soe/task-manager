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
        set({ isAddTaskModalOpen: true }, false, 'OPEN_ADD_TASK_MODAL'),
      closeAddTaskModal: () =>
        set({ isAddTaskModalOpen: false }, false, 'CLOSE_ADD_TASK_MODAL'),
    }),
    { name: 'UIStore' }
  )
);
