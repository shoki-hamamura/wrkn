'use client'

import { X } from 'lucide-react'
import { formatAmount } from '@/shared/lib'
import type { CurrencyCode, Expense, Member } from '@/shared/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui'

export interface ExpenseCardProps {
  expense: Expense
  members: Member[]
  currency: CurrencyCode
  onEdit?: () => void
  onRemove?: () => void
}

export function ExpenseCard({
  expense,
  members,
  currency,
  onEdit,
  onRemove,
}: ExpenseCardProps) {
  const payer = members.find((m) => m.id === expense.paidBy)
  const participantNames = getParticipantNames(expense, members)

  return (
    <Card className="relative border-l-4 border-l-accent shadow-sm">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute inset-0 z-0 cursor-pointer rounded-2xl focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
          aria-label={`${expense.name}を編集`}
        />
      )}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 flex size-6 items-center justify-center rounded-full text-foreground-subtle hover:bg-surface-elevated hover:text-foreground-muted transition-colors"
          aria-label={`${expense.name}を削除`}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}

      <CardHeader className="relative z-0">
        <CardTitle>{expense.name}</CardTitle>
      </CardHeader>

      <CardContent className="relative z-0">
        <p className="text-lg font-semibold text-foreground">
          {formatAmount(expense.amount, currency)}
        </p>
        <p className="text-foreground-muted">立替: {payer?.name ?? '不明'}</p>
        <p className="text-foreground-muted">参加: {participantNames}</p>
      </CardContent>
    </Card>
  )
}

function getParticipantNames(expense: Expense, members: Member[]): string {
  if (expense.participants.length === 0) {
    return '全員'
  }

  const names = expense.participants
    .map((id) => members.find((m) => m.id === id)?.name)
    .filter(Boolean)

  if (names.length === members.length) {
    return '全員'
  }

  return names.join(', ')
}
