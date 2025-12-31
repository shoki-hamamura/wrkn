import type { Meta, StoryObj } from '@storybook/react'
import { AddMemberInput } from './AddMemberInput'

const meta: Meta<typeof AddMemberInput> = {
  component: AddMemberInput,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AddMemberInput>

export const Default: Story = {}

export const InContext: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white py-1 pr-1 pl-3">
        <span className="text-sm font-medium">太郎</span>
      </div>
      <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white py-1 pr-1 pl-3">
        <span className="text-sm font-medium">花子</span>
      </div>
      <AddMemberInput />
    </div>
  ),
}
