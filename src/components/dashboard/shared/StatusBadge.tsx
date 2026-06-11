import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  color: string;
  label: string;
  variant?: 'default' | 'outline';
}

export function StatusBadge({ color, label, variant = 'default' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'outline' ? `border ${color}` : color
      )}
    >
      {label}
    </span>
  );
}
