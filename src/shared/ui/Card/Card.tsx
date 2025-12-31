import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

export interface CardProps extends ComponentProps<'div'> {
  asButton?: boolean
}

export function Card({ children, className, asButton, onClick, ...props }: CardProps) {
  const baseStyles = cn(
    'rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900',
    asButton &&
      'cursor-pointer transition-colors hover:bg-neutral-50 active:bg-neutral-100 dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
    className
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

export function CardHeader({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('mb-2', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      className={cn('font-semibold text-neutral-900 dark:text-neutral-100', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('text-sm text-neutral-600 dark:text-neutral-400', className)} {...props}>
      {children}
    </div>
  )
}
