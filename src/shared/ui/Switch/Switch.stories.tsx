import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  component: Switch,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    label: 'スイッチ',
  },
}

export const Checked: Story = {
  args: {
    label: 'オン',
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  args: {
    label: '無効',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    label: '無効（オン）',
    defaultChecked: true,
    disabled: true,
  },
}

export const WithoutLabel: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Controlled: Story = {
  render: function ControlledSwitch() {
    const [checked, setChecked] = useState(false)
    return (
      <Switch
        label={checked ? 'オン' : 'オフ'}
        checked={checked}
        onCheckedChange={setChecked}
      />
    )
  },
}

export const FormExample: Story = {
  render: function FormExample() {
    return (
      <form className="space-y-4">
        <Switch label="通知を受け取る" name="notifications" defaultChecked />
        <Switch label="ダークモード" name="darkMode" />
        <Switch label="自動保存" name="autoSave" defaultChecked />
      </form>
    )
  },
}
