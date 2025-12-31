import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: '1.5x',
  },
}

export const Secondary: Story = {
  args: {
    children: '0.8x',
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: '幹事',
    variant: 'outline',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">1.5x</Badge>
      <Badge variant="secondary">0.8x</Badge>
      <Badge variant="outline">幹事</Badge>
    </div>
  ),
}
