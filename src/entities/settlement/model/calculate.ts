import { ceilToUnit } from '@/shared/lib'
import type { MemberId, RoundingUnit } from '@/shared/types'
import type { Member } from '@/entities/member'
import type { Expense } from '@/entities/expense'
import type { Balance, Settlement } from './types'

export interface CalculateSettlementsInput {
  members: Member[]
  expenses: Expense[]
  roundingUnit: RoundingUnit
}

export function calculateSettlements({
  members,
  expenses,
  roundingUnit,
}: CalculateSettlementsInput): Settlement[] {
  if (members.length === 0 || expenses.length === 0) {
    return []
  }

  const shares = calculateShares(members, expenses)
  const paid = calculatePaidAmounts(members, expenses)
  const balances = calculateBalances(members, shares, paid)

  return minimizeTransactions(balances, roundingUnit)
}

function calculateShares(members: Member[], expenses: Expense[]): Map<MemberId, number> {
  const shares = new Map<MemberId, number>()

  for (const member of members) {
    shares.set(member.id, 0)
  }

  for (const expense of expenses) {
    const participants =
      expense.participants.length === 0
        ? members
        : members.filter((m) => expense.participants.includes(m.id))

    if (participants.length === 0) continue

    const totalBias = participants.reduce((sum, p) => sum + p.bias, 0)

    for (const participant of participants) {
      const share = (expense.amount * participant.bias) / totalBias
      const current = shares.get(participant.id) ?? 0
      shares.set(participant.id, current + share)
    }
  }

  return shares
}

function calculatePaidAmounts(members: Member[], expenses: Expense[]): Map<MemberId, number> {
  const paid = new Map<MemberId, number>()

  for (const member of members) {
    paid.set(member.id, 0)
  }

  for (const expense of expenses) {
    const current = paid.get(expense.paidBy) ?? 0
    paid.set(expense.paidBy, current + expense.amount)
  }

  return paid
}

function calculateBalances(
  members: Member[],
  shares: Map<MemberId, number>,
  paid: Map<MemberId, number>
): Balance[] {
  return members.map((member) => ({
    memberId: member.id,
    amount: (paid.get(member.id) ?? 0) - (shares.get(member.id) ?? 0),
  }))
}

function minimizeTransactions(balances: Balance[], roundingUnit: RoundingUnit): Settlement[] {
  const settlements: Settlement[] = []

  const creditors = balances
    .filter((b) => b.amount > 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.amount - a.amount)

  const debtors = balances
    .filter((b) => b.amount < 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => a.amount - b.amount)

  let creditorIndex = 0
  let debtorIndex = 0

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex]
    const debtor = debtors[debtorIndex]

    if (!creditor || !debtor) break

    const credit = creditor.amount
    const debt = -debtor.amount
    const amount = Math.min(credit, debt)

    if (amount > 0) {
      const roundedAmount = ceilToUnit(amount, roundingUnit)

      settlements.push({
        from: debtor.memberId,
        to: creditor.memberId,
        amount: roundedAmount,
      })
    }

    creditor.amount -= amount
    debtor.amount += amount

    if (creditor.amount <= 0.001) creditorIndex++
    if (debtor.amount >= -0.001) debtorIndex++
  }

  return settlements
}

export function calculateTotalAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}

export function calculateAverageAmount(expenses: Expense[], memberCount: number): number {
  if (memberCount === 0) return 0
  return calculateTotalAmount(expenses) / memberCount
}
