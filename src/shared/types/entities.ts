import type { ExpenseId, GroupId, MemberId } from './branded'

/** 割り勘に参加するメンバー */
export interface Member {
  id: MemberId
  name: string
  bias: number
}

export const DEFAULT_BIAS = 1.0

export const BIAS_PRESETS = {
  nonDrinker: { label: '飲まない人', value: 0.7 },
  organizer: { label: '幹事', value: 0.8 },
} as const

/** バイアスプリセットのキー */
export type BiasPreset = keyof typeof BIAS_PRESETS

/** 支出情報 */
export interface Expense {
  id: ExpenseId
  name: string
  amount: number
  paidBy: MemberId
  participants: MemberId[]
  createdAt: number
}

/** 精算（誰が誰にいくら払うか） */
export interface Settlement {
  from: MemberId
  to: MemberId
  amount: number
}

/** メンバーごとの収支 */
export interface Balance {
  memberId: MemberId
  amount: number
}

/** 参加者グループ（一括計算用） */
export interface ParticipantGroup {
  id: GroupId
  name: string
  count: number
  bias: number
}

export const DEFAULT_GROUP_COUNT = 1

/** グループ単位の精算結果 */
export interface GroupSettlement {
  groupId: GroupId
  groupName: string
  perPersonAmount: number
  totalAmount: number
}
