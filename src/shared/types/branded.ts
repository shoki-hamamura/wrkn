/** メンバーを一意に識別するID */
export type MemberId = string & { readonly __brand: 'MemberId' }
/** 支出を一意に識別するID */
export type ExpenseId = string & { readonly __brand: 'ExpenseId' }
/** グループを一意に識別するID */
export type GroupId = string & { readonly __brand: 'GroupId' }

/** 文字列から MemberId を生成 */
export function createMemberId(id: string): MemberId {
  return id as MemberId
}

/** 文字列から ExpenseId を生成 */
export function createExpenseId(id: string): ExpenseId {
  return id as ExpenseId
}

/** 文字列から GroupId を生成 */
export function createGroupId(id: string): GroupId {
  return id as GroupId
}

/** 新規 MemberId を自動生成 */
export function generateMemberId(): MemberId {
  return crypto.randomUUID() as MemberId
}

/** 新規 ExpenseId を自動生成 */
export function generateExpenseId(): ExpenseId {
  return crypto.randomUUID() as ExpenseId
}

/** 新規 GroupId を自動生成 */
export function generateGroupId(): GroupId {
  return crypto.randomUUID() as GroupId
}
