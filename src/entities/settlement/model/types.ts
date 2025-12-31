import type { MemberId } from '@/shared/types'

export interface Settlement {
  from: MemberId
  to: MemberId
  amount: number
}

export interface Balance {
  memberId: MemberId
  amount: number
}
