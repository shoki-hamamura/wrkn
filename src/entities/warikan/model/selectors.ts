'use client'

import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { calculateSettlements, calculateTotalAmount } from '@/shared/lib'
import { useWarikanStore } from './store'

export const useMembers = () => useWarikanStore((state) => state.members)

export const useGroups = () => useWarikanStore((state) => state.groups)

export const useHasGroups = () =>
  useWarikanStore((state) => state.groups.length > 0)

export const useExpenses = () => useWarikanStore((state) => state.expenses)

export const useSettings = () =>
  useWarikanStore(useShallow((state) => state.settings))

export const useCurrency = () =>
  useWarikanStore((state) => state.settings.currency)

export const useRoundingUnit = () =>
  useWarikanStore((state) => state.settings.roundingUnit)

export const useTotalAmount = () =>
  useWarikanStore((state) => calculateTotalAmount(state.expenses))

export const useSettlements = () => {
  const members = useWarikanStore((state) => state.members)
  const groups = useWarikanStore((state) => state.groups)
  const expenses = useWarikanStore((state) => state.expenses)
  const roundingUnit = useWarikanStore((state) => state.settings.roundingUnit)

  return useMemo(
    () =>
      calculateSettlements({
        members,
        groups,
        expenses,
        roundingUnit,
      }),
    [members, groups, expenses, roundingUnit],
  )
}

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
