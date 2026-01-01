import type { Member } from '@/entities/member'
import type { Settlement } from '@/entities/settlement'
import { formatAmount } from '@/shared/lib'
import type {
  CurrencyCode,
  GroupSettlement,
  RoundingUnit,
} from '@/shared/types'

const APP_URL = 'https://wrkn-blond.vercel.app/'

export interface FormatResultTextInput {
  settlements: Settlement[]
  groupSettlements: GroupSettlement[]
  members: Member[]
  currency: CurrencyCode
  totalAmount: number
  roundingUnit: RoundingUnit
}

export function formatResultText({
  settlements,
  groupSettlements,
  members,
  currency,
  totalAmount,
  roundingUnit,
}: FormatResultTextInput): string {
  const lines: string[] = []

  lines.push('【なかよしわりかん】')
  lines.push(`合計: ${formatAmount(totalAmount, currency)}`)
  lines.push('')

  if (groupSettlements.length > 0) {
    lines.push('👥 グループ別 1人あたり')
    for (const gs of groupSettlements) {
      lines.push(
        `・${gs.groupName}: ${formatAmount(gs.perPersonAmount, currency)}/人`,
      )
    }
    lines.push('')
  }

  if (settlements.length > 0) {
    lines.push('💸 送金')
    for (const settlement of settlements) {
      const from = members.find((m) => m.id === settlement.from)
      const to = members.find((m) => m.id === settlement.to)
      lines.push(
        `・${from?.name ?? '不明'}さん → ${to?.name ?? '不明'}さんへ ${formatAmount(settlement.amount, currency)}`,
      )
    }
  } else if (groupSettlements.length === 0) {
    lines.push('精算は不要です')
  }

  lines.push('')
  if (roundingUnit > 1) {
    lines.push(`※${roundingUnit}円単位で切上げ`)
  }
  lines.push(APP_URL)

  return lines.join('\n')
}
