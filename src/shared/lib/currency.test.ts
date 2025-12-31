import { describe, expect, it } from 'vitest'
import { formatAmount, parseAmount } from './currency'

describe('formatAmount', () => {
  it('formats JPY correctly without decimals', () => {
    expect(formatAmount(1000, 'JPY')).toBe('￥1,000')
  })

  it('formats large JPY amounts', () => {
    expect(formatAmount(15000, 'JPY')).toBe('￥15,000')
  })

  it('formats USD with 2 decimals', () => {
    expect(formatAmount(10.5, 'USD')).toBe('$10.50')
  })

  it('formats EUR with 2 decimals', () => {
    expect(formatAmount(10.5, 'EUR')).toMatch(/10,50/)
  })

  it('formats KRW without decimals', () => {
    expect(formatAmount(10000, 'KRW')).toBe('₩10,000')
  })

  it('handles zero', () => {
    expect(formatAmount(0, 'JPY')).toBe('￥0')
  })

  it('handles negative numbers', () => {
    expect(formatAmount(-1000, 'JPY')).toBe('-￥1,000')
  })
})

describe('parseAmount', () => {
  it('parses simple number string', () => {
    expect(parseAmount('1000')).toBe(1000)
  })

  it('parses formatted currency string', () => {
    expect(parseAmount('￥1,000')).toBe(1000)
  })

  it('parses decimal number', () => {
    expect(parseAmount('10.50')).toBe(10.5)
  })

  it('returns 0 for invalid input', () => {
    expect(parseAmount('invalid')).toBe(0)
  })

  it('returns 0 for empty string', () => {
    expect(parseAmount('')).toBe(0)
  })
})
