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
  MAX_MEMBER_NAME_LENGTH,
  MAX_MEMBERS,
  MIN_BIAS,
} from '@/shared/constants'
import type {
  CurrencyCode,
  Expense,
  ExpenseId,
  Member,
  MemberId,
  RoundingUnit,
  Settings,
} from '@/shared/types'
import {
  DEFAULT_BIAS,
  generateExpenseId,
  generateMemberId,
} from '@/shared/types'

export interface WarikanState {
  members: Member[]
  expenses: Expense[]
  settings: Settings
}

export interface WarikanActions {
  addMember: (name: string) => void
  removeMember: (id: MemberId) => void
  updateMemberBias: (id: MemberId, bias: number) => void

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
        version: 1,
      },
    ),
    { name: 'WarikanStore' },
  ),
)
