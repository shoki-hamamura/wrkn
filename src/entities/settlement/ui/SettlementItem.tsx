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
    <div className="flex items-center justify-between rounded-lg border-l-4 border-l-primary bg-surface p-4 shadow-sm">
      <p className="text-foreground">
        <span className="font-bold">{fromMember?.name ?? '不明'}</span>
        <span className="text-foreground-subtle"> さんから </span>
        <span className="font-bold">{toMember?.name ?? '不明'}</span>
        <span className="text-foreground-subtle"> さんへ</span>
      </p>
      <span className="text-xl font-bold text-primary">
        {formatAmount(settlement.amount, currency)}
      </span>
    </div>
  )
}
