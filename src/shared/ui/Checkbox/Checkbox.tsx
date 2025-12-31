'use client'

import type { ComponentProps } from 'react'
import { cn, focusRingStyles } from '@/shared/lib'

export interface CheckboxProps
  extends Omit<ComponentProps<'input'>, 'type' | 'onChange'> {
  label?: string
  onChange?: (checked: boolean) => void
}

export function Checkbox({
  label,
  checked,
  onChange,
  className,
  id,
  ...props
}: CheckboxProps) {
  const inputId =
    id ?? (label ? `checkbox-${label.replace(/\s+/g, '-')}` : undefined)

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2',
        props.disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className={cn(
          'size-4 cursor-pointer rounded border-border text-primary accent-primary',
          focusRingStyles,
          'disabled:cursor-not-allowed',
        )}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}
