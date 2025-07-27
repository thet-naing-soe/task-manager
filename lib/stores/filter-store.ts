import { Priority } from '@prisma/client';
import { devtools } from 'zustand/middleware';
import { create, StateCreator } from 'zustand';
import React from 'react';

type StatusFilter = 'all' | 'completed' | 'pending';
type SortOption = 'createdAt' | 'dueDate' | 'priority';

interface FilterStoreState {
  searchQuery: string;
  status: StatusFilter;
  priority: Priority | 'all';
  sortBy: SortOption;
  setSearchQuery: (query: string) => void;
  setStatus: (status: StatusFilter) => void;
  setPriority: (priority: Priority | 'all') => void;
  setSortBy: (option: SortOption) => void;
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  status: 'all' as StatusFilter,
  priority: 'all' as Priority | 'all',
  sortBy: 'createdAt' as SortOption,
};

const filterStoreInitializer: StateCreator<FilterStoreState> = (set) => ({
  ...initialState,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatus: (status) => set({ status: status }),
  setPriority: (priority) => set({ priority: priority }),
  setSortBy: (option) => set({ sortBy: option }),
  resetFilters: () => set(initialState),
});

export const useFilterStore = create(
  devtools(filterStoreInitializer, { name: 'FilterStore' })
);

// Filter values for new custom hook
export const useFilterValues = () => {
  const searchQuery = useFilterStore((state) => state.searchQuery);
  const status = useFilterStore((state) => state.status);
  const priority = useFilterStore((state) => state.priority);
  const sortBy = useFilterStore((state) => state.sortBy);

  return React.useMemo(
    () => ({ searchQuery, status, priority, sortBy }),
    [searchQuery, status, priority, sortBy]
  );
};
