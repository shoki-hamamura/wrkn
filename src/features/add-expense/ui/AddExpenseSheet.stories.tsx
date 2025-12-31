import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { getCurrentSession, useWarikanStore } from '@/entities/warikan'
import { Button } from '@/shared/ui'
import { AddExpenseSheet } from './AddExpenseSheet'

const meta: Meta<typeof AddExpenseSheet> = {
  component: AddExpenseSheet,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('花子')
      useWarikanStore.getState().addMember('次郎')
      return <Story />
    },
  ],
}

export default meta
type Story = StoryObj<typeof AddExpenseSheet>

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>会計を追加</Button>
        <AddExpenseSheet open={open} onOpenChange={setOpen} />
      </>
    )
  },
}

export const Editing: Story = {
  render: function EditingStory() {
    const [open, setOpen] = useState(true)
    const members = useWarikanStore((s) => getCurrentSession(s)?.members ?? [])
    const firstMember = members[0]

    if (!firstMember) return <div>メンバーがありません</div>

    return (
      <AddExpenseSheet
        open={open}
        onOpenChange={setOpen}
        editingExpense={{
          id: 'exp1' as never,
          name: '1次会',
          amount: 15000,
          paidBy: firstMember.id,
          participants: [],
          createdAt: Date.now(),
        }}
      />
    )
  },
}
