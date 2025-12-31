'use client'

import { ArrowRight } from 'lucide-react'
import { formatAmount } from '@/shared/lib'
import type { CurrencyCode, Member, Settlement } from '@/shared/types'

export interface SettlementItemProps {
  settlement: Settlement
  members: Member[]
  currency: CurrencyCode
}

export function SettlementItem({
  settlement,
  members,
  currency,
}: SettlementItemProps) {
  const fromMember = members.find((m) => m.id === settlement.from)
  const toMember = members.find((m) => m.id === settlement.to)

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground">
          {fromMember?.name ?? '不明'}
        </span>
        <ArrowRight
          className="size-5 text-foreground-subtle"
          aria-hidden="true"
        />
        <span className="font-medium text-foreground">
          {toMember?.name ?? '不明'}
        </span>
      </div>
      <span className="text-lg font-semibold text-primary">
        {formatAmount(settlement.amount, currency)}
      </span>
    </div>
  )
}
