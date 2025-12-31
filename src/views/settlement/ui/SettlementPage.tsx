'use client'

import Link from 'next/link'
import { Button } from '@/shared/ui'
import { SettlementResult } from '@/widgets/settlement-result'

export function SettlementPage() {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-white px-4 py-6 dark:bg-neutral-900">
      <header className="mb-6 flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" aria-label="戻る">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          精算結果
        </h1>
      </header>

      <main>
        <SettlementResult />
      </main>
    </div>
  )
}
