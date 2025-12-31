'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
  DEFAULT_CURRENCY,
  DEFAULT_ROUNDING_UNIT,
  DEFAULT_SESSION_NAME,
  MAX_BIAS,
  MAX_EXPENSE_NAME_LENGTH,
  MAX_EXPENSES,
  MAX_GROUP_COUNT,
  MAX_GROUP_NAME_LENGTH,
  MAX_GROUPS,
  MAX_MEMBER_NAME_LENGTH,
  MAX_MEMBERS,
  MAX_SESSION_NAME_LENGTH,
  MAX_SESSIONS,
  MIN_BIAS,
  MIN_GROUP_COUNT,
} from '@/shared/constants'
import type {
  CurrencyCode,
  Expense,
  ExpenseId,
  GroupId,
  Member,
  MemberId,
  ParticipantGroup,
  RoundingUnit,
  Session,
  SessionId,
  Settings,
} from '@/shared/types'
import {
  DEFAULT_BIAS,
  DEFAULT_GROUP_COUNT,
  generateExpenseId,
  generateGroupId,
  generateMemberId,
  generateSessionId,
} from '@/shared/types'

export interface WarikanState {
  sessions: Session[]
  currentSessionId: SessionId | null
}

export interface SessionActions {
  createSession: (name?: string) => SessionId | undefined
  deleteSession: (id: SessionId) => void
  switchSession: (id: SessionId) => void
  renameSession: (id: SessionId, name: string) => void
  duplicateSession: (id: SessionId) => SessionId | undefined
}

export interface WarikanActions {
  addMember: (name: string) => void
  removeMember: (id: MemberId) => void
  updateMemberBias: (id: MemberId, bias: number) => void

  addGroup: (name: string) => void
  removeGroup: (id: GroupId) => void
  updateGroupCount: (id: GroupId, count: number) => void
  updateGroupBias: (id: GroupId, bias: number) => void
  updateGroupName: (id: GroupId, name: string) => void

  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
  removeExpense: (id: ExpenseId) => void
  updateExpense: (
    id: ExpenseId,
    updates: Partial<Omit<Expense, 'id' | 'createdAt'>>,
  ) => void

  setCurrency: (currency: CurrencyCode) => void
  setRoundingUnit: (unit: RoundingUnit) => void

  reset: () => void
}

export type WarikanStore = WarikanState & SessionActions & WarikanActions

const defaultSettings: Settings = {
  currency: DEFAULT_CURRENCY,
  roundingUnit: DEFAULT_ROUNDING_UNIT,
}

