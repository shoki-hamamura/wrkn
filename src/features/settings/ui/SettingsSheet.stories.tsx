import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '@/shared/ui'
import { SettingsSheet } from './SettingsSheet'

const meta: Meta<typeof SettingsSheet> = {
  component: SettingsSheet,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SettingsSheet>

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="ghost" onClick={() => setOpen(true)}>
          ⚙️ 設定
        </Button>
        <SettingsSheet open={open} onOpenChange={setOpen} />
      </>
    )
  },
}
