'use client'

import Link from 'next/link'
import { useExpenses, useMembers } from '@/entities/warikan'
import { Button } from '@/shared/ui'

export function SettlementButton() {
  const members = useMembers()
  const expenses = useExpenses()

  const canShowResult = members.length > 0 && expenses.length > 0

  if (!canShowResult) {
    return null
  }

  return (
    <Link href="/settlement" className="block">
      <Button className="w-full font-semibold" size="lg">
        💰 精算結果を見る
      </Button>
    </Link>
  )
}
