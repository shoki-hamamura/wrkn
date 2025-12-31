import { describe, expect, it } from 'vitest'
import type { ExpenseId, MemberId } from '@/shared/types'
import type { Member } from '@/entities/member'
import type { Expense } from '@/entities/expense'
import { calculateAverageAmount, calculateSettlements, calculateTotalAmount } from './calculate'

const createMember = (id: string, name: string, bias = 1.0): Member => ({
  id: id as MemberId,
  name,
  bias,
})

const createExpense = (
  name: string,
  amount: number,
  paidBy: string,
  participants: string[] = []
): Expense => ({
  id: crypto.randomUUID() as ExpenseId,
  name,
  amount,
  paidBy: paidBy as MemberId,
  participants: participants as MemberId[],
  createdAt: Date.now(),
})

describe('calculateSettlements', () => {
  it('returns empty array when no members', () => {
    const result = calculateSettlements({
      members: [],
      expenses: [createExpense('Test', 1000, 'm1')],
      roundingUnit: 1,
    })
    expect(result).toEqual([])
  })

  it('returns empty array when no expenses', () => {
    const result = calculateSettlements({
      members: [createMember('m1', '太郎')],
      expenses: [],
      roundingUnit: 1,
    })
    expect(result).toEqual([])
  })

  it('calculates correct settlement for 2 people equal split', () => {
    const members = [createMember('m1', '太郎'), createMember('m2', '花子')]
    const expenses = [createExpense('食事', 2000, 'm1')]

    const result = calculateSettlements({
      members,
      expenses,
      roundingUnit: 1,
    })

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      from: 'm2',
      to: 'm1',
      amount: 1000,
    })
  })

  it('calculates correct settlement for 3 people equal split', () => {
    const members = [
      createMember('m1', '太郎'),
      createMember('m2', '花子'),
      createMember('m3', '次郎'),
    ]
    const expenses = [createExpense('食事', 3000, 'm1')]

    const result = calculateSettlements({
      members,
      expenses,
      roundingUnit: 1,
    })

    expect(result).toHaveLength(2)

    const fromM2 = result.find((s) => s.from === 'm2')
    const fromM3 = result.find((s) => s.from === 'm3')

    expect(fromM2).toBeDefined()
    expect(fromM3).toBeDefined()
    expect(fromM2?.amount).toBe(1000)
    expect(fromM3?.amount).toBe(1000)
  })

  it('handles multiple payers correctly', () => {
    const members = [createMember('m1', '太郎'), createMember('m2', '花子')]
    const expenses = [
      createExpense('1次会', 2000, 'm1'),
      createExpense('2次会', 2000, 'm2'),
    ]

    const result = calculateSettlements({
      members,
      expenses,
      roundingUnit: 1,
    })

    expect(result).toHaveLength(0)
  })

  it('considers bias when calculating shares', () => {
    const members = [
      createMember('m1', '太郎', 1.0),
      createMember('m2', '花子', 2.0),
    ]
    const expenses = [createExpense('食事', 3000, 'm1')]

    const result = calculateSettlements({
      members,
      expenses,
      roundingUnit: 1,
    })

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      from: 'm2',
      to: 'm1',
      amount: 2000,
    })
  })

  it('handles partial participants', () => {
    const members = [
      createMember('m1', '太郎'),
      createMember('m2', '花子'),
      createMember('m3', '次郎'),
    ]
    const expenses = [createExpense('食事', 2000, 'm1', ['m1', 'm2'])]

    const result = calculateSettlements({
      members,
      expenses,
      roundingUnit: 1,
    })

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      from: 'm2',
      to: 'm1',
      amount: 1000,
    })
  })

  it('applies rounding correctly with unit=10', () => {
    const members = [
      createMember('m1', '太郎'),
      createMember('m2', '花子'),
      createMember('m3', '次郎'),
    ]
    const expenses = [createExpense('食事', 1000, 'm1')]

    const result = calculateSettlements({
      members,
      expenses,
      roundingUnit: 10,
    })

    result.forEach((settlement) => {
      expect(settlement.amount % 10).toBe(0)
    })
  })

  it('applies rounding correctly with unit=100', () => {
    const members = [
      createMember('m1', '太郎'),
      createMember('m2', '花子'),
      createMember('m3', '次郎'),
    ]
    const expenses = [createExpense('食事', 7000, 'm1')]

    const result = calculateSettlements({
      members,
      expenses,
      roundingUnit: 100,
    })

    result.forEach((settlement) => {
      expect(settlement.amount % 100).toBe(0)
    })
  })

  it('handles complex scenario with multiple expenses and bias', () => {
    const members = [
      createMember('m1', '太郎', 1.0),
      createMember('m2', '花子', 1.5),
      createMember('m3', '次郎', 0.8),
    ]
    const expenses = [
      createExpense('1次会', 15000, 'm1'),
      createExpense('2次会', 8000, 'm2', ['m1', 'm2']),
    ]

    const result = calculateSettlements({
      members,
      expenses,
      roundingUnit: 10,
    })

    expect(result.length).toBeGreaterThan(0)

    result.forEach((settlement) => {
      expect(settlement.amount % 10).toBe(0)
      expect(settlement.amount).toBeGreaterThan(0)
    })
  })
})

describe('calculateTotalAmount', () => {
  it('returns 0 for empty expenses', () => {
    expect(calculateTotalAmount([])).toBe(0)
  })

  it('calculates total correctly', () => {
    const expenses = [
      createExpense('1次会', 15000, 'm1'),
      createExpense('2次会', 8000, 'm2'),
      createExpense('タクシー', 2000, 'm3'),
    ]
    expect(calculateTotalAmount(expenses)).toBe(25000)
  })
})

describe('calculateAverageAmount', () => {
  it('returns 0 for 0 members', () => {
    const expenses = [createExpense('食事', 3000, 'm1')]
    expect(calculateAverageAmount(expenses, 0)).toBe(0)
  })

  it('calculates average correctly', () => {
    const expenses = [createExpense('食事', 3000, 'm1')]
    expect(calculateAverageAmount(expenses, 3)).toBe(1000)
  })
})
