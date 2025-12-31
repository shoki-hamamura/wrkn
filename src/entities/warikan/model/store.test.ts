import { afterEach, describe, expect, it } from 'vitest'
import {
  MAX_EXPENSE_NAME_LENGTH,
  MAX_EXPENSES,
  MAX_MEMBER_NAME_LENGTH,
  MAX_MEMBERS,
} from '@/shared/constants'
import { useWarikanStore } from './store'

describe('useWarikanStore', () => {
  afterEach(() => {
    useWarikanStore.getState().reset()
  })

  describe('addMember', () => {
    it('adds a member with default bias', () => {
      useWarikanStore.getState().addMember('太郎')

      const members = useWarikanStore.getState().members
      expect(members).toHaveLength(1)
      expect(members[0]?.name).toBe('太郎')
      expect(members[0]?.bias).toBe(1.0)
    })

    it('trims and limits name length', () => {
      useWarikanStore.getState().addMember(`${'  長い名前'.padEnd(60, 'あ')}  `)

      const members = useWarikanStore.getState().members
      expect(members[0]?.name.length).toBeLessThanOrEqual(50)
    })

    it('does not add empty name', () => {
      useWarikanStore.getState().addMember('')
      useWarikanStore.getState().addMember('   ')

      expect(useWarikanStore.getState().members).toHaveLength(0)
    })

    it('does not add duplicate name', () => {
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('太郎')

      expect(useWarikanStore.getState().members).toHaveLength(1)
    })

    it('does not add case-insensitive duplicate name', () => {
      useWarikanStore.getState().addMember('Taro')
      useWarikanStore.getState().addMember('taro')
      useWarikanStore.getState().addMember('TARO')

      expect(useWarikanStore.getState().members).toHaveLength(1)
    })

    it('allows adding up to MAX_MEMBERS', () => {
      for (let i = 0; i < MAX_MEMBERS; i++) {
        useWarikanStore.getState().addMember(`Member${i}`)
      }
      expect(useWarikanStore.getState().members).toHaveLength(MAX_MEMBERS)
    })

    it('rejects member beyond MAX_MEMBERS', () => {
      for (let i = 0; i < MAX_MEMBERS + 1; i++) {
        useWarikanStore.getState().addMember(`Member${i}`)
      }
      expect(useWarikanStore.getState().members).toHaveLength(MAX_MEMBERS)
    })

    it('handles exactly MAX_MEMBER_NAME_LENGTH characters', () => {
      const exactName = 'あ'.repeat(MAX_MEMBER_NAME_LENGTH)
      useWarikanStore.getState().addMember(exactName)

      expect(useWarikanStore.getState().members[0]?.name.length).toBe(
        MAX_MEMBER_NAME_LENGTH,
      )
    })

    it('handles emoji in member name', () => {
      useWarikanStore.getState().addMember('太郎🎉')
      expect(useWarikanStore.getState().members[0]?.name).toBe('太郎🎉')
    })

    it('handles unicode characters in member name', () => {
      useWarikanStore.getState().addMember('王小明')
      expect(useWarikanStore.getState().members[0]?.name).toBe('王小明')
    })
  })

  describe('removeMember', () => {
    it('removes a member', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().removeMember(memberId)
      }

      expect(useWarikanStore.getState().members).toHaveLength(0)
    })

    it('removes member from expense participants', () => {
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('花子')

      const members = useWarikanStore.getState().members
      const taroId = members[0]?.id
      const hanakoId = members[1]?.id

      if (taroId && hanakoId) {
        useWarikanStore.getState().addExpense({
          name: '食事',
          amount: 2000,
          paidBy: taroId,
          participants: [taroId, hanakoId],
        })

        useWarikanStore.getState().removeMember(hanakoId)

        const expenses = useWarikanStore.getState().expenses
        expect(expenses[0]?.participants).not.toContain(hanakoId)
      }
    })
  })

  describe('updateMemberBias', () => {
    it('updates member bias', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().updateMemberBias(memberId, 1.5)
      }

      expect(useWarikanStore.getState().members[0]?.bias).toBe(1.5)
    })

    it('clamps bias to valid range', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().updateMemberBias(memberId, 0)
        expect(useWarikanStore.getState().members[0]?.bias).toBe(0.1)

        useWarikanStore.getState().updateMemberBias(memberId, 5)
        expect(useWarikanStore.getState().members[0]?.bias).toBe(3.0)
      }
    })
  })

  describe('addExpense', () => {
    it('adds an expense', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '1次会',
          amount: 15000,
          paidBy: memberId,
          participants: [],
        })
      }

      const expenses = useWarikanStore.getState().expenses
      expect(expenses).toHaveLength(1)
      expect(expenses[0]?.name).toBe('1次会')
      expect(expenses[0]?.amount).toBe(15000)
    })

    it('allows adding up to MAX_EXPENSES', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        for (let i = 0; i < MAX_EXPENSES; i++) {
          useWarikanStore.getState().addExpense({
            name: `Expense${i}`,
            amount: 100,
            paidBy: memberId,
            participants: [],
          })
        }
      }
      expect(useWarikanStore.getState().expenses).toHaveLength(MAX_EXPENSES)
    })

    it('rejects expense beyond MAX_EXPENSES', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        for (let i = 0; i < MAX_EXPENSES + 1; i++) {
          useWarikanStore.getState().addExpense({
            name: `Expense${i}`,
            amount: 100,
            paidBy: memberId,
            participants: [],
          })
        }
      }
      expect(useWarikanStore.getState().expenses).toHaveLength(MAX_EXPENSES)
    })

    it('truncates expense name to MAX_EXPENSE_NAME_LENGTH', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: 'あ'.repeat(MAX_EXPENSE_NAME_LENGTH + 10),
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(useWarikanStore.getState().expenses[0]?.name.length).toBe(
        MAX_EXPENSE_NAME_LENGTH,
      )
    })

    it('handles exactly MAX_EXPENSE_NAME_LENGTH characters', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: 'あ'.repeat(MAX_EXPENSE_NAME_LENGTH),
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(useWarikanStore.getState().expenses[0]?.name.length).toBe(
        MAX_EXPENSE_NAME_LENGTH,
      )
    })

    it('uses default name for empty expense name', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '',
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(useWarikanStore.getState().expenses[0]?.name).toBe('会計')
    })

    it('uses default name for whitespace-only expense name', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '   ',
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(useWarikanStore.getState().expenses[0]?.name).toBe('会計')
    })

    it('handles special symbols in expense name', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '1次会@居酒屋 #忘年会',
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(useWarikanStore.getState().expenses[0]?.name).toBe(
        '1次会@居酒屋 #忘年会',
      )
    })

    it('handles emoji in expense name', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: 'ランチ🍱',
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(useWarikanStore.getState().expenses[0]?.name).toBe('ランチ🍱')
    })
  })

  describe('removeExpense', () => {
    it('removes an expense', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '1次会',
          amount: 15000,
          paidBy: memberId,
          participants: [],
        })

        const expenseId = useWarikanStore.getState().expenses[0]?.id
        if (expenseId) {
          useWarikanStore.getState().removeExpense(expenseId)
        }
      }

      expect(useWarikanStore.getState().expenses).toHaveLength(0)
    })
  })

  describe('updateExpense', () => {
    it('updates an expense', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '1次会',
          amount: 15000,
          paidBy: memberId,
          participants: [],
        })

        const expenseId = useWarikanStore.getState().expenses[0]?.id
        if (expenseId) {
          useWarikanStore.getState().updateExpense(expenseId, {
            name: '2次会',
            amount: 8000,
          })
        }
      }

      const expense = useWarikanStore.getState().expenses[0]
      expect(expense?.name).toBe('2次会')
      expect(expense?.amount).toBe(8000)
    })
  })

  describe('settings', () => {
    it('changes currency', () => {
      useWarikanStore.getState().setCurrency('USD')
      expect(useWarikanStore.getState().settings.currency).toBe('USD')
    })

    it('changes rounding unit', () => {
      useWarikanStore.getState().setRoundingUnit(100)
      expect(useWarikanStore.getState().settings.roundingUnit).toBe(100)
    })
  })

  describe('reset', () => {
    it('resets to initial state', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = useWarikanStore.getState().members[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '食事',
          amount: 1000,
          paidBy: memberId,
          participants: [],
        })
      }

      useWarikanStore.getState().setCurrency('USD')

      useWarikanStore.getState().reset()

      const state = useWarikanStore.getState()
      expect(state.members).toHaveLength(0)
      expect(state.expenses).toHaveLength(0)
      expect(state.settings.currency).toBe('JPY')
    })
  })
})
