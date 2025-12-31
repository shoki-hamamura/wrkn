'use client'

import { SettlementItem } from '@/entities/settlement'
import {
  useCurrency,
  useGroups,
  useMembers,
  useSettlements,
  useTotalAmount,
} from '@/entities/warikan'
import { CopyButton, formatResultText } from '@/features/share-result'
import { formatAmount } from '@/shared/lib'

export interface SettlementResultProps {
  className?: string
}

export function SettlementResult({ className }: SettlementResultProps) {
  const members = useMembers()
  const groups = useGroups()
  const currency = useCurrency()
  const { settlements, groupSettlements } = useSettlements()
  const totalAmount = useTotalAmount()

  const resultText = formatResultText({
    settlements,
    groupSettlements,
    members,
    currency,
    totalAmount,
  })

  if (members.length === 0) {
    return (
      <div className={className}>
        <p className="text-center text-foreground-muted">
          メンバーを追加して会計を登録すると、精算結果が表示されます
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-6 text-center">
        <p className="text-sm text-foreground-muted">合計</p>
        <p className="text-3xl font-bold text-foreground">
          {formatAmount(totalAmount, currency)}
        </p>
        {groups.length === 0 && members.length > 0 && (
          <p className="text-sm text-foreground-muted">
            1人あたり約{' '}
            {formatAmount(Math.round(totalAmount / members.length), currency)}
          </p>
        )}
      </div>

      {groupSettlements.length > 0 && (
        <>
          <h3 className="mb-3 text-sm font-medium text-foreground-muted">
            グループ別 1人あたり
          </h3>
          <div className="mb-6 space-y-2">
            {groupSettlements.map((gs) => (
              <div
                key={gs.groupId}
                className="flex items-center justify-between rounded-lg border-l-4 border-l-secondary bg-surface p-3 shadow-sm"
              >
                <span className="text-sm font-bold text-foreground">
                  {gs.groupName}
                </span>
                <span className="text-lg font-bold text-foreground">
                  {formatAmount(gs.perPersonAmount, currency)}/人
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {settlements.length > 0 ? (
        <>
          <h3 className="mb-3 text-sm font-medium text-foreground-muted">
            支払い
          </h3>
          <div className="mb-6 space-y-3">
            {settlements.map((settlement, index) => (
              <SettlementItem
                key={`${settlement.from}-${settlement.to}-${index}`}
                settlement={settlement}
                members={members}
                currency={currency}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="mb-6 text-center text-foreground-muted">
          {totalAmount > 0 ? '精算は不要です' : '会計を追加してください'}
        </p>
      )}

      {totalAmount > 0 && (
        <CopyButton text={resultText} variant="secondary" className="w-full">
          結果をコピー
        </CopyButton>
      )}
    </div>
  )
}
