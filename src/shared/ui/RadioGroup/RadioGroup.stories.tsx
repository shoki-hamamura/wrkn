import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { RadioGroup } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup<string>>

export const Default: Story = {
  render: function DefaultRadio() {
    const [value, setValue] = useState('taro')
    return (
      <RadioGroup
        name="payer"
        value={value}
        options={[
          { value: 'taro', label: '太郎' },
          { value: 'hanako', label: '花子' },
          { value: 'jiro', label: '次郎' },
        ]}
        onChange={setValue}
      />
    )
  },
}

export const WithSelection: Story = {
  render: function WithSelectionRadio() {
    const [value, setValue] = useState('hanako')
    return (
      <div className="space-y-4">
        <p className="text-sm text-neutral-500">立て替えた人を選択:</p>
        <RadioGroup
          name="payer"
          value={value}
          options={[
            { value: 'taro', label: '太郎' },
            { value: 'hanako', label: '花子' },
            { value: 'jiro', label: '次郎' },
          ]}
          onChange={setValue}
        />
        <p className="text-sm">選択: {value}</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup
      name="disabled"
      value="taro"
      options={[
        { value: 'taro', label: '太郎' },
        { value: 'hanako', label: '花子' },
      ]}
      onChange={() => {}}
      disabled
    />
  ),
}

export const Vertical: Story = {
  render: function VerticalRadio() {
    const [value, setValue] = useState('1')
    return (
      <RadioGroup
        name="unit"
        value={value}
        options={[
          { value: '1', label: '1円単位' },
          { value: '10', label: '10円単位' },
          { value: '100', label: '100円単位' },
        ]}
        onChange={setValue}
        className="flex-col"
      />
    )
  },
}
