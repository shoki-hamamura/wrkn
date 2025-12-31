'use client'

import { useCallback, useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/shared/lib'

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  align?: 'start' | 'center' | 'end'
}

export function Popover({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  align = 'center',
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value)
      }
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, setOpen])

  const alignmentStyles: Record<typeof align, string> = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute top-full z-50 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-800',
            alignmentStyles[align]
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function PopoverHeader({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mb-3 border-b border-neutral-200 pb-2 dark:border-neutral-700', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function PopoverTitle({ children, className, ...props }: ComponentProps<'h4'>) {
  return (
    <h4
      className={cn('font-semibold text-neutral-900 dark:text-neutral-100', className)}
      {...props}
    >
      {children}
    </h4>
  )
}
