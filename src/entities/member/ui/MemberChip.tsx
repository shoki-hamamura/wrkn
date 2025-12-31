'use client'

import { X } from 'lucide-react'
import { cn, transitionStyles } from '@/shared/lib'
import { Badge } from '@/shared/ui'
import type { Member } from '../model/types'

export interface MemberChipProps {
  member: Member
  onClick?: () => void
  onRemove?: () => void
  showBias?: boolean
  className?: string
}

export function MemberChip({
  member,
  onClick,
  onRemove,
  showBias = true,
  className,
}: MemberChipProps) {
  const hasBias = member.bias !== 1.0

  const handleKeyDown = onClick
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }
    : undefined

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border bg-surface py-1 pr-1 pl-3',
        onClick &&
          cn(transitionStyles, 'cursor-pointer hover:bg-surface-elevated'),
        className,
      )}
      {...(onClick && {
        onClick,
        onKeyDown: handleKeyDown,
        role: 'button',
        tabIndex: 0,
      })}
    >
      <span className="text-sm font-medium text-foreground">{member.name}</span>

      {showBias && hasBias && (
        <Badge variant="default" className="ml-1">
          {member.bias}x
        </Badge>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            'ml-1 flex size-5 items-center justify-center rounded-full text-foreground-subtle hover:bg-border hover:text-foreground-muted',
            transitionStyles,
          )}
          aria-label={`${member.name}を削除`}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
