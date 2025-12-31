import type { Meta, StoryObj } from '@storybook/react'
import { CopyButton } from './CopyButton'

const meta: Meta<typeof CopyButton> = {
  component: CopyButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CopyButton>

export const Default: Story = {
  args: {
    text: 'コピーするテキスト',
  },
}

export const Secondary: Story = {
  args: {
    text: 'コピーするテキスト',
    variant: 'secondary',
  },
}

export const WithCustomLabel: Story = {
  args: {
    text: 'コピーするテキスト',
    children: 'クリップボードにコピー',
  },
}

export const FullWidth: Story = {
  args: {
    text: 'コピーするテキスト',
    className: 'w-full',
  },
}