function createNewSession(name?: string): Session {
  return {
    id: generateSessionId(),
    name:
      name?.trim().slice(0, MAX_SESSION_NAME_LENGTH) || DEFAULT_SESSION_NAME,
    members: [],
    groups: [],
    expenses: [],
    settings: { ...defaultSettings },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

const initialSession = createNewSession('会計 1')

const initialState: WarikanState = {
  sessions: [initialSession],
  currentSessionId: initialSession.id,
}

export function getCurrentSession(state: WarikanState): Session | undefined {
  return state.sessions.find((s) => s.id === state.currentSessionId)
}

function updateCurrentSession(
  state: WarikanState,
  updater: (session: Session) => void,
): void {
  const session = getCurrentSession(state)
  if (session) {
    updater(session)
    session.updatedAt = Date.now()
  }
}

interface OldWarikanState {
  members?: Member[]
  groups?: ParticipantGroup[]
  expenses?: Expense[]
  settings?: Settings
}

export const useWarikanStore = create<WarikanStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        createSession: (name) => {
          if (get().sessions.length >= MAX_SESSIONS) return undefined
          const newSession = createNewSession(name)
          set((state) => {
            state.sessions.push(newSession)
            state.currentSessionId = newSession.id
          })
          return newSession.id
        },

        deleteSession: (id) =>
          set((state) => {
            if (state.sessions.length <= 1) return

            const index = state.sessions.findIndex((s) => s.id === id)
            if (index === -1) return

            state.sessions.splice(index, 1)

            if (state.currentSessionId === id) {
              const nearbySession =
                state.sessions[Math.min(index, state.sessions.length - 1)]
              state.currentSessionId = nearbySession?.id ?? null
            }
          }),

        switchSession: (id) =>
          set((state) => {
            const session = state.sessions.find((s) => s.id === id)
            if (session) {
              state.currentSessionId = id
            }
          }),

        renameSession: (id, name) =>
          set((state) => {
            const session = state.sessions.find((s) => s.id === id)
            if (session) {
              const sanitizedName = name
                .trim()
                .slice(0, MAX_SESSION_NAME_LENGTH)
              if (sanitizedName) {
                session.name = sanitizedName
                session.updatedAt = Date.now()
              }
            }
          }),

        duplicateSession: (id) => {
          const state = get()
          if (state.sessions.length >= MAX_SESSIONS) return undefined
          const sourceSession = state.sessions.find((s) => s.id === id)
          if (!sourceSession) return undefined

          const newSession: Session = {
            ...structuredClone(sourceSession),
            id: generateSessionId(),
            name: `${sourceSession.name} のコピー`.slice(
              0,
              MAX_SESSION_NAME_LENGTH,
            ),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }

          set((draft) => {
            draft.sessions.push(newSession)
            draft.currentSessionId = newSession.id
          })

          return newSession.id
        },

        addMember: (name) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              if (session.members.length >= MAX_MEMBERS) return

              const sanitizedName = name.trim().slice(0, MAX_MEMBER_NAME_LENGTH)
              if (!sanitizedName) return

              const isDuplicate = session.members.some(
                (m) => m.name.toLowerCase() === sanitizedName.toLowerCase(),
              )
              if (isDuplicate) return

              session.members.push({
                id: generateMemberId(),
                name: sanitizedName,
                bias: DEFAULT_BIAS,
              })
            })
          }),

        removeMember: (id) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              session.members = session.members.filter((m) => m.id !== id)

              for (const expense of session.expenses) {
                expense.participants = expense.participants.filter(
                  (p) => p !== id,
                )

                if (expense.paidBy === id) {
                  const firstMember = session.members[0]
                  if (firstMember) {
                    expense.paidBy = firstMember.id
                  }
                }
              }

              session.expenses = session.expenses.filter((e) => {
                const payer = session.members.find((m) => m.id === e.paidBy)
                return payer !== undefined
              })
            })
          }),

        updateMemberBias: (id, bias) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              const member = session.members.find((m) => m.id === id)
              if (member) {
                member.bias = Math.max(MIN_BIAS, Math.min(MAX_BIAS, bias))
              }
            })
          }),

        addGroup: (name) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              if (session.groups.length >= MAX_GROUPS) return

              const sanitizedName = name.trim().slice(0, MAX_GROUP_NAME_LENGTH)
              if (!sanitizedName) return

              session.groups.push({
                id: generateGroupId(),
                name: sanitizedName,
                count: DEFAULT_GROUP_COUNT,
                bias: DEFAULT_BIAS,
              })
            })
          }),

        removeGroup: (id) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              session.groups = session.groups.filter((g) => g.id !== id)
            })
          }),

        updateGroupCount: (id, count) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              const group = session.groups.find((g) => g.id === id)
              if (group) {
                group.count = Math.max(
                  MIN_GROUP_COUNT,
                  Math.min(MAX_GROUP_COUNT, count),
                )
              }
            })
          }),

        updateGroupBias: (id, bias) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              const group = session.groups.find((g) => g.id === id)
              if (group) {
                group.bias = Math.max(MIN_BIAS, Math.min(MAX_BIAS, bias))
              }
            })
          }),

        updateGroupName: (id, name) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              const group = session.groups.find((g) => g.id === id)
              if (group) {
                const sanitizedName = name
                  .trim()
                  .slice(0, MAX_GROUP_NAME_LENGTH)
                if (sanitizedName) {
                  group.name = sanitizedName
                }
              }
            })
          }),

        addExpense: (expense) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              if (session.expenses.length >= MAX_EXPENSES) return

              const sanitizedName = expense.name
                .trim()
                .slice(0, MAX_EXPENSE_NAME_LENGTH)

              session.expenses.push({
                ...expense,
                name: sanitizedName || '会計',
                id: generateExpenseId(),
                createdAt: Date.now(),
              })
            })
          }),

        removeExpense: (id) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              session.expenses = session.expenses.filter((e) => e.id !== id)
            })
          }),

        updateExpense: (id, updates) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              const expense = session.expenses.find((e) => e.id === id)
              if (expense) {
                Object.assign(expense, updates)
              }
            })
          }),

        setCurrency: (currency) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              session.settings.currency = currency
            })
          }),

        setRoundingUnit: (unit) =>
          set((state) => {
            updateCurrentSession(state, (session) => {
              session.settings.roundingUnit = unit
            })
          }),

        reset: () => set(initialState),
      })),
      {
        name: 'nakayoshi-warikan',
        version: 3,
        migrate: (persistedState, version) => {
          if (version < 3) {
            const oldState = persistedState as OldWarikanState
            const sessionId = generateSessionId()
            const now = Date.now()

            const migratedSession: Session = {
              id: sessionId,
              name: '会計 1',
              members: oldState.members ?? [],
              groups: oldState.groups ?? [],
              expenses: oldState.expenses ?? [],
              settings: oldState.settings ?? { ...defaultSettings },
              createdAt: now,
              updatedAt: now,
            }

            return {
              sessions: [migratedSession],
              currentSessionId: sessionId,
            } as WarikanState
          }
          return persistedState as WarikanState
        },
      },
    ),
    { name: 'WarikanStore' },
  ),
)
