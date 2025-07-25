import { useQuery } from '@tanstack/react-query';
import { fetchTaskStats, TaskStats } from '@/lib/api/stats';
import { STATS_QUERY_KEY } from '@/lib/constants/stats';

export const useStats = () => {
  return useQuery<TaskStats, Error>({
    queryKey: STATS_QUERY_KEY.all,
    queryFn: fetchTaskStats,
    staleTime: 5 * 60 * 1000,
  });
};
