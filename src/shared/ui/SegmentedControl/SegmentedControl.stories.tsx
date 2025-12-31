import type { Meta, StoryObj } from '@storybook/react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { SegmentedControl } from './SegmentedControl'

const meta: Meta<typeof SegmentedControl> = {
  component: SegmentedControl,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SegmentedControl<string>>

export const Default: Story = {
  render: function DefaultSegmented() {
    const [value, setValue] = useState('light')
    return (
      <SegmentedControl
        name="theme"
        value={value}
        options={[
          { value: 'light', label: 'ライト' },
          { value: 'dark', label: 'ダーク' },
        ]}
        onChange={setValue}
      />
    )
  },
}

export const ThreeOptions: Story = {
  render: function ThreeOptionsSegmented() {
    const [value, setValue] = useState('10')
    return (
      <SegmentedControl
        name="unit"
        value={value}
        options={[
          { value: '1', label: '1円' },
          { value: '10', label: '10円' },
          { value: '100', label: '100円' },
        ]}
        onChange={setValue}
      />
    )
  },
}

export const WithIcons: Story = {
  render: function WithIconsSegmented() {
    const [value, setValue] = useState('system')
    return (
      <SegmentedControl
        name="theme"
        value={value}
        options={[
          { value: 'system', label: '自動', icon: Monitor },
          { value: 'light', label: '明', icon: Sun },
          { value: 'dark', label: '暗', icon: Moon },
        ]}
        onChange={setValue}
      />
    )
  },
}

export const Interactive: Story = {
  render: function InteractiveSegmented() {
    const [value, setValue] = useState('system')
    return (
      <div className="space-y-4">
        <p className="text-sm text-foreground-muted">テーマを選択:</p>
        <SegmentedControl
          name="theme"
          value={value}
          options={[
            { value: 'system', label: '自動', icon: Monitor },
            { value: 'light', label: '明', icon: Sun },
            { value: 'dark', label: '暗', icon: Moon },
          ]}
          onChange={setValue}
        />
        <p className="text-sm">
          選択中: <span className="font-medium">{value}</span>
        </p>
      </div>
    )
  },
}
