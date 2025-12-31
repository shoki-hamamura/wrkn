'use client'

import { CURRENCIES } from '@/shared/constants'
import type { CurrencyCode, RoundingUnit } from '@/shared/types'
import { Button, RadioGroup, Sheet } from '@/shared/ui'
import { useCurrency, useRoundingUnit, useWarikanActions } from '@/entities/warikan'

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

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const currency = useCurrency()
  const roundingUnit = useRoundingUnit()
  const { setCurrency, setRoundingUnit, reset } = useWarikanActions()

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
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              通貨
            </label>
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
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              端数の単位
            </label>
            <RadioGroup
              name="roundingUnit"
              value={roundingUnit.toString()}
              options={roundingOptions}
              onChange={(value) => setRoundingUnit(Number(value) as RoundingUnit)}
            />
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              ※ 端数は切り上げされます（立替者が損しないように）
            </p>
          </div>

          <div className="border-t border-neutral-200 pt-6 dark:border-neutral-700">
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              データ
            </label>
            <Button variant="danger" onClick={handleReset} className="w-full">
              データをリセット
            </Button>
          </div>
        </div>
      </Sheet.Content>
    </Sheet.Root>
  )
}
