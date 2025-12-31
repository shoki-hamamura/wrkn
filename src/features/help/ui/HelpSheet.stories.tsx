import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '@/shared/ui'
import { HelpSheet } from './HelpSheet'

const meta: Meta<typeof HelpSheet> = {
  component: HelpSheet,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HelpSheet>

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="ghost" onClick={() => setOpen(true)}>
          ❓ ヘルプ
        </Button>
        <HelpSheet open={open} onOpenChange={setOpen} />
      </>
    )
  },
}
