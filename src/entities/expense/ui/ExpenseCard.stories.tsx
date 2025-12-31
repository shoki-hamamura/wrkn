import type { Meta, StoryObj } from '@storybook/react'
import type { Expense, ExpenseId, Member, MemberId } from '@/shared/types'
import { ExpenseCard } from './ExpenseCard'

const meta: Meta<typeof ExpenseCard> = {
  component: ExpenseCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ExpenseCard>

const members: Member[] = [
  { id: 'm1' as MemberId, name: '太郎', bias: 1.0 },
  { id: 'm2' as MemberId, name: '花子', bias: 1.5 },
  { id: 'm3' as MemberId, name: '次郎', bias: 0.7 },
]

const createExpense = (
  name: string,
  amount: number,
  paidBy: MemberId,
  participants: MemberId[] = []
): Expense => ({
  id: crypto.randomUUID() as ExpenseId,
  name,
  amount,
  paidBy,
  participants,
  createdAt: Date.now(),
})

export const Default: Story = {
  args: {
    expense: createExpense('1次会', 15000, 'm1' as MemberId),
    members,
    currency: 'JPY',
  },
}

export const PartialParticipants: Story = {
  args: {
    expense: createExpense('2次会', 8000, 'm2' as MemberId, [
      'm1' as MemberId,
      'm2' as MemberId,
    ]),
    members,
    currency: 'JPY',
  },
}

export const Editable: Story = {
  args: {
    expense: createExpense('タクシー', 2000, 'm1' as MemberId),
    members,
    currency: 'JPY',
    onEdit: () => alert('edit clicked'),
  },
}

export const Removable: Story = {
  args: {
    expense: createExpense('タクシー', 2000, 'm1' as MemberId),
    members,
    currency: 'JPY',
    onRemove: () => alert('remove clicked'),
  },
}

export const EditableAndRemovable: Story = {
  args: {
    expense: createExpense('1次会', 15000, 'm1' as MemberId),
    members,
    currency: 'JPY',
    onEdit: () => alert('edit clicked'),
    onRemove: () => alert('remove clicked'),
  },
}

export const USD: Story = {
  args: {
    expense: createExpense('Dinner', 120.5, 'm1' as MemberId),
    members,
    currency: 'USD',
  },
}

export const MultipleCards: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <ExpenseCard
        expense={createExpense('1次会', 15000, 'm1' as MemberId)}
        members={members}
        currency="JPY"
        onEdit={() => {}}
        onRemove={() => {}}
      />
      <ExpenseCard
        expense={createExpense('2次会', 8000, 'm2' as MemberId, [
          'm1' as MemberId,
          'm2' as MemberId,
        ])}
        members={members}
        currency="JPY"
        onEdit={() => {}}
        onRemove={() => {}}
      />
      <ExpenseCard
        expense={createExpense('タクシー', 2000, 'm3' as MemberId, ['m3' as MemberId])}
        members={members}
        currency="JPY"
        onEdit={() => {}}
        onRemove={() => {}}
      />
    </div>
  ),
}
