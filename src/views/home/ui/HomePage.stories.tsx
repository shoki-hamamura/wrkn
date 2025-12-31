import type { Meta, StoryObj } from '@storybook/react'
import { useWarikanStore } from '@/entities/warikan'
import { HomePage } from './HomePage'

const meta: Meta<typeof HomePage> = {
  component: HomePage,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
}

export default meta
type Story = StoryObj<typeof HomePage>

export const Empty: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      return <Story />
    },
  ],
}

export const WithData: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('花子')
      useWarikanStore.getState().addMember('次郎')

      const members = useWarikanStore.getState().members
      if (members[0] && members[1]) {
        useWarikanStore.getState().updateMemberBias(members[1].id, 1.5)
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
