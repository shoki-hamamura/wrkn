import { describe, expect, it } from 'vitest'
import type {
  Expense,
  ExpenseId,
  GroupId,
  Member,
  MemberId,
  ParticipantGroup,
} from '@/shared/types'
import {
  calculateAverageAmount,
  calculateSettlements,
  calculateTotalAmount,
} from './calculate'

const createMember = (id: string, name: string, bias = 1.0): Member => ({
  id: id as MemberId,
  name,
  bias,
})

const createExpense = (
  name: string,
  amount: number,
  paidBy: string,
  participants: string[] = [],
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
      groups: [],
      expenses: [createExpense('Test', 1000, 'm1')],
      roundingUnit: 1,
    })
    expect(result.settlements).toEqual([])
  })

  it('returns empty array when no expenses', () => {
    const result = calculateSettlements({
      members: [createMember('m1', '太郎')],
      groups: [],
      expenses: [],
      roundingUnit: 1,
    })
    expect(result.settlements).toEqual([])
  })

  it('calculates correct settlement for 2 people equal split', () => {
    const members = [createMember('m1', '太郎'), createMember('m2', '花子')]
    const expenses = [createExpense('食事', 2000, 'm1')]

    const result = calculateSettlements({
      members,
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements).toHaveLength(1)
    expect(result.settlements[0]).toEqual({
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
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements).toHaveLength(2)

    const fromM2 = result.settlements.find((s) => s.from === 'm2')
    const fromM3 = result.settlements.find((s) => s.from === 'm3')

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
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements).toHaveLength(0)
  })

  it('considers bias when calculating shares', () => {
    const members = [
      createMember('m1', '太郎', 1.0),
      createMember('m2', '花子', 2.0),
    ]
    const expenses = [createExpense('食事', 3000, 'm1')]

    const result = calculateSettlements({
      members,
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements).toHaveLength(1)
    expect(result.settlements[0]).toEqual({
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
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements).toHaveLength(1)
    expect(result.settlements[0]).toEqual({
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
      groups: [],
      expenses,
      roundingUnit: 10,
    })

    result.settlements.forEach((settlement) => {
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
      groups: [],
      expenses,
      roundingUnit: 100,
    })

    result.settlements.forEach((settlement) => {
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
      groups: [],
      expenses,
      roundingUnit: 10,
    })

    expect(result.settlements.length).toBeGreaterThan(0)

    result.settlements.forEach((settlement) => {
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

describe('large scale calculations', () => {
  it('handles 50 members correctly', () => {
    const members = Array.from({ length: 50 }, (_, i) =>
      createMember(`m${i}`, `Member${i}`),
    )
    const expenses = [createExpense('Dinner', 50000, 'm0')]

    const result = calculateSettlements({
      members,
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements.length).toBeLessThanOrEqual(49)
    const totalSettled = result.settlements.reduce(
      (sum, s) => sum + s.amount,
      0,
    )
    expect(totalSettled).toBeGreaterThan(0)
  })

  it('handles 50 expenses correctly', () => {
    const members = [createMember('m1', 'Taro'), createMember('m2', 'Hanako')]
    const expenses = Array.from({ length: 50 }, (_, i) =>
      createExpense(`Expense${i}`, 100, i % 2 === 0 ? 'm1' : 'm2'),
    )

    const result = calculateSettlements({
      members,
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements.length).toBeLessThanOrEqual(1)
  })

  it('handles 50 members with 50 expenses', () => {
    const members = Array.from({ length: 50 }, (_, i) =>
      createMember(`m${i}`, `Member${i}`),
    )
    const expenses = Array.from({ length: 50 }, (_, i) =>
      createExpense(`Expense${i}`, 1000, `m${i % 50}`),
    )

    const result = calculateSettlements({
      members,
      groups: [],
      expenses,
      roundingUnit: 10,
    })

    result.settlements.forEach((settlement) => {
      expect(settlement.amount % 10).toBe(0)
    })
  })
})

describe('floating point precision', () => {
  it('handles fractional bias values correctly', () => {
    const members = [
      createMember('m1', 'Taro', 1.0),
      createMember('m2', 'Hanako', 1.5),
      createMember('m3', 'Jiro', 0.8),
    ]
    const expenses = [createExpense('Test', 10000, 'm1')]

    const result = calculateSettlements({
      members,
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    result.settlements.forEach((settlement) => {
      expect(Number.isInteger(settlement.amount)).toBe(true)
      expect(Number.isFinite(settlement.amount)).toBe(true)
    })
  })

  it('handles small bias values without producing NaN or Infinity', () => {
    const members = [
      createMember('m1', 'Taro', 0.1),
      createMember('m2', 'Hanako', 0.2),
    ]
    const expenses = [createExpense('Test', 3000, 'm1')]

    const result = calculateSettlements({
      members,
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements.every((s) => Number.isFinite(s.amount))).toBe(
      true,
    )
  })

  it('produces consistent results across multiple calculations', () => {
    const members = [
      createMember('m1', 'Taro'),
      createMember('m2', 'Hanako'),
      createMember('m3', 'Jiro'),
    ]
    const expenses = [createExpense('Test', 1000, 'm1')]

    const results: number[] = []
    for (let i = 0; i < 10; i++) {
      const result = calculateSettlements({
        members,
        groups: [],
        expenses,
        roundingUnit: 1,
      })
      results.push(result.settlements.reduce((sum, s) => sum + s.amount, 0))
    }

    expect(new Set(results).size).toBe(1)
  })

  it('handles very large amounts correctly', () => {
    const members = [createMember('m1', 'Taro'), createMember('m2', 'Hanako')]
    const expenses = [createExpense('Test', 9999999999, 'm1')]

    const result = calculateSettlements({
      members,
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements).toHaveLength(1)
    expect(result.settlements[0]?.amount).toBeGreaterThan(0)
    expect(Number.isFinite(result.settlements[0]?.amount)).toBe(true)
  })

  it('handles 1 yen amounts correctly', () => {
    const members = [createMember('m1', 'Taro'), createMember('m2', 'Hanako')]
    const expenses = [createExpense('Test', 1, 'm1')]

    const result = calculateSettlements({
      members,
      groups: [],
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements.length).toBeLessThanOrEqual(1)
  })
})

const createGroup = (
  id: string,
  name: string,
  count: number,
  bias = 1.0,
): ParticipantGroup => ({
  id: id as GroupId,
  name,
  count,
  bias,
})

describe('calculateSettlements with groups', () => {
  it('calculates group settlements with single group', () => {
    const members = [createMember('m1', '幹事')]
    const groups = [createGroup('g1', '参加者', 10)]
    const expenses = [createExpense('食事', 11000, 'm1')]

    const result = calculateSettlements({
      members,
      groups,
      expenses,
      roundingUnit: 1,
    })

    expect(result.groupSettlements).toHaveLength(1)
    expect(result.groupSettlements[0]?.groupId).toBe('g1')
    expect(result.groupSettlements[0]?.perPersonAmount).toBe(1000)
    expect(result.groupSettlements[0]?.totalAmount).toBe(10000)
  })

  it('calculates with members and groups mixed', () => {
    const members = [
      createMember('m1', '幹事', 1.0),
      createMember('m2', '会計', 1.0),
    ]
    const groups = [createGroup('g1', '一般参加者', 8, 1.0)]
    const expenses = [createExpense('食事', 10000, 'm1')]

    const result = calculateSettlements({
      members,
      groups,
      expenses,
      roundingUnit: 1,
    })

    expect(result.groupSettlements).toHaveLength(1)
    expect(result.groupSettlements[0]?.perPersonAmount).toBe(1000)
    expect(result.groupSettlements[0]?.totalAmount).toBe(8000)

    expect(result.settlements).toHaveLength(1)
    expect(result.settlements[0]).toEqual({
      from: 'm2',
      to: 'm1',
      amount: 1000,
    })
  })

  it('calculates with multiple groups with different bias', () => {
    const members = [createMember('m1', '幹事', 1.0)]
    const groups = [
      createGroup('g1', '飲む人', 10, 1.0),
      createGroup('g2', '飲まない人', 10, 0.5),
    ]
    const expenses = [createExpense('飲み会', 16000, 'm1')]

    const result = calculateSettlements({
      members,
      groups,
      expenses,
      roundingUnit: 1,
    })

    expect(result.groupSettlements).toHaveLength(2)

    const drinkersGroup = result.groupSettlements.find(
      (g) => g.groupId === 'g1',
    )
    const nonDrinkersGroup = result.groupSettlements.find(
      (g) => g.groupId === 'g2',
    )

    expect(drinkersGroup?.perPersonAmount).toBe(1000)
    expect(nonDrinkersGroup?.perPersonAmount).toBe(500)
  })

  it('handles members with different bias alongside groups', () => {
    const members = [
      createMember('m1', '社長', 2.0),
      createMember('m2', '新人', 0.5),
    ]
    const groups = [createGroup('g1', '一般社員', 10, 1.0)]
    const expenses = [createExpense('忘年会', 12500, 'm1')]

    const result = calculateSettlements({
      members,
      groups,
      expenses,
      roundingUnit: 1,
    })

    expect(result.groupSettlements).toHaveLength(1)
    expect(result.groupSettlements[0]?.perPersonAmount).toBe(1000)

    expect(result.settlements).toHaveLength(1)
    expect(result.settlements[0]?.from).toBe('m2')
    expect(result.settlements[0]?.to).toBe('m1')
    expect(result.settlements[0]?.amount).toBe(500)
  })

  it('handles multiple payers with groups', () => {
    const members = [createMember('m1', '幹事A'), createMember('m2', '幹事B')]
    const groups = [createGroup('g1', '参加者', 8)]
    const expenses = [
      createExpense('1次会', 5000, 'm1'),
      createExpense('2次会', 5000, 'm2'),
    ]

    const result = calculateSettlements({
      members,
      groups,
      expenses,
      roundingUnit: 1,
    })

    expect(result.groupSettlements).toHaveLength(1)
    expect(result.groupSettlements[0]?.perPersonAmount).toBe(1000)

    expect(result.settlements).toHaveLength(0)
  })

  it('applies rounding to group settlements', () => {
    const members = [createMember('m1', '幹事')]
    const groups = [createGroup('g1', '参加者', 3)]
    const expenses = [createExpense('食事', 10000, 'm1')]

    const result = calculateSettlements({
      members,
      groups,
      expenses,
      roundingUnit: 100,
    })

    expect(result.groupSettlements[0]?.perPersonAmount).toBe(2500)
    expect((result.groupSettlements[0]?.perPersonAmount ?? 0) % 100).toBe(0)
  })

  it('returns empty when no members even with groups', () => {
    const groups = [createGroup('g1', '参加者', 10)]
    const expenses = [createExpense('食事', 10000, 'm1')]

    const result = calculateSettlements({
      members: [],
      groups,
      expenses,
      roundingUnit: 1,
    })

    expect(result.settlements).toEqual([])
    expect(result.groupSettlements).toEqual([])
  })

  it('handles large group scenario (30 people party)', () => {
    const members = [createMember('m1', '幹事', 1.0)]
    const groups = [
      createGroup('g1', '飲む人', 20, 1.0),
      createGroup('g2', '飲まない人', 9, 0.7),
    ]
    const expenses = [createExpense('忘年会', 60000, 'm1')]

    const result = calculateSettlements({
      members,
      groups,
      expenses,
      roundingUnit: 100,
    })

    expect(result.groupSettlements).toHaveLength(2)

    const drinkersGroup = result.groupSettlements.find(
      (g) => g.groupId === 'g1',
    )
    const nonDrinkersGroup = result.groupSettlements.find(
      (g) => g.groupId === 'g2',
    )

    expect(drinkersGroup).toBeDefined()
    expect(nonDrinkersGroup).toBeDefined()
    expect(drinkersGroup?.perPersonAmount).toBeGreaterThan(
      nonDrinkersGroup?.perPersonAmount ?? 0,
    )

    const totalFromGroups =
      (drinkersGroup?.totalAmount ?? 0) + (nonDrinkersGroup?.totalAmount ?? 0)
    expect(totalFromGroups).toBeLessThanOrEqual(60000)
  })

  it('handles group with count=1 same as member', () => {
    const membersOnly = [
      createMember('m1', '幹事'),
      createMember('m2', '参加者A'),
    ]
    const resultMembersOnly = calculateSettlements({
      members: membersOnly,
      groups: [],
      expenses: [createExpense('食事', 2000, 'm1')],
      roundingUnit: 1,
    })

    const membersWithGroup = [createMember('m1', '幹事')]
    const groups = [createGroup('g1', '参加者A', 1, 1.0)]
    const resultWithGroup = calculateSettlements({
      members: membersWithGroup,
      groups,
      expenses: [createExpense('食事', 2000, 'm1')],
      roundingUnit: 1,
    })

    expect(resultWithGroup.groupSettlements[0]?.perPersonAmount).toBe(1000)
    expect(resultMembersOnly.settlements[0]?.amount).toBe(1000)
  })

  it('handles zero bias group correctly', () => {
    const members = [createMember('m1', '幹事', 1.0)]
    const groups = [
      createGroup('g1', '有料参加', 5, 1.0),
      createGroup('g2', '無料招待', 5, 0),
    ]
    const expenses = [createExpense('食事', 6000, 'm1')]

    const result = calculateSettlements({
      members,
      groups,
      expenses,
      roundingUnit: 1,
    })

    const freeGroup = result.groupSettlements.find((g) => g.groupId === 'g2')
    expect(freeGroup?.perPersonAmount).toBe(0)
    expect(freeGroup?.totalAmount).toBe(0)
  })
})
