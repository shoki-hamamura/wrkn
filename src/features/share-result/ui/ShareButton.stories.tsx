import type { Meta, StoryObj } from '@storybook/react'
import { ShareButton } from './ShareButton'

const meta: Meta<typeof ShareButton> = {
  component: ShareButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ShareButton>

const sampleText = `【なかよしわりかん】
合計: ￥10,000

💸 送金
・太郎さん → 花子さんへ ￥5,000

https://wrkn-blond.vercel.app/`

export const Default: Story = {
  args: {
    text: sampleText,
  },
}

export const Secondary: Story = {
  args: {
    text: sampleText,
    variant: 'secondary',
  },
}

export const FullWidth: Story = {
  args: {
    text: sampleText,
    variant: 'secondary',
    className: 'w-full',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}
