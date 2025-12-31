import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'

const meta: Meta<typeof Card> = {
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>1次会</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">¥15,000</p>
        <p>立替: 太郎</p>
        <p>参加: 全員</p>
      </CardContent>
    </Card>
  ),
}

export const Clickable: Story = {
  render: () => (
    <Card asButton onClick={() => alert('clicked!')}>
      <CardHeader>
        <CardTitle>2次会</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">¥8,000</p>
        <p>立替: 花子</p>
        <p>参加: 太郎, 花子</p>
      </CardContent>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card>
      <p className="font-medium">シンプルなカード</p>
      <p className="text-sm text-neutral-500">説明テキスト</p>
    </Card>
  ),
}

export const MultipleCards: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>1次会</CardTitle>
        </CardHeader>
        <CardContent>¥15,000</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>2次会</CardTitle>
        </CardHeader>
        <CardContent>¥8,000</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>タクシー</CardTitle>
        </CardHeader>
        <CardContent>¥2,000</CardContent>
      </Card>
    </div>
  ),
}
