import { Priority } from '@prisma/client';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';

type StatusFilter = 'all' | 'completed' | 'pending';
type SortOption = 'createAt' | 'dueDate' | 'priority';

interface FilterStoreState {
  // State
  searchQuery: string;
  status: StatusFilter;
  priority: Priority | 'all';
  sortBy: SortOption;

  // Actions
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
  sortBy: 'createAt' as SortOption,
};

export const useFilterStore = create<FilterStoreState>()(
  devtools(
    (set) => ({
      ...initialState,
      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, 'SET_SEARCH_QUERY'),
      setStatus: (status) => set({ status: status }, false, 'SET_STATUS'),
      setPriority: (priority) =>
        set({ priority: priority }, false, 'SET_PRIORITY'),
      setSortBy: (option) => set({ sortBy: option }, false, 'SET_SORT_BY'),
      resetFilters: () => set(initialState, false, 'RESET_FILTERS'),
    }),
    { name: 'FilterStore' }
  )
);
