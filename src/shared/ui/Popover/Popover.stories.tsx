import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../Button'
import { Slider } from '../Slider'
import { Popover, PopoverHeader, PopoverTitle } from './Popover'

const meta: Meta<typeof Popover> = {
  component: Popover,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <div className="p-20">
      <Popover trigger={<Button variant="secondary">開く</Button>}>
        <p className="text-sm">ポップオーバーのコンテンツ</p>
      </Popover>
    </div>
  ),
}

export const WithHeader: Story = {
  render: () => (
    <div className="p-20">
      <Popover trigger={<Button variant="secondary">太郎</Button>}>
        <PopoverHeader>
          <PopoverTitle>太郎</PopoverTitle>
        </PopoverHeader>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          負担割合を調整できます
        </p>
      </Popover>
    </div>
  ),
}

export const BiasAdjustment: Story = {
  render: function BiasPopover() {
    const [bias, setBias] = useState(1.0)
    return (
      <div className="p-20">
        <Popover trigger={<Button variant="secondary">太郎 ({bias}x)</Button>}>
          <PopoverHeader>
            <PopoverTitle>太郎</PopoverTitle>
          </PopoverHeader>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="bias-slider"
                className="mb-2 block text-sm font-medium"
              >
                負担割合
              </label>
              <Slider
                id="bias-slider"
                value={bias}
                onChange={setBias}
                min={0.5}
                max={2.0}
                step={0.1}
                showValue
              />
              <p className="mt-1 text-center text-lg font-semibold">{bias}倍</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">プリセット</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBias(1.5)}
                >
                  飲む人
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBias(0.7)}
                >
                  飲まない
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBias(0.8)}
                >
                  幹事
                </Button>
              </div>
            </div>
          </div>
        </Popover>
      </div>
    )
  },
}

export const Controlled: Story = {
  render: function ControlledPopover() {
    const [open, setOpen] = useState(false)
    return (
      <div className="space-y-4 p-20">
        <Button variant="secondary" onClick={() => setOpen(!open)}>
          外部トグル
        </Button>
        <Popover
          trigger={<Button>ポップオーバー</Button>}
          open={open}
          onOpenChange={setOpen}
        >
          <p className="text-sm">制御されたポップオーバー</p>
          <Button size="sm" className="mt-2" onClick={() => setOpen(false)}>
            閉じる
          </Button>
        </Popover>
      </div>
    )
  },
}

export const AlignStart: Story = {
  render: () => (
    <div className="flex justify-center p-20">
      <Popover
        trigger={<Button variant="secondary">左揃え</Button>}
        align="start"
      >
        <p className="text-sm">左揃えのポップオーバー</p>
      </Popover>
    </div>
  ),
}

export const AlignEnd: Story = {
  render: () => (
    <div className="flex justify-center p-20">
      <Popover
        trigger={<Button variant="secondary">右揃え</Button>}
        align="end"
      >
        <p className="text-sm">右揃えのポップオーバー</p>
      </Popover>
    </div>
  ),
}
