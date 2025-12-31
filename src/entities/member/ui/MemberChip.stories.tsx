import type { Meta, StoryObj } from '@storybook/react'
import type { MemberId } from '@/shared/types'
import { MemberChip } from './MemberChip'

const meta: Meta<typeof MemberChip> = {
  component: MemberChip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MemberChip>

const createMember = (name: string, bias = 1.0) => ({
  id: crypto.randomUUID() as MemberId,
  name,
  bias,
})

export const Default: Story = {
  args: {
    member: createMember('太郎'),
  },
}

export const WithBias: Story = {
  args: {
    member: createMember('花子', 1.5),
  },
}

export const LowBias: Story = {
  args: {
    member: createMember('次郎', 0.7),
  },
}

export const LongName: Story = {
  args: {
    member: createMember('とても長い名前のメンバー'),
  },
}

export const Removable: Story = {
  args: {
    member: createMember('太郎'),
    onRemove: () => alert('removed!'),
  },
}

export const Clickable: Story = {
  args: {
    member: createMember('太郎', 1.5),
    onClick: () => alert('clicked!'),
  },
}

export const ClickableAndRemovable: Story = {
  args: {
    member: createMember('太郎', 1.5),
    onClick: () => alert('clicked!'),
    onRemove: () => alert('removed!'),
  },
}

export const HideBias: Story = {
  args: {
    member: createMember('太郎', 1.5),
    showBias: false,
  },
}

export const MultipleMembers: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <MemberChip member={createMember('太郎')} onRemove={() => {}} />
      <MemberChip member={createMember('花子', 1.5)} onRemove={() => {}} />
      <MemberChip member={createMember('次郎', 0.7)} onRemove={() => {}} />
      <MemberChip member={createMember('四郎', 0.8)} onRemove={() => {}} />
    </div>
  ),
}
