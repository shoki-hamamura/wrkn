'use client'

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
    <Card className="relative">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute inset-0 z-0 cursor-pointer rounded-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          aria-label={`${expense.name}を編集`}
        />
      )}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 flex size-6 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
          aria-label={`${expense.name}を削除`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      )}

      <CardHeader className="relative z-0">
        <CardTitle>{expense.name}</CardTitle>
      </CardHeader>

      <CardContent className="relative z-0">
        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {formatAmount(expense.amount, currency)}
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          立替: {payer?.name ?? '不明'}
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">参加: {participantNames}</p>
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
