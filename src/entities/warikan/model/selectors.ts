'use client'

import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { calculateSettlements, calculateTotalAmount } from '@/entities/settlement'
import { useWarikanStore } from './store'

export const useMembers = () => useWarikanStore((state) => state.members)

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
  const expenses = useWarikanStore((state) => state.expenses)
  const roundingUnit = useWarikanStore((state) => state.settings.roundingUnit)

  return useMemo(
    () =>
      calculateSettlements({
        members,
        expenses,
        roundingUnit,
      }),
    [members, expenses, roundingUnit]
  )
}

export const useWarikanActions = () =>
  useWarikanStore(
    useShallow((state) => ({
      addMember: state.addMember,
      removeMember: state.removeMember,
      updateMemberBias: state.updateMemberBias,
      addExpense: state.addExpense,
      removeExpense: state.removeExpense,
      updateExpense: state.updateExpense,
      setCurrency: state.setCurrency,
      setRoundingUnit: state.setRoundingUnit,
      reset: state.reset,
    }))
  )
