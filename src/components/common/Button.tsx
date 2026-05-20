import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ember' | 'ghost' | 'disabled';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: ButtonProps) {
  const map: Record<Variant, string> = {
    primary: 'btn-primary',
    ember: 'btn-ember',
    ghost: 'btn-ghost',
    disabled: 'btn-disabled',
  };
  return (
    <button
      type="button"
      className={cn(map[variant], className)}
      disabled={variant === 'disabled' || rest.disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
