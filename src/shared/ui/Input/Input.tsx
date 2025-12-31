import type { ComponentProps } from 'react'
import {
  cn,
  disabledStyles,
  focusRingStyles,
  transitionStyles,
} from '@/shared/lib'

export interface InputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  error?: boolean
  onChange?: (value: string) => void
}

export function Input({ className, error, onChange, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-xl border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-foreground-subtle',
        transitionStyles,
        focusRingStyles,
        disabledStyles,
        'disabled:cursor-not-allowed',
        error && 'border-danger focus-visible:ring-danger',
        className,
      )}
      aria-invalid={error || undefined}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
  )
}
