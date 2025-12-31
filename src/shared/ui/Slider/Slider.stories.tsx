import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Slider } from './Slider'

const meta: Meta<typeof Slider> = {
  component: Slider,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: function DefaultSlider() {
    const [value, setValue] = useState(50)
    return <Slider value={value} onChange={setValue} />
  },
}

export const WithValue: Story = {
  render: function WithValueSlider() {
    const [value, setValue] = useState(50)
    return <Slider value={value} onChange={setValue} showValue />
  },
}

export const BiasSlider: Story = {
  render: function BiasSlider() {
    const [value, setValue] = useState(1.0)
    return (
      <div className="w-64 space-y-2">
        <span className="text-sm font-medium">負担割合</span>
        <Slider
          value={value}
          onChange={setValue}
          min={0.5}
          max={2.0}
          step={0.1}
          showValue
        />
        <p className="text-sm text-neutral-500">{value}倍</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => <Slider value={50} onChange={() => {}} disabled />,
}

export const CustomRange: Story = {
  render: function CustomRangeSlider() {
    const [value, setValue] = useState(1000)
    return (
      <div className="w-64 space-y-2">
        <Slider
          value={value}
          onChange={setValue}
          min={0}
          max={10000}
          step={100}
          showValue
        />
        <p className="text-sm text-neutral-500">¥{value.toLocaleString()}</p>
      </div>
    )
  },
}
