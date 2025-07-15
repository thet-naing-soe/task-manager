import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: Error;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || 'Something went wrong'}
      </AlertDescription>
      <p className="mt-2">Please try again later.</p>
      <p className="mt-2">If the problem persists, contact support.</p>
    </Alert>
  );
}
