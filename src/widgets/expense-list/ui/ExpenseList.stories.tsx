import type { Meta, StoryObj } from '@storybook/react'
import { getCurrentSession, useWarikanStore } from '@/entities/warikan'
import { ExpenseList } from './ExpenseList'

const meta: Meta<typeof ExpenseList> = {
  component: ExpenseList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ExpenseList>

export const Empty: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('花子')
      return <Story />
    },
  ],
}

export const NoMembers: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      return <Story />
    },
  ],
}

export const WithExpenses: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('花子')
      useWarikanStore.getState().addMember('次郎')

      const members =
        getCurrentSession(useWarikanStore.getState())?.members ?? []
      if (members[0] && members[1]) {
        useWarikanStore.getState().addExpense({
          name: '1次会',
          amount: 15000,
          paidBy: members[0].id,
          participants: [],
        })
        useWarikanStore.getState().addExpense({
          name: '2次会',
          amount: 8000,
          paidBy: members[1].id,
          participants: [members[0].id, members[1].id],
        })
      }
      return <Story />
    },
  ],
}
