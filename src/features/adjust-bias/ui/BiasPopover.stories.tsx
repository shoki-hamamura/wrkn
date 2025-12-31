import type { Meta, StoryObj } from '@storybook/react'
import type { MemberId } from '@/shared/types'
import { Button } from '@/shared/ui'
import { MemberChip } from '@/entities/member'
import { BiasPopover } from './BiasPopover'

const meta: Meta<typeof BiasPopover> = {
  component: BiasPopover,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-20">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BiasPopover>

const member = {
  id: 'm1' as MemberId,
  name: '太郎',
  bias: 1.0,
}

export const Default: Story = {
  args: {
    member,
    trigger: <Button variant="secondary">太郎</Button>,
  },
}

export const WithBias: Story = {
  args: {
    member: { ...member, bias: 1.5 },
    trigger: <Button variant="secondary">太郎 (1.5x)</Button>,
  },
}

export const WithMemberChip: Story = {
  args: {
    member,
    trigger: <MemberChip member={member} />,
  },
}
