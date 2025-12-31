'use client'

import { formatAmount } from '@/shared/lib'
import type { CurrencyCode } from '@/shared/types'
import type { Member } from '@/entities/member'
import type { Settlement } from '../model/types'

export interface SettlementItemProps {
  settlement: Settlement
  members: Member[]
  currency: CurrencyCode
}

export function SettlementItem({ settlement, members, currency }: SettlementItemProps) {
  const fromMember = members.find((m) => m.id === settlement.from)
  const toMember = members.find((m) => m.id === settlement.to)

  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex items-center gap-2">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          {fromMember?.name ?? '不明'}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5 text-neutral-400"
        >
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          {toMember?.name ?? '不明'}
        </span>
      </div>
      <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
        {formatAmount(settlement.amount, currency)}
      </span>
    </div>
  )
}
