'use client'

import { useMemo } from 'react'
import {
  useCurrentSessionId,
  useSessionActions,
  useSessions,
} from '@/entities/warikan'
import { SessionItem } from '@/features/session-management'

export function SessionList() {
  const sessions = useSessions()
  const currentSessionId = useCurrentSessionId()
  const { switchSession } = useSessionActions()

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => b.updatedAt - a.updatedAt),
    [sessions],
  )

  return (
    <ul className="space-y-1 px-2">
      {sortedSessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          isActive={session.id === currentSessionId}
          onSelect={() => switchSession(session.id)}
        />
      ))}
    </ul>
  )
}
