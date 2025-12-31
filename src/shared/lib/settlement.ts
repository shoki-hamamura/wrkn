import type {
  Balance,
  Expense,
  GroupSettlement,
  Member,
  MemberId,
  ParticipantGroup,
  RoundingUnit,
  Settlement,
} from '@/shared/types'
import { ceilToUnit } from './rounding'

export interface CalculateSettlementsInput {
  members: Member[]
  groups: ParticipantGroup[]
  expenses: Expense[]
  roundingUnit: RoundingUnit
}

export interface CalculateSettlementsResult {
  settlements: Settlement[]
  groupSettlements: GroupSettlement[]
}

export function calculateSettlements({
  members,
  groups,
  expenses,
  roundingUnit,
}: CalculateSettlementsInput): CalculateSettlementsResult {
  if (members.length === 0 || expenses.length === 0) {
    return { settlements: [], groupSettlements: [] }
  }

  if (groups.length > 0) {
    return calculateWithGroups(members, groups, expenses, roundingUnit)
  }

  const shares = calculateShares(members, expenses)
  const paid = calculatePaidAmounts(members, expenses)
  const balances = calculateBalances(members, shares, paid)

  return {
    settlements: minimizeTransactions(balances, roundingUnit),
    groupSettlements: [],
  }
}

function calculateWithGroups(
  members: Member[],
  groups: ParticipantGroup[],
  expenses: Expense[],
  roundingUnit: RoundingUnit,
): CalculateSettlementsResult {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)

  const memberWeights = members.map((m) => ({
    type: 'member' as const,
    id: m.id,
    name: m.name,
    bias: m.bias,
    count: 1,
    weightedBias: m.bias,
  }))

  const groupWeights = groups.map((g) => ({
    type: 'group' as const,
    id: g.id,
    name: g.name,
    bias: g.bias,
    count: g.count,
    weightedBias: g.bias * g.count,
  }))

  const allWeights = [...memberWeights, ...groupWeights]
  const totalWeightedBias = allWeights.reduce(
    (sum, w) => sum + w.weightedBias,
    0,
  )

  if (totalWeightedBias === 0) {
    return { settlements: [], groupSettlements: [] }
  }

  const memberShares = new Map<MemberId, number>()
  for (const mw of memberWeights) {
    const share = (totalAmount * mw.weightedBias) / totalWeightedBias
    memberShares.set(mw.id, share)
  }

  const groupSettlements: GroupSettlement[] = groupWeights.map((gw) => {
    const totalShare = (totalAmount * gw.weightedBias) / totalWeightedBias
    const perPerson = totalShare / gw.count
    return {
      groupId: gw.id,
      groupName: gw.name,
      totalAmount: ceilToUnit(totalShare, roundingUnit),
      perPersonAmount: ceilToUnit(perPerson, roundingUnit),
    }
  })

  const paid = calculatePaidAmounts(members, expenses)
  const balances = members.map((member) => ({
    memberId: member.id,
    amount: (paid.get(member.id) ?? 0) - (memberShares.get(member.id) ?? 0),
  }))

  return {
    settlements: minimizeTransactions(balances, roundingUnit),
    groupSettlements,
  }
}

function calculateShares(
  members: Member[],
  expenses: Expense[],
): Map<MemberId, number> {
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

function calculatePaidAmounts(
  members: Member[],
  expenses: Expense[],
): Map<MemberId, number> {
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
  paid: Map<MemberId, number>,
): Balance[] {
  return members.map((member) => ({
    memberId: member.id,
    amount: (paid.get(member.id) ?? 0) - (shares.get(member.id) ?? 0),
  }))
}

function minimizeTransactions(
  balances: Balance[],
  roundingUnit: RoundingUnit,
): Settlement[] {
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

export function calculateAverageAmount(
  expenses: Expense[],
  memberCount: number,
): number {
  if (memberCount === 0) return 0
  return calculateTotalAmount(expenses) / memberCount
}
