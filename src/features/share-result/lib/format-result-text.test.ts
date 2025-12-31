import { describe, expect, it } from 'vitest'
import type { Member } from '@/entities/member'
import type { Settlement } from '@/entities/settlement'
import type { MemberId } from '@/shared/types'
import { formatResultText } from './format-result-text'

describe('formatResultText', () => {
  const members: Member[] = [
    { id: 'm1' as MemberId, name: '太郎', bias: 1.0 },
    { id: 'm2' as MemberId, name: '花子', bias: 1.0 },
    { id: 'm3' as MemberId, name: '次郎', bias: 1.0 },
  ]

  it('formats result with settlements', () => {
    const settlements: Settlement[] = [
      { from: 'm3' as MemberId, to: 'm1' as MemberId, amount: 7700 },
      { from: 'm3' as MemberId, to: 'm2' as MemberId, amount: 3900 },
    ]

    const result = formatResultText({
      settlements,
      groupSettlements: [],
      members,
      currency: 'JPY',
      totalAmount: 23000,
    })

    expect(result).toContain('【なかよしわりかん】')
    expect(result).toContain('合計: ￥23,000')
    expect(result).toContain('💸 支払い')
    expect(result).toContain('次郎 → 太郎: ￥7,700')
    expect(result).toContain('次郎 → 花子: ￥3,900')
  })

  it('formats result with no settlements', () => {
    const result = formatResultText({
      settlements: [],
      groupSettlements: [],
      members,
      currency: 'JPY',
      totalAmount: 3000,
    })

    expect(result).toContain('精算は不要です')
    expect(result).not.toContain('💸 支払い')
  })

  it('formats USD correctly', () => {
    const settlements: Settlement[] = [
      { from: 'm2' as MemberId, to: 'm1' as MemberId, amount: 50 },
    ]

    const result = formatResultText({
      settlements,
      groupSettlements: [],
      members,
      currency: 'USD',
      totalAmount: 100,
    })

    expect(result).toContain('$100.00')
    expect(result).toContain('$50.00')
  })
})
