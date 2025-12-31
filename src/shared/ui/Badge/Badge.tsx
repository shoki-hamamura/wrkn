import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

export type BadgeVariant = 'default' | 'secondary' | 'accent' | 'outline'

export interface BadgeProps extends ComponentProps<'span'> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary/15 text-primary',
  secondary: 'bg-surface-elevated text-foreground-muted',
  accent: 'bg-accent/15 text-accent',
  outline: 'border border-border text-foreground-muted',
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
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
