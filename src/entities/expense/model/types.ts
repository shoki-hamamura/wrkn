import type { ExpenseId, MemberId } from '@/shared/types'

export interface Expense {
  id: ExpenseId
  name: string
  amount: number
  paidBy: MemberId
  participants: MemberId[]
  createdAt: number
}
