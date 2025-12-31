import type { LucideIcon } from 'lucide-react'
import { cn, focusRingStyles, transitionStyles } from '@/shared/lib'

export interface SegmentedControlOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

export interface SegmentedControlProps<T extends string> {
  value: T
  options: SegmentedControlOption<T>[]
  onChange: (value: T) => void
  name?: string
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  name,
}: SegmentedControlProps<T>) {
  return (
    <fieldset
      className="inline-flex rounded-full border-none bg-neutral-50 p-1 dark:bg-neutral-800"
      aria-label={name}
    >
      {options.map((option) => {
        const isSelected = option.value === value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium',
              transitionStyles,
              focusRingStyles,
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground-muted hover:text-foreground',
            )}
          >
            {Icon && <Icon className="size-4" />}
            {option.label}
          </button>
        )
      })}
    </fieldset>
  )
}
