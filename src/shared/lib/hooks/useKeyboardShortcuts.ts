'use client'

import { useEffect } from 'react'
import { useIsDesktop } from './useMediaQuery'

export interface KeyboardShortcut {
  key: string
  ctrlOrMeta?: boolean
  shift?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
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

      for (const shortcut of shortcuts) {
        const ctrlOrMetaPressed = event.ctrlKey || event.metaKey
        const ctrlOrMetaMatch = shortcut.ctrlOrMeta
          ? ctrlOrMetaPressed
          : !ctrlOrMetaPressed
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()

        if (keyMatch && ctrlOrMetaMatch && shiftMatch) {
          event.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, isDesktop])
}

export const SHORTCUT_KEYS = {
  HELP: '?',
  SETTINGS: ',',
  SETTLEMENT: 's',
} as const
