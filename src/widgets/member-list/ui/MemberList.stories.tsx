import type { Meta, StoryObj } from '@storybook/react'
import { useWarikanStore } from '@/entities/warikan'
import { MemberList } from './MemberList'

const meta: Meta<typeof MemberList> = {
  component: MemberList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MemberList>

export const Empty: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      return <Story />
    },
  ],
}

export const WithMembers: Story = {
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

export const WithBias: Story = {
  decorators: [
    (Story) => {
      useWarikanStore.getState().reset()
      useWarikanStore.getState().addMember('太郎')
      useWarikanStore.getState().addMember('花子')
      useWarikanStore.getState().addMember('次郎')
      const members = useWarikanStore.getState().members
      if (members[1]) {
        useWarikanStore.getState().updateMemberBias(members[1].id, 1.5)
      }
      if (members[2]) {
        useWarikanStore.getState().updateMemberBias(members[2].id, 0.7)
      }
      return <Story />
    },
  ],
}
