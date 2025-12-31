import type { ExpenseId, MemberId } from './branded'

export interface Member {
  id: MemberId
  name: string
  bias: number
}

export const DEFAULT_BIAS = 1.0

export const BIAS_PRESETS = {
  drinker: { label: '飲む人', value: 1.5 },
  nonDrinker: { label: '飲まない人', value: 0.7 },
  organizer: { label: '幹事', value: 0.8 },
} as const

export type BiasPreset = keyof typeof BIAS_PRESETS

export interface Expense {
  id: ExpenseId
  name: string
  amount: number
  paidBy: MemberId
  participants: MemberId[]
  createdAt: number
}

export interface Settlement {
  from: MemberId
  to: MemberId
  amount: number
}

export interface Balance {
  memberId: MemberId
  amount: number
}
