'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

export interface SwitchProps extends ComponentProps<typeof SwitchPrimitive.Root> {
  label?: string
}

export function Switch({ className, label, id, ...props }: SwitchProps) {
  const switchId = id ?? (label ? `switch-${label.replace(/\s+/g, '-')}` : undefined)

  const switchElement = (
    <SwitchPrimitive.Root
      id={switchId}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-neutral-200',
        'dark:data-[state=checked]:bg-emerald-500 dark:data-[state=unchecked]:bg-neutral-700',
        'dark:focus-visible:ring-offset-neutral-900',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
          'dark:bg-neutral-100'
        )}
      />
    </SwitchPrimitive.Root>
  )

  if (label) {
    return (
      <label
        htmlFor={switchId}
        className={cn(
          'inline-flex cursor-pointer items-center gap-2',
          props.disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        {switchElement}
        <span className="text-sm text-neutral-900 dark:text-neutral-100">{label}</span>
      </label>
    )
  }

  return switchElement
}
