import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCalculator } from './use-calculator'

describe('useCalculator', () => {
  it('starts with 0', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.numericValue).toBe(0)
    expect(result.current.displayValue).toBe('0')
  })

  it('starts with initial value', () => {
    const { result } = renderHook(() => useCalculator(1000))
    expect(result.current.numericValue).toBe(1000)
  })

  it('handles single digit', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleKey('5')
    })

    expect(result.current.numericValue).toBe(5)
  })

  it('handles multiple digits', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleKey('1')
      result.current.handleKey('5')
      result.current.handleKey('0')
      result.current.handleKey('0')
      result.current.handleKey('0')
    })

    expect(result.current.numericValue).toBe(15000)
  })

  it('handles 00 key', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleKey('1')
      result.current.handleKey('00')
    })

    expect(result.current.numericValue).toBe(100)
  })

  it('does not add 00 to initial 0', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleKey('00')
    })

    expect(result.current.numericValue).toBe(0)
  })

  it('handles backspace', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleKey('1')
      result.current.handleKey('5')
      result.current.handleKey('0')
      result.current.handleKey('backspace')
    })

    expect(result.current.numericValue).toBe(15)
  })

  it('handles backspace to 0', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleKey('5')
      result.current.handleKey('backspace')
    })

    expect(result.current.numericValue).toBe(0)
  })

  it('handles clear', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleKey('1')
      result.current.handleKey('5')
      result.current.handleKey('0')
      result.current.handleKey('0')
      result.current.handleKey('0')
      result.current.clear()
    })

    expect(result.current.numericValue).toBe(0)
  })

  it('limits max digits', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.handleKey('9')
      }
    })

    expect(result.current.numericValue.toString().length).toBeLessThanOrEqual(
      10,
    )
  })

  it('formats display value with commas', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleKey('1')
      result.current.handleKey('5')
      result.current.handleKey('0')
      result.current.handleKey('0')
      result.current.handleKey('0')
    })

    expect(result.current.displayValue).toBe('15,000')
  })

  it('replaces initial 0 with first digit', () => {
    const { result } = renderHook(() => useCalculator())

    act(() => {
      result.current.handleKey('0')
      result.current.handleKey('0')
      result.current.handleKey('5')
    })

    expect(result.current.numericValue).toBe(5)
  })
})
