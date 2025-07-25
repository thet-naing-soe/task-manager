import { FileX2 } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
}

export function EmptyState({
  title = 'No Data Found',
  message,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-md border border-dashed p-12">
      <div className="mb-4 rounded-full bg-secondary p-3">
        <FileX2 className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm  text-muted-foreground mt-2">{message}</p>
    </div>
  );
}
