'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/shared/ui'
import { useExpenses, useMembers } from '@/entities/warikan'
import { SettingsSheet } from '@/features/settings'
import { ExpenseList } from '@/widgets/expense-list'
import { MemberList } from '@/widgets/member-list'

export function HomePage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const members = useMembers()
  const expenses = useExpenses()

  const canShowResult = members.length > 0 && expenses.length > 0

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-white px-4 py-6 dark:bg-neutral-900">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          なかよしわりかん
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSettingsOpen(true)}
          aria-label="設定"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </header>

      <main className="space-y-8">
        <MemberList />
        <ExpenseList />

        {canShowResult && (
          <Link href="/settlement" className="block">
            <Button className="w-full" size="lg">
              💰 精算結果を見る
            </Button>
          </Link>
        )}
      </main>

      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
