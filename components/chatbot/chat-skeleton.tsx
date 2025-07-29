import { Skeleton } from '@/components/ui/skeleton';

export function ChatSkeleton() {
  return (
    <div className="flex items-start gap-3 p-2">
      {/* Avatar Skeleton */}
      <Skeleton className="h-8 w-8 rounded-full" />

      {/* Message Text Skeleton */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
