'use client'

import { EllipsisVertical, Receipt, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSessionActions } from '@/entities/warikan'
import { cn, formatRelativeDate, useSidebar } from '@/shared/lib'
import type { Session } from '@/shared/types'
import { Button, Popover } from '@/shared/ui'

export interface SessionItemProps {
  session: Session
  isActive: boolean
  onSelect: () => void
}

function RelativeTime({ timestamp }: { timestamp: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <>{formatRelativeDate(timestamp)}</>
}

export function SessionItem({ session, isActive, onSelect }: SessionItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { deleteSession } = useSessionActions()
  const closeSidebar = useSidebar((s) => s.close)

  const handleSelect = () => {
    onSelect()
    closeSidebar()
  }

  const handleDelete = () => {
    deleteSession(session.id)
    setMenuOpen(false)
  }

  return (
    <li
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5',
        'hover:bg-surface-elevated transition-colors',
        isActive && 'bg-primary/10 text-primary',
      )}
    >
      <button
        type="button"
        onClick={handleSelect}
        className="absolute inset-0 rounded-lg"
        aria-label={`${session.name}を選択`}
      />
      <Receipt className="size-4 shrink-0 opacity-60" />
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {session.name}
        </span>
        <span className="block text-xs text-foreground-muted">
          <RelativeTime timestamp={session.updatedAt} />
        </span>
      </div>
      <Popover
        open={menuOpen}
        onOpenChange={setMenuOpen}
        align="end"
        trigger={
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
            className="relative z-10 size-7 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            <EllipsisVertical className="size-4" />
          </Button>
        }
      >
        <div className="min-w-[140px]">
          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 className="size-4" />
            削除
          </button>
        </div>
      </Popover>
    </li>
  )
}
