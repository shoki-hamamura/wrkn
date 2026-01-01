import type { Meta, StoryObj } from '@storybook/react'
import { Download, X } from 'lucide-react'
import { Button } from '@/shared/ui'

const MockInstallBanner = () => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-fade-in rounded-xl border border-border bg-surface p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Download className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            アプリをインストール
          </p>
          <p className="mt-0.5 text-xs text-foreground-muted">
            ホーム画面に追加してすぐにアクセス
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md p-1 text-foreground-muted transition-colors hover:bg-background hover:text-foreground"
          aria-label="閉じる"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1">
          あとで
        </Button>
        <Button size="sm" className="flex-1">
          インストール
        </Button>
      </div>
    </div>
  )
}

const meta: Meta<typeof MockInstallBanner> = {
  title: 'features/pwa-install/InstallBanner',
  component: MockInstallBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative h-96 bg-background">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MockInstallBanner>

export const Default: Story = {}
