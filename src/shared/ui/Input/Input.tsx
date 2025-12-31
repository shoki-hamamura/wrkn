import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

export interface InputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  error?: boolean
  onChange?: (value: string) => void
}

export function Input({
  className,
  error,
  onChange,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
  )
}
