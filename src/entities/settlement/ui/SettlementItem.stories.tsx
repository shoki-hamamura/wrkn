import type { Meta, StoryObj } from '@storybook/react'
import type { Member, MemberId } from '@/shared/types'
import { SettlementItem } from './SettlementItem'

const meta: Meta<typeof SettlementItem> = {
  component: SettlementItem,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SettlementItem>

const members: Member[] = [
  { id: 'm1' as MemberId, name: '太郎', bias: 1.0 },
  { id: 'm2' as MemberId, name: '花子', bias: 1.5 },
  { id: 'm3' as MemberId, name: '次郎', bias: 0.7 },
]

export const Default: Story = {
  args: {
    settlement: {
      from: 'm3' as MemberId,
      to: 'm1' as MemberId,
      amount: 7700,
    },
    members,
    currency: 'JPY',
  },
}

export const LargeAmount: Story = {
  args: {
    settlement: {
      from: 'm3' as MemberId,
      to: 'm2' as MemberId,
      amount: 15000,
    },
    members,
    currency: 'JPY',
  },
}

export const USD: Story = {
  args: {
    settlement: {
      from: 'm2' as MemberId,
      to: 'm1' as MemberId,
      amount: 45.5,
    },
    members,
    currency: 'USD',
  },
}

export const MultipleSettlements: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <SettlementItem
        settlement={{
          from: 'm3' as MemberId,
          to: 'm1' as MemberId,
          amount: 7700,
        }}
        members={members}
        currency="JPY"
      />
      <SettlementItem
        settlement={{
          from: 'm3' as MemberId,
          to: 'm2' as MemberId,
          amount: 3900,
        }}
        members={members}
        currency="JPY"
      />
    </div>
  ),
}
