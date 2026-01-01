import type { Meta, StoryObj } from '@storybook/react'
import { AddItemInput } from './AddItemInput'

const meta: Meta<typeof AddItemInput> = {
  component: AddItemInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AddItemInput>

export const Default: Story = {
  args: {
    placeholder: '名前を入力',
    ariaLabel: 'メンバーを追加',
    addLabel: '追加',
    cancelLabel: 'キャンセル',
  },
}

export const ForGroup: Story = {
  args: {
    placeholder: 'グループ名',
    ariaLabel: 'グループを追加',
    addLabel: '追加',
    cancelLabel: 'キャンセル',
    buttonClassName: 'size-9 p-0',
  },
}
