'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  useCurrency,
  useRoundingUnit,
  useWarikanActions,
} from '@/entities/warikan'
import { CURRENCIES } from '@/shared/constants'
import type { CurrencyCode, RoundingUnit } from '@/shared/types'
import { Button, SegmentedControl, Sheet } from '@/shared/ui'

export interface SettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const currencyOptions = Object.values(CURRENCIES).map((c) => ({
  value: c.code,
  label: `${c.symbol} ${c.name}`,
}))

const roundingOptions: { value: string; label: string }[] = [
  { value: '1', label: '1円' },
  { value: '10', label: '10円' },
  { value: '100', label: '100円' },
]

const themeOptions = [
  { value: 'system', label: '自動', icon: Monitor },
  { value: 'light', label: '明', icon: Sun },
  { value: 'dark', label: '暗', icon: Moon },
] as const

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const currency = useCurrency()
  const roundingUnit = useRoundingUnit()
  const { setCurrency, setRoundingUnit, reset } = useWarikanActions()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleReset = () => {
    if (window.confirm('すべてのデータをリセットしますか？')) {
      reset()
      onOpenChange(false)
    }
  }

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>設定</Sheet.Title>
        </Sheet.Header>

        <div className="space-y-6">
          <div>
            <span className="mb-2 block text-sm font-medium text-foreground-muted">
              テーマ
            </span>
            {mounted ? (
              <SegmentedControl
                name="theme"
                value={theme ?? 'system'}
                options={[...themeOptions]}
                onChange={(value) => setTheme(value)}
              />
            ) : (
              <div className="h-8" />
            )}
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-foreground-muted">
              通貨
            </span>
            <div className="grid grid-cols-2 gap-2">
              {currencyOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={currency === option.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrency(option.value as CurrencyCode)}
                  className="justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-foreground-muted">
              端数の単位
            </span>
            <SegmentedControl
              name="roundingUnit"
              value={roundingUnit.toString()}
              options={roundingOptions}
              onChange={(value) =>
                setRoundingUnit(Number(value) as RoundingUnit)
              }
            />
            <p className="mt-2 text-sm text-foreground-subtle">
              ※ 端数は切り上げされます（立替者が損しないように）
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <span className="mb-2 block text-sm font-medium text-foreground-muted">
              データ
            </span>
            <Button variant="danger" onClick={handleReset} className="w-full">
              データをリセット
            </Button>
          </div>
        </div>
      </Sheet.Content>
    </Sheet.Root>
  )
}
