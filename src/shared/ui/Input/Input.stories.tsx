import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello World',
  },
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'メンバー名を入力',
  },
}

export const Error: Story = {
  args: {
    defaultValue: 'Invalid value',
    error: true,
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: 'Disabled input',
    disabled: true,
  },
}

export const Numeric: Story = {
  args: {
    type: 'text',
    inputMode: 'numeric',
    placeholder: '金額を入力',
  },
}
