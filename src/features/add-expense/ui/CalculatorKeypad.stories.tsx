import type { Meta, StoryObj } from '@storybook/react'
import { CalculatorKeypad } from './CalculatorKeypad'

const meta: Meta<typeof CalculatorKeypad> = {
  component: CalculatorKeypad,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CalculatorKeypad>

export const Default: Story = {
  args: {
    onKeyPress: (key) => console.log('Key pressed:', key),
  },
}

export const Compact: Story = {
  args: {
    onKeyPress: (key) => console.log('Key pressed:', key),
    className: 'max-w-xs',
  },
}
