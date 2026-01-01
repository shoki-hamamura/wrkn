'use client'

import { CircleHelp, Settings } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useExpenses, useMembers } from '@/entities/warikan'
import { HelpSheet } from '@/features/help'
import { SettingsSheet } from '@/features/settings'
import type { KeyboardShortcut } from '@/shared/lib'
import { useKeyboardShortcuts } from '@/shared/lib'
import { Button } from '@/shared/ui'
import { ExpenseList } from '@/widgets/expense-list'
import { GroupList } from '@/widgets/group-list'
import { MemberList } from '@/widgets/member-list'

export function HomePage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const members = useMembers()
  const expenses = useExpenses()

  const shortcuts = useMemo<KeyboardShortcut[]>(
    () => [
      {
        key: '?',
        shift: true,
        action: () => setHelpOpen(true),
        description: 'ヘルプを開く',
      },
      {
        key: ',',
        ctrlOrMeta: true,
        action: () => setSettingsOpen(true),
        description: '設定を開く',
      },
    ],
    [],
  )

  useKeyboardShortcuts(shortcuts)

  const canShowResult = members.length > 0 && expenses.length > 0

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background px-4 py-6">
      <header className="relative mb-8 hidden items-center justify-center lg:flex">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-md">
            <span className="text-2xl font-bold text-white">¥</span>
          </div>
          <h1 className="text-3xl font-black italic text-foreground">
            なかよしわりかん
          </h1>
        </div>
        <div className="absolute right-0 top-0 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHelpOpen(true)}
            aria-label="ヘルプ"
          >
            <CircleHelp className="size-5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            aria-label="設定"
          >
            <Settings className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="mb-4 flex justify-end gap-1 lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setHelpOpen(true)}
          aria-label="ヘルプ"
        >
          <CircleHelp className="size-5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSettingsOpen(true)}
          aria-label="設定"
        >
          <Settings className="size-5" aria-hidden="true" />
        </Button>
      </div>

      <main className="space-y-8">
        <MemberList />
        <GroupList />
        <ExpenseList />

        {canShowResult && (
          <Link href="/settlement" className="block">
            <Button className="w-full font-semibold" size="lg">
              💰 精算結果を見る
            </Button>
          </Link>
        )}
      </main>

      <HelpSheet open={helpOpen} onOpenChange={setHelpOpen} />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
