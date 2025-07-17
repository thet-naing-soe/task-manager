'use client';

import { useFilterStore } from '@/lib/stores/filter-store';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRIORITY_OPTIONS, SORT_OPTIONS } from '@/lib/constants/tasks';

export function TaskFilters() {
  const {
    searchQuery,
    status,
    priority,
    sortBy,
    setSearchQuery,
    setStatus,
    setPriority,
    setSortBy,
  } = useFilterStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 border rounded-lg">
      {/* Search Input */}
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow"
      />

      {/* Status Filter */}
      <Select value={status} onValueChange={(value) => setStatus(value as any)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select
        value={priority}
        onValueChange={(value) => setPriority(value as any)}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {PRIORITY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort by Date */}
      <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
