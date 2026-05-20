import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 gap-3">
      {icon && <div className="text-ink-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-ink-100">{title}</h3>
      {description && (
        <p className="text-sm text-ink-300 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
