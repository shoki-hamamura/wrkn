import { CURRENCIES } from '@/shared/constants/currencies'
import type { CurrencyCode } from '@/shared/types/currency'

export function formatAmount(amount: number, currency: CurrencyCode): string {
  const config = CURRENCIES[currency]

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  }).format(amount)
}

export function parseAmount(value: string): number {
  const cleaned = value.replace(/[^\d.-]/g, '')
  const parsed = Number.parseFloat(cleaned)
  return Number.isNaN(parsed) ? 0 : parsed
}
