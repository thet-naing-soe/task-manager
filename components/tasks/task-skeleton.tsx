import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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

export function TaskDetailSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 full mt-2" />
        <Skeleton className="h-5 w-2/3 mt-1" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/5" />
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
    </Card>
  );
}
