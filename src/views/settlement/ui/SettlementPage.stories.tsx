import type { Meta, StoryObj } from '@storybook/react'
import { useWarikanStore } from '@/entities/warikan'
import { SettlementPage } from './SettlementPage'

const meta: Meta<typeof SettlementPage> = {
  component: SettlementPage,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
}

export default meta
type Story = StoryObj<typeof SettlementPage>

export const Empty: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      return <Story />
    },
  ],
}

export const WithSettlements: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('花子')
      useWarikanStore.getState().addMember('次郎')

      const members = useWarikanStore.getState().members
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
          participants: [],
        })
      }
      return <Story />
    },
  ],
}

export const WithBias: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('花子')
      useWarikanStore.getState().addMember('次郎')

      const members = useWarikanStore.getState().members
      if (members[0] && members[1] && members[2]) {
        useWarikanStore.getState().updateMemberBias(members[1].id, 1.5)
        useWarikanStore.getState().updateMemberBias(members[2].id, 0.7)
        useWarikanStore.getState().addExpense({
          name: '飲み会',
          amount: 23000,
          paidBy: members[0].id,
          participants: [],
        })
      }
      return <Story />
    },
  ],
}
