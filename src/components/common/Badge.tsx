import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps {
  variant?: 'default' | 'accent' | 'ember' | 'warning' | 'success' | 'danger';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const map: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'chip',
    accent: 'chip-accent',
    ember: 'chip-ember',
    warning: 'chip-warning',
    success:
      'chip border-emerald-700/50 bg-emerald-900/30 text-emerald-200',
    danger:
      'chip border-red-700/50 bg-red-900/30 text-red-200',
  };
  return <span className={cn(map[variant], className)}>{children}</span>;
}
