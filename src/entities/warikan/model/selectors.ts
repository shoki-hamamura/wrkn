'use client'

import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { calculateSettlements, calculateTotalAmount } from '@/shared/lib'
import type { Session } from '@/shared/types'
import { useWarikanStore } from './store'

const emptyArray: never[] = []

function getCurrentSession(state: {
  sessions: Session[]
  currentSessionId: string | null
}): Session | undefined {
  return state.sessions.find((s) => s.id === state.currentSessionId)
}

export const useSessions = () => useWarikanStore((state) => state.sessions)

export const useCurrentSessionId = () =>
  useWarikanStore((state) => state.currentSessionId)

export const useCurrentSession = () =>
  useWarikanStore((state) => getCurrentSession(state))

export const useCurrentSessionName = () =>
  useWarikanStore((state) => getCurrentSession(state)?.name ?? '')

export const useMembers = () =>
  useWarikanStore((state) => getCurrentSession(state)?.members ?? emptyArray)

export const useGroups = () =>
  useWarikanStore((state) => getCurrentSession(state)?.groups ?? emptyArray)

export const useHasGroups = () =>
  useWarikanStore((state) => (getCurrentSession(state)?.groups.length ?? 0) > 0)

export const useExpenses = () =>
  useWarikanStore((state) => getCurrentSession(state)?.expenses ?? emptyArray)

export const useSettings = () =>
  useWarikanStore(
    useShallow((state) => getCurrentSession(state)?.settings ?? null),
  )

export const useCurrency = () =>
  useWarikanStore(
    (state) => getCurrentSession(state)?.settings?.currency ?? 'JPY',
  )

export const useRoundingUnit = () =>
  useWarikanStore(
    (state) => getCurrentSession(state)?.settings?.roundingUnit ?? 10,
  )

export const useTotalAmount = () =>
  useWarikanStore((state) =>
    calculateTotalAmount(getCurrentSession(state)?.expenses ?? []),
  )

export const useSettlements = () => {
  const session = useCurrentSession()

  return useMemo(() => {
    if (!session) return { settlements: [], groupSettlements: [] }

    return calculateSettlements({
      members: session.members,
      groups: session.groups,
      expenses: session.expenses,
      roundingUnit: session.settings.roundingUnit,
    })
  }, [session])
}

export const useSessionActions = () =>
  useWarikanStore(
    useShallow((state) => ({
      createSession: state.createSession,
      deleteSession: state.deleteSession,
      switchSession: state.switchSession,
      renameSession: state.renameSession,
      duplicateSession: state.duplicateSession,
    })),
  )

export const useWarikanActions = () =>
  useWarikanStore(
    useShallow((state) => ({
      addMember: state.addMember,
      removeMember: state.removeMember,
      updateMemberBias: state.updateMemberBias,
      addGroup: state.addGroup,
      removeGroup: state.removeGroup,
      updateGroupCount: state.updateGroupCount,
      updateGroupBias: state.updateGroupBias,
      updateGroupName: state.updateGroupName,
      addExpense: state.addExpense,
      removeExpense: state.removeExpense,
      updateExpense: state.updateExpense,
      setCurrency: state.setCurrency,
      setRoundingUnit: state.setRoundingUnit,
      reset: state.reset,
    })),
  )
