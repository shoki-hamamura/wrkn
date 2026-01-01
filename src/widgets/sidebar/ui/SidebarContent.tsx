import Link from 'next/link'
import { CreateSessionButton } from '@/features/session-management'
import { AppLogo } from '@/shared/ui'
import { SessionList } from './SessionList'

export function SidebarContent() {
  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-16 shrink-0 items-center px-4">
        <Link href="/">
          <AppLogo size="sm" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <SessionList />
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <CreateSessionButton />
      </div>
    </div>
  )
}
