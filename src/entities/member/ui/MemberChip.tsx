'use client'

import { cn } from '@/shared/lib'
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

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white py-1 pr-1 pl-3 dark:border-neutral-700 dark:bg-neutral-800',
        onClick && 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700',
        className
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {member.name}
      </span>

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
          className="ml-1 flex size-5 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-600 dark:hover:text-neutral-300"
          aria-label={`${member.name}を削除`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      )}
    </div>
  )
}
