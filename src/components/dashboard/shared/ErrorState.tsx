import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12 dark:border-red-900 dark:bg-red-950">
      <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
      <h3 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-100">{title}</h3>
      <p className="mt-2 text-sm text-red-700 dark:text-red-200">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  );
}
