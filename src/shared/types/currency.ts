export type CurrencyCode = 'JPY' | 'USD' | 'EUR' | 'GBP' | 'CNY' | 'KRW' | 'TWD'

export type RoundingUnit = 1 | 10 | 100

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  name: string
  decimalPlaces: number
  locale: string
}
