'use client'

import { useEffect } from 'react'
import { useIsDesktop } from '@/shared/lib'

interface UseCalculatorKeyboardOptions {
  onKey: (key: string) => void
}

export function useCalculatorKeyboard({
  onKey,
}: UseCalculatorKeyboardOptions): void {
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (!isDesktop) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isInputFocused =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (isInputFocused) return

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault()
        onKey(event.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDesktop, onKey])
}
