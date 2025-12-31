'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui'
import { ExpenseCard, type Expense } from '@/entities/expense'
import { useCurrency, useExpenses, useMembers, useWarikanActions } from '@/entities/warikan'
import { AddExpenseSheet } from '@/features/add-expense'

export interface ExpenseListProps {
  className?: string
}

export function ExpenseList({ className }: ExpenseListProps) {
  const members = useMembers()
  const expenses = useExpenses()
  const currency = useCurrency()
  const { removeExpense } = useWarikanActions()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>()

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setSheetOpen(true)
  }

  const handleAdd = () => {
    setEditingExpense(undefined)
    setSheetOpen(true)
  }

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open)
    if (!open) {
      setEditingExpense(undefined)
    }
  }

  const canAddExpense = members.length > 0

  return (
    <div className={className}>
      <h2 className="mb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
        会計
      </h2>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            members={members}
            currency={currency}
            onEdit={() => handleEdit(expense)}
            onRemove={() => removeExpense(expense.id)}
          />
        ))}

        {canAddExpense ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAdd}
          >
            + 会計を追加
          </Button>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            会計を追加するには、まずメンバーを追加してください
          </p>
        )}
      </div>

      <AddExpenseSheet
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        {...(editingExpense && { editingExpense })}
      />
    </div>
  )
}
