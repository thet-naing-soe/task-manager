import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Task } from '@prisma/client';

interface TaskStoreState {
  // State
  tasks: Task[];

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updatedData: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}

export const useTaskStore = create<TaskStoreState>()(
  devtools(
    (set) => ({
      // --- Initial State ---
      tasks: [],

      // --- Actions ---
      setTasks: (newTasks) => {
        set({ tasks: newTasks }, false, 'SET_TASKS');
      },

      addTask: (newTask) => {
        set(
          (state) => ({
            tasks: [...state.tasks, newTask],
          }),
          false,
          'ADD_TASK'
        );
      },

      updateTask: (taskId, updatedData) => {
        set(
          (state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updatedData } : task
            ),
          }),
          false,
          'UPDATE_TASK'
        );
      },

      deleteTask: (taskId) => {
        set(
          (state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
          }),
          false,
          'DELETE_TASK'
        );
      },
    }),
    { name: 'TaskStore' } // DevTools
  )
);
