'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import type { KeyboardShortcut } from '@/shared/lib'
import { useKeyboardShortcuts } from '@/shared/lib'
import { AppLogo, Button } from '@/shared/ui'
import { SettlementResult } from '@/widgets/settlement-result'

export function SettlementPage() {
  const router = useRouter()

  const shortcuts = useMemo<KeyboardShortcut[]>(
    () => [
      {
        key: 'Escape',
        action: () => router.push('/'),
        description: 'ホームに戻る',
      },
    ],
    [router],
  )

  useKeyboardShortcuts(shortcuts)

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background px-4 py-6">
      <header className="mb-6">
        <div className="mb-4 hidden justify-center lg:flex">
          <Link href="/">
            <AppLogo size="sm" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" aria-label="戻る">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">精算結果</h1>
        </div>
      </header>

      <main>
        <SettlementResult />
      </main>
    </div>
  )
}
