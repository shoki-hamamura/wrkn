'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'onChange'> {
  label?: string
  onChange?: (checked: boolean) => void
}

export function Checkbox({ label, checked, onChange, className, id, ...props }: CheckboxProps) {
  const inputId = id ?? (label ? `checkbox-${label.replace(/\s+/g, '-')}` : undefined)

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2',
        props.disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="size-4 cursor-pointer rounded border-neutral-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed dark:border-neutral-600 dark:bg-neutral-800"
        {...props}
      />
      {label && (
        <span className="text-sm text-neutral-900 dark:text-neutral-100">{label}</span>
      )}
    </label>
  )
}
