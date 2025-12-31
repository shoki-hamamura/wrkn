'use client'

import { Menu } from 'lucide-react'
import { cn, useSidebar } from '@/shared/lib'
import { AppLogo, Button } from '@/shared/ui'

export interface MobileHeaderProps {
  className?: string
}

export function MobileHeader({ className }: MobileHeaderProps) {
  const open = useSidebar((s) => s.open)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center justify-center px-4 pt-3',
        className,
      )}
    >
      <nav className="flex h-14 w-full max-w-md items-center justify-between rounded-2xl bg-surface px-2 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={open}
          className="size-10 p-0"
          aria-label="メニューを開く"
        >
          <Menu className="size-5" />
        </Button>
        <AppLogo size="sm" />
        <div className="size-10" />
      </nav>
    </header>
  )
}
