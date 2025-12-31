import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    label: 'チェックボックス',
  },
}

export const Checked: Story = {
  args: {
    label: 'チェック済み',
    checked: true,
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
    label: '無効（チェック済み）',
    checked: true,
    disabled: true,
  },
}

export const WithoutLabel: Story = {
  args: {
    checked: true,
  },
}

export const Controlled: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        label={checked ? 'チェック済み' : '未チェック'}
        checked={checked}
        onChange={setChecked}
      />
    )
  },
}

export const MemberSelection: Story = {
  render: function MemberSelection() {
    const [selected, setSelected] = useState({
      taro: true,
      hanako: true,
      jiro: false,
    })

    const toggle = (name: keyof typeof selected) => {
      setSelected((prev) => ({ ...prev, [name]: !prev[name] }))
    }

    return (
      <div className="space-y-2">
        <Checkbox
          label="太郎"
          checked={selected.taro}
          onChange={() => toggle('taro')}
        />
        <Checkbox
          label="花子"
          checked={selected.hanako}
          onChange={() => toggle('hanako')}
        />
        <Checkbox
          label="次郎"
          checked={selected.jiro}
          onChange={() => toggle('jiro')}
        />
      </div>
    )
  },
}
