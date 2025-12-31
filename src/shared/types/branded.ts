export type MemberId = string & { readonly __brand: 'MemberId' }
export type ExpenseId = string & { readonly __brand: 'ExpenseId' }

export function createMemberId(id: string): MemberId {
  return id as MemberId
}

export function createExpenseId(id: string): ExpenseId {
  return id as ExpenseId
}

export function generateMemberId(): MemberId {
  return crypto.randomUUID() as MemberId
}

export function generateExpenseId(): ExpenseId {
  return crypto.randomUUID() as ExpenseId
}
