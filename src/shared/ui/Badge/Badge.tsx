import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

export type BadgeVariant = 'default' | 'secondary' | 'outline'

export interface BadgeProps extends ComponentProps<'span'> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  secondary:
    'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
  outline:
    'border border-neutral-300 text-neutral-800 dark:border-neutral-700 dark:text-neutral-200',
}

export function Badge({
  children,
  variant = 'default',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
