'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

export interface RadioOption<T extends string> {
  value: T
  label: string
}

export interface RadioGroupProps<T extends string> extends Omit<ComponentProps<'div'>, 'onChange'> {
  name: string
  value: T
  options: RadioOption<T>[]
  onChange: (value: T) => void
  disabled?: boolean
}

export function RadioGroup<T extends string>({
  name,
  value,
  options,
  onChange,
  disabled,
  className,
  ...props
}: RadioGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn('flex flex-wrap gap-3', className)}
      {...props}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
            className="size-4 cursor-pointer border-neutral-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed dark:border-neutral-600 dark:bg-neutral-800"
          />
          <span className="text-sm text-neutral-900 dark:text-neutral-100">{option.label}</span>
        </label>
      ))}
    </div>
  )
}
