import type { ComponentProps } from 'react'
import { cn, transitionStyles } from '@/shared/lib'

export interface CardProps extends ComponentProps<'div'> {
  asButton?: boolean
}

export function Card({
  children,
  className,
  asButton,
  onClick,
  ...props
}: CardProps) {
  const baseStyles = cn(
    'rounded-2xl border border-border bg-surface p-4',
    asButton &&
      cn(
        transitionStyles,
        'cursor-pointer hover:bg-surface-elevated active:brightness-95',
      ),
    className,
  )

  if (asButton) {
    return (
      <button
        type="button"
        className={cn(baseStyles, 'w-full text-left')}
        onClick={onClick as ComponentProps<'button'>['onClick']}
        {...(props as ComponentProps<'button'>)}
      >
        {children}
      </button>
    )
  }

  return (
    <div className={baseStyles} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cn('mb-2', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className,
  ...props
}: ComponentProps<'h3'>) {
  return (
    <h3 className={cn('font-semibold text-foreground', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cn('text-sm text-foreground-muted', className)} {...props}>
      {children}
    </div>
  )
}
