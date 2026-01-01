'use client'

import { Download, X } from 'lucide-react'
import { useState } from 'react'
import { usePwaInstall } from '@/shared/lib'
import { Button } from '@/shared/ui'

const DISMISSED_KEY = 'pwa-install-dismissed'

export function InstallBanner() {
  const { canInstall, install } = usePwaInstall()
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(DISMISSED_KEY) === 'true'
  })

  if (!canInstall || isDismissed) {
    return null
  }

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setIsDismissed(true)
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, 'true')
    setIsDismissed(true)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-fade-in rounded-xl border border-border bg-surface p-4 shadow-lg lg:bottom-6 lg:left-auto lg:right-6">
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
          onClick={handleDismiss}
          className="shrink-0 rounded-md p-1 text-foreground-muted transition-colors hover:bg-background hover:text-foreground"
          aria-label="閉じる"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="flex-1"
        >
          あとで
        </Button>
        <Button onClick={handleInstall} size="sm" className="flex-1">
          インストール
        </Button>
      </div>
    </div>
  )
}
