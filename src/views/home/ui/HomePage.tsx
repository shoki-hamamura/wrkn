'use client'

import { CircleHelp, Settings } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useExpenses, useMembers } from '@/entities/warikan'
import { HelpSheet } from '@/features/help'
import { SettingsSheet } from '@/features/settings'
import { Button } from '@/shared/ui'
import { ExpenseList } from '@/widgets/expense-list'
import { GroupList } from '@/widgets/group-list'
import { MemberList } from '@/widgets/member-list'

export function HomePage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const members = useMembers()
  const expenses = useExpenses()

  const canShowResult = members.length > 0 && expenses.length > 0

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">なかよしわりかん</h1>
        <div className="flex items-center gap-1">
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

      <main className="space-y-8">
        <MemberList />
        <GroupList />
        <ExpenseList />

        {canShowResult && (
          <Link href="/settlement" className="block">
            <Button className="w-full" size="lg">
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
