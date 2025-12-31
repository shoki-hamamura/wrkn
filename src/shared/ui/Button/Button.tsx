import type { ComponentProps } from 'react'
import {
  cn,
  disabledStyles,
  focusRingStyles,
  transitionStyles,
} from '@/shared/lib'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover active:brightness-90',
  secondary:
    'bg-surface text-foreground border border-border hover:bg-surface-elevated active:brightness-95',
  ghost:
    'bg-transparent text-foreground hover:bg-surface-elevated active:brightness-95',
  danger: 'bg-danger text-white hover:bg-danger-hover active:brightness-90',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-surface-elevated active:brightness-95',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-13 px-6 text-lg',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium',
        transitionStyles,
        focusRingStyles,
        disabledStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
