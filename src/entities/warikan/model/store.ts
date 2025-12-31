'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
  DEFAULT_CURRENCY,
  DEFAULT_ROUNDING_UNIT,
  MAX_BIAS,
  MAX_EXPENSE_NAME_LENGTH,
  MAX_EXPENSES,
  MAX_GROUP_COUNT,
  MAX_GROUP_NAME_LENGTH,
  MAX_GROUPS,
  MAX_MEMBER_NAME_LENGTH,
  MAX_MEMBERS,
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
  Settings,
} from '@/shared/types'
import {
  DEFAULT_BIAS,
  DEFAULT_GROUP_COUNT,
  generateExpenseId,
  generateGroupId,
  generateMemberId,
} from '@/shared/types'

export interface WarikanState {
  members: Member[]
  groups: ParticipantGroup[]
  expenses: Expense[]
  settings: Settings
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

export type WarikanStore = WarikanState & WarikanActions

const initialState: WarikanState = {
  members: [],
  groups: [],
  expenses: [],
  settings: {
    currency: DEFAULT_CURRENCY,
    roundingUnit: DEFAULT_ROUNDING_UNIT,
  },
}

export const useWarikanStore = create<WarikanStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        addMember: (name) =>
          set((state) => {
            if (state.members.length >= MAX_MEMBERS) return

            const sanitizedName = name.trim().slice(0, MAX_MEMBER_NAME_LENGTH)
            if (!sanitizedName) return

            const isDuplicate = state.members.some(
              (m) => m.name.toLowerCase() === sanitizedName.toLowerCase(),
            )
            if (isDuplicate) return

            state.members.push({
              id: generateMemberId(),
              name: sanitizedName,
              bias: DEFAULT_BIAS,
            })
          }),

        removeMember: (id) =>
          set((state) => {
            state.members = state.members.filter((m) => m.id !== id)

            for (const expense of state.expenses) {
              expense.participants = expense.participants.filter(
                (p) => p !== id,
              )

              if (expense.paidBy === id) {
                const firstMember = state.members[0]
                if (firstMember) {
                  expense.paidBy = firstMember.id
                }
              }
            }

            state.expenses = state.expenses.filter((e) => {
              const payer = state.members.find((m) => m.id === e.paidBy)
              return payer !== undefined
            })
          }),

        updateMemberBias: (id, bias) =>
          set((state) => {
            const member = state.members.find((m) => m.id === id)
            if (member) {
              member.bias = Math.max(MIN_BIAS, Math.min(MAX_BIAS, bias))
            }
          }),

        addGroup: (name) =>
          set((state) => {
            if (state.groups.length >= MAX_GROUPS) return

            const sanitizedName = name.trim().slice(0, MAX_GROUP_NAME_LENGTH)
            if (!sanitizedName) return

            state.groups.push({
              id: generateGroupId(),
              name: sanitizedName,
              count: DEFAULT_GROUP_COUNT,
              bias: DEFAULT_BIAS,
            })
          }),

        removeGroup: (id) =>
          set((state) => {
            state.groups = state.groups.filter((g) => g.id !== id)
          }),

        updateGroupCount: (id, count) =>
          set((state) => {
            const group = state.groups.find((g) => g.id === id)
            if (group) {
              group.count = Math.max(
                MIN_GROUP_COUNT,
                Math.min(MAX_GROUP_COUNT, count),
              )
            }
          }),

        updateGroupBias: (id, bias) =>
          set((state) => {
            const group = state.groups.find((g) => g.id === id)
            if (group) {
              group.bias = Math.max(MIN_BIAS, Math.min(MAX_BIAS, bias))
            }
          }),

        updateGroupName: (id, name) =>
          set((state) => {
            const group = state.groups.find((g) => g.id === id)
            if (group) {
              const sanitizedName = name.trim().slice(0, MAX_GROUP_NAME_LENGTH)
              if (sanitizedName) {
                group.name = sanitizedName
              }
            }
          }),

        addExpense: (expense) =>
          set((state) => {
            if (state.expenses.length >= MAX_EXPENSES) return

            const sanitizedName = expense.name
              .trim()
              .slice(0, MAX_EXPENSE_NAME_LENGTH)

            state.expenses.push({
              ...expense,
              name: sanitizedName || '会計',
              id: generateExpenseId(),
              createdAt: Date.now(),
            })
          }),

        removeExpense: (id) =>
          set((state) => {
            state.expenses = state.expenses.filter((e) => e.id !== id)
          }),

        updateExpense: (id, updates) =>
          set((state) => {
            const expense = state.expenses.find((e) => e.id === id)
            if (expense) {
              Object.assign(expense, updates)
            }
          }),

        setCurrency: (currency) =>
          set((state) => {
            state.settings.currency = currency
          }),

        setRoundingUnit: (unit) =>
          set((state) => {
            state.settings.roundingUnit = unit
          }),

        reset: () => set(initialState),
      })),
      {
        name: 'nakayoshi-warikan',
        version: 2,
        migrate: (persistedState, version) => {
          const state = persistedState as WarikanState
          if (version < 2) {
            return { ...state, groups: [] }
          }
          return state
        },
      },
    ),
    { name: 'WarikanStore' },
  ),
)
