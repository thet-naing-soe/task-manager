import { Skeleton } from '@/components/ui/skeleton';

export function TaskSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ))}
    </div>
  );
}
