'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

export interface SliderProps
  extends Omit<ComponentProps<'input'>, 'type' | 'onChange'> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  showValue?: boolean
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue,
  className,
  ...props
}: SliderProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
        {...props}
      />
      {showValue && (
        <span className="min-w-12 text-right text-sm font-medium text-foreground">
          {value}
        </span>
      )}
    </div>
  )
}
