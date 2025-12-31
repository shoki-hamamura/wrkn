'use client'

import { useCallback, useState } from 'react'

const MAX_DIGITS = 10

export interface UseCalculatorResult {
  displayValue: string
  numericValue: number
  handleKey: (key: string) => void
  clear: () => void
  reset: () => void
}

export function useCalculator(initialValue = 0): UseCalculatorResult {
  const [value, setValue] = useState(initialValue.toString())

  const handleKey = useCallback((key: string) => {
    switch (key) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        setValue((prev) => {
          if (prev === '0') return key
          if (prev.length >= MAX_DIGITS) return prev
          return prev + key
        })
        break
      case '00':
        setValue((prev) => {
          if (prev === '0') return prev
          if (prev.length >= MAX_DIGITS - 1) return prev
          return prev + '00'
        })
        break
      case 'backspace':
      case '⌫':
        setValue((prev) => {
          if (prev.length <= 1) return '0'
          return prev.slice(0, -1)
        })
        break
      case 'clear':
      case 'C':
        setValue('0')
        break
      default:
        break
    }
  }, [])

  const clear = useCallback(() => {
    setValue('0')
  }, [])

  const reset = useCallback(() => {
    setValue('0')
  }, [])

  const numericValue = Number.parseInt(value, 10) || 0
  const displayValue = numericValue.toLocaleString()

  return {
    displayValue,
    numericValue,
    handleKey,
    clear,
    reset,
  }
}
