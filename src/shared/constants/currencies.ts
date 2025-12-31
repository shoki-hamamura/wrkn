import type { CurrencyCode, CurrencyConfig } from '@/shared/types/currency'

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: '日本円',
    decimalPlaces: 0,
    locale: 'ja-JP',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: '米ドル',
    decimalPlaces: 2,
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'ユーロ',
    decimalPlaces: 2,
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: '英ポンド',
    decimalPlaces: 2,
    locale: 'en-GB',
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: '人民元',
    decimalPlaces: 2,
    locale: 'zh-CN',
  },
  KRW: {
    code: 'KRW',
    symbol: '₩',
    name: '韓国ウォン',
    decimalPlaces: 0,
    locale: 'ko-KR',
  },
  TWD: {
    code: 'TWD',
    symbol: 'NT$',
    name: '台湾ドル',
    decimalPlaces: 0,
    locale: 'zh-TW',
  },
}

export const DEFAULT_CURRENCY: CurrencyCode = 'JPY'
export const DEFAULT_ROUNDING_UNIT = 10 as const
