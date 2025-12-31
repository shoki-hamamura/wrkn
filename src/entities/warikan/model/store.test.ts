import { afterEach, describe, expect, it } from 'vitest'
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
