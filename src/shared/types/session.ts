import type { SessionId } from './branded'
import type { Expense, Member, ParticipantGroup } from './entities'
import type { Settings } from './settings'

/** 会計セッション */
export interface Session {
  id: SessionId
  name: string
  members: Member[]
  groups: ParticipantGroup[]
  expenses: Expense[]
  settings: Settings
  createdAt: number
  updatedAt: number
}

export const DEFAULT_SESSION_NAME = '新しい会計'
export const MAX_SESSION_NAME_LENGTH = 50
export const MAX_SESSIONS = 100
