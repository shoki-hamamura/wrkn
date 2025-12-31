'use client'

import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui'

export interface CalculatorKeypadProps {
  onKeyPress: (key: string) => void
  className?: string
}

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['0', '00', '⌫'],
] as const

export function CalculatorKeypad({
  onKeyPress,
  className,
}: CalculatorKeypadProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {KEYS.flat().map((key) => (
        <Button
          key={key}
          variant="secondary"
          size="lg"
          onClick={() => onKeyPress(key)}
          className="h-14 text-xl font-medium active:scale-95"
          aria-label={key === '⌫' ? '削除' : key}
        >
          {key}
        </Button>
      ))}
    </div>
  )
}
