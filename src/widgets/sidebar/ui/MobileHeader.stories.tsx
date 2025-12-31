import type { Meta, StoryObj } from '@storybook/react'
import { MobileHeader } from './MobileHeader'

const meta: Meta<typeof MobileHeader> = {
  component: MobileHeader,
  tags: ['autodocs'],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-background">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MobileHeader>

export const Default: Story = {}
