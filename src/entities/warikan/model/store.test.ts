import { afterEach, describe, expect, it } from 'vitest'
import {
  MAX_EXPENSE_NAME_LENGTH,
  MAX_EXPENSES,
  MAX_MEMBER_NAME_LENGTH,
  MAX_MEMBERS,
} from '@/shared/constants'
import { useWarikanStore, type WarikanState } from './store'

function getCurrentSession(state: WarikanState) {
  return state.sessions.find((s) => s.id === state.currentSessionId)
}

function getMembers() {
  return getCurrentSession(useWarikanStore.getState())?.members ?? []
}

function getExpenses() {
  return getCurrentSession(useWarikanStore.getState())?.expenses ?? []
}

function getSettings() {
  return getCurrentSession(useWarikanStore.getState())?.settings
}

describe('useWarikanStore', () => {
  afterEach(() => {
    useWarikanStore.getState().reset()
  })

  describe('addMember', () => {
    it('adds a member with default bias', () => {
      useWarikanStore.getState().addMember('太郎')

      const members = getMembers()
      expect(members).toHaveLength(1)
      expect(members[0]?.name).toBe('太郎')
      expect(members[0]?.bias).toBe(1.0)
    })

    it('trims and limits name length', () => {
      useWarikanStore.getState().addMember(`${'  長い名前'.padEnd(60, 'あ')}  `)

      const members = getMembers()
      expect(members[0]?.name.length).toBeLessThanOrEqual(50)
    })

    it('does not add empty name', () => {
      useWarikanStore.getState().addMember('')
      useWarikanStore.getState().addMember('   ')

      expect(getMembers()).toHaveLength(0)
    })

    it('does not add duplicate name', () => {
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('太郎')

      expect(getMembers()).toHaveLength(1)
    })

    it('does not add case-insensitive duplicate name', () => {
      useWarikanStore.getState().addMember('Taro')
      useWarikanStore.getState().addMember('taro')
      useWarikanStore.getState().addMember('TARO')

      expect(getMembers()).toHaveLength(1)
    })

    it('allows adding up to MAX_MEMBERS', () => {
      for (let i = 0; i < MAX_MEMBERS; i++) {
        useWarikanStore.getState().addMember(`Member${i}`)
      }
      expect(getMembers()).toHaveLength(MAX_MEMBERS)
    })

    it('rejects member beyond MAX_MEMBERS', () => {
      for (let i = 0; i < MAX_MEMBERS + 1; i++) {
        useWarikanStore.getState().addMember(`Member${i}`)
      }
      expect(getMembers()).toHaveLength(MAX_MEMBERS)
    })

    it('handles exactly MAX_MEMBER_NAME_LENGTH characters', () => {
      const exactName = 'あ'.repeat(MAX_MEMBER_NAME_LENGTH)
      useWarikanStore.getState().addMember(exactName)

      expect(getMembers()[0]?.name.length).toBe(MAX_MEMBER_NAME_LENGTH)
    })

    it('handles emoji in member name', () => {
      useWarikanStore.getState().addMember('太郎🎉')
      expect(getMembers()[0]?.name).toBe('太郎🎉')
    })

    it('handles unicode characters in member name', () => {
      useWarikanStore.getState().addMember('王小明')
      expect(getMembers()[0]?.name).toBe('王小明')
    })
  })

  describe('removeMember', () => {
    it('removes a member', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().removeMember(memberId)
      }

      expect(getMembers()).toHaveLength(0)
    })

    it('removes member from expense participants', () => {
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('花子')

      const members = getMembers()
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

        const expenses = getExpenses()
        expect(expenses[0]?.participants).not.toContain(hanakoId)
      }
    })
  })

  describe('updateMemberBias', () => {
    it('updates member bias', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().updateMemberBias(memberId, 1.5)
      }

      expect(getMembers()[0]?.bias).toBe(1.5)
    })

    it('clamps bias to valid range', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().updateMemberBias(memberId, 0)
        expect(getMembers()[0]?.bias).toBe(0.1)

        useWarikanStore.getState().updateMemberBias(memberId, 5)
        expect(getMembers()[0]?.bias).toBe(3.0)
      }
    })
  })

  describe('addExpense', () => {
    it('adds an expense', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '1次会',
          amount: 15000,
          paidBy: memberId,
          participants: [],
        })
      }

      const expenses = getExpenses()
      expect(expenses).toHaveLength(1)
      expect(expenses[0]?.name).toBe('1次会')
      expect(expenses[0]?.amount).toBe(15000)
    })

    it('allows adding up to MAX_EXPENSES', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

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
      expect(getExpenses()).toHaveLength(MAX_EXPENSES)
    })

    it('rejects expense beyond MAX_EXPENSES', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

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
      expect(getExpenses()).toHaveLength(MAX_EXPENSES)
    })

    it('truncates expense name to MAX_EXPENSE_NAME_LENGTH', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: 'あ'.repeat(MAX_EXPENSE_NAME_LENGTH + 10),
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(getExpenses()[0]?.name.length).toBe(MAX_EXPENSE_NAME_LENGTH)
    })

    it('handles exactly MAX_EXPENSE_NAME_LENGTH characters', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: 'あ'.repeat(MAX_EXPENSE_NAME_LENGTH),
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(getExpenses()[0]?.name.length).toBe(MAX_EXPENSE_NAME_LENGTH)
    })

    it('uses default name for empty expense name', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '',
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(getExpenses()[0]?.name).toBe('会計')
    })

    it('uses default name for whitespace-only expense name', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '   ',
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(getExpenses()[0]?.name).toBe('会計')
    })

    it('handles special symbols in expense name', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '1次会@居酒屋 #忘年会',
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(getExpenses()[0]?.name).toBe('1次会@居酒屋 #忘年会')
    })

    it('handles emoji in expense name', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: 'ランチ🍱',
          amount: 100,
          paidBy: memberId,
          participants: [],
        })
      }
      expect(getExpenses()[0]?.name).toBe('ランチ🍱')
    })
  })

  describe('removeExpense', () => {
    it('removes an expense', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '1次会',
          amount: 15000,
          paidBy: memberId,
          participants: [],
        })

        const expenseId = getExpenses()[0]?.id
        if (expenseId) {
          useWarikanStore.getState().removeExpense(expenseId)
        }
      }

      expect(getExpenses()).toHaveLength(0)
    })
  })

  describe('updateExpense', () => {
    it('updates an expense', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

      if (memberId) {
        useWarikanStore.getState().addExpense({
          name: '1次会',
          amount: 15000,
          paidBy: memberId,
          participants: [],
        })

        const expenseId = getExpenses()[0]?.id
        if (expenseId) {
          useWarikanStore.getState().updateExpense(expenseId, {
            name: '2次会',
            amount: 8000,
          })
        }
      }

      const expense = getExpenses()[0]
      expect(expense?.name).toBe('2次会')
      expect(expense?.amount).toBe(8000)
    })
  })

  describe('settings', () => {
    it('changes currency', () => {
      useWarikanStore.getState().setCurrency('USD')
      expect(getSettings()?.currency).toBe('USD')
    })

    it('changes rounding unit', () => {
      useWarikanStore.getState().setRoundingUnit(100)
      expect(getSettings()?.roundingUnit).toBe(100)
    })
  })

  describe('reset', () => {
    it('resets to initial state', () => {
      useWarikanStore.getState().addMember('太郎')
      const memberId = getMembers()[0]?.id

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

      expect(getMembers()).toHaveLength(0)
      expect(getExpenses()).toHaveLength(0)
      expect(getSettings()?.currency).toBe('JPY')
    })
  })

  describe('session management', () => {
    it('creates a new session', () => {
      const initialSessionCount = useWarikanStore.getState().sessions.length
      useWarikanStore.getState().createSession('旅行')

      expect(useWarikanStore.getState().sessions).toHaveLength(
        initialSessionCount + 1,
      )
      expect(getCurrentSession(useWarikanStore.getState())?.name).toBe('旅行')
    })

    it('switches between sessions', () => {
      useWarikanStore.getState().addMember('太郎')
      const firstSessionId = useWarikanStore.getState().currentSessionId

      useWarikanStore.getState().createSession('新しい会計')
      useWarikanStore.getState().addMember('花子')

      expect(getMembers()[0]?.name).toBe('花子')

      if (firstSessionId) {
        useWarikanStore.getState().switchSession(firstSessionId)
      }

      expect(getMembers()[0]?.name).toBe('太郎')
    })

    it('renames a session', () => {
      const sessionId = useWarikanStore.getState().currentSessionId
      if (sessionId) {
        useWarikanStore.getState().renameSession(sessionId, '忘年会')
      }

      expect(getCurrentSession(useWarikanStore.getState())?.name).toBe('忘年会')
    })

    it('deletes a session', () => {
      useWarikanStore.getState().createSession('削除用')
      const sessionToDelete = useWarikanStore.getState().currentSessionId
      const sessionCount = useWarikanStore.getState().sessions.length

      if (sessionToDelete) {
        useWarikanStore.getState().deleteSession(sessionToDelete)
      }

      expect(useWarikanStore.getState().sessions).toHaveLength(sessionCount - 1)
    })

    it('does not delete the last session', () => {
      useWarikanStore.getState().reset()
      const sessionId = useWarikanStore.getState().currentSessionId

      if (sessionId) {
        useWarikanStore.getState().deleteSession(sessionId)
      }

      expect(useWarikanStore.getState().sessions).toHaveLength(1)
    })

    it('duplicates a session', () => {
      useWarikanStore.getState().addMember('太郎')
      const originalSessionId = useWarikanStore.getState().currentSessionId

      if (originalSessionId) {
        useWarikanStore.getState().duplicateSession(originalSessionId)
      }

      expect(getMembers()[0]?.name).toBe('太郎')
      expect(getCurrentSession(useWarikanStore.getState())?.name).toContain(
        'のコピー',
      )
    })
  })
})
