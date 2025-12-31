'use client'

import { Slot } from '@radix-ui/react-slot'
import {
  type ComponentProps,
  type ReactElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { cn } from '@/shared/lib'

export interface PopoverProps {
  trigger: ReactElement
  children: React.ReactNode
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
  const popoverId = useId()

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value)
      }
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange],
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
      <Slot
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? popoverId : undefined}
      >
        {trigger}
      </Slot>
      {open && (
        <div
          id={popoverId}
          role="dialog"
          className={cn(
            'absolute top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-surface p-4 shadow-lg',
            alignmentStyles[align],
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function PopoverHeader({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mb-3 border-b border-border pb-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function PopoverTitle({
  children,
  className,
  ...props
}: ComponentProps<'h4'>) {
  return (
    <h4 className={cn('font-semibold text-foreground', className)} {...props}>
      {children}
    </h4>
  )
}
