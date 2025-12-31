import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../Button'
import { Input } from '../Input'
import { Sheet } from './Sheet'

const meta: Meta = {
  title: 'shared/ui/Sheet',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: function DefaultSheet() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>シートを開く</Button>
        <Sheet.Root open={open} onOpenChange={setOpen}>
          <Sheet.Content>
            <Sheet.Header>
              <Sheet.Title>シートタイトル</Sheet.Title>
              <Sheet.Description>
                シートの説明文がここに入ります
              </Sheet.Description>
            </Sheet.Header>
            <div className="space-y-4">
              <p>シートのコンテンツ</p>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                閉じる
              </Button>
            </div>
          </Sheet.Content>
        </Sheet.Root>
      </>
    )
  },
}

export const WithForm: Story = {
  render: function FormSheet() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>会計を追加</Button>
        <Sheet.Root open={open} onOpenChange={setOpen}>
          <Sheet.Content>
            <Sheet.Header>
              <Sheet.Title>会計を追加</Sheet.Title>
            </Sheet.Header>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="expense-name"
                  className="mb-1 block text-sm font-medium"
                >
                  名前
                </label>
                <Input id="expense-name" placeholder="1次会" />
              </div>
              <div>
                <label
                  htmlFor="expense-amount"
                  className="mb-1 block text-sm font-medium"
                >
                  金額
                </label>
                <Input
                  id="expense-amount"
                  placeholder="¥0"
                  inputMode="numeric"
                />
              </div>
              <Button className="w-full" onClick={() => setOpen(false)}>
                追加する
              </Button>
            </div>
          </Sheet.Content>
        </Sheet.Root>
      </>
    )
  },
}

export const WithTrigger: Story = {
  render: () => (
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button>トリガー付きシート</Button>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>トリガー付き</Sheet.Title>
        </Sheet.Header>
        <p>Drawer.Trigger を使用したパターン</p>
      </Sheet.Content>
    </Sheet.Root>
  ),
}
