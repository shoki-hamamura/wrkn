import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

vi.mock('./useMediaQuery', () => ({
  useIsDesktop: () => true,
}))

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls action when matching key is pressed', () => {
    const action = vi.fn()
    const shortcuts = [{ key: 'a', action, description: 'Test action' }]

    renderHook(() => useKeyboardShortcuts(shortcuts))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
      )
    })

    expect(action).toHaveBeenCalledTimes(1)
  })

  it('does not call action when different key is pressed', () => {
    const action = vi.fn()
    const shortcuts = [{ key: 'a', action, description: 'Test action' }]

    renderHook(() => useKeyboardShortcuts(shortcuts))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', bubbles: true }),
      )
    })

    expect(action).not.toHaveBeenCalled()
  })

  it('handles ctrlOrMeta modifier', () => {
    const action = vi.fn()
    const shortcuts = [
      { key: ',', ctrlOrMeta: true, action, description: 'Open settings' },
    ]

    renderHook(() => useKeyboardShortcuts(shortcuts))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ',',
          ctrlKey: true,
          bubbles: true,
        }),
      )
    })

    expect(action).toHaveBeenCalledTimes(1)
  })

  it('does not call action without required ctrlOrMeta', () => {
    const action = vi.fn()
    const shortcuts = [
      { key: ',', ctrlOrMeta: true, action, description: 'Open settings' },
    ]

    renderHook(() => useKeyboardShortcuts(shortcuts))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: ',', bubbles: true }),
      )
    })

    expect(action).not.toHaveBeenCalled()
  })

  it('handles shift modifier', () => {
    const action = vi.fn()
    const shortcuts = [
      { key: '?', shift: true, action, description: 'Open help' },
    ]

    renderHook(() => useKeyboardShortcuts(shortcuts))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '?',
          shiftKey: true,
          bubbles: true,
        }),
      )
    })

    expect(action).toHaveBeenCalledTimes(1)
  })

  it('is case insensitive for key matching', () => {
    const action = vi.fn()
    const shortcuts = [{ key: 'Escape', action, description: 'Close' }]

    renderHook(() => useKeyboardShortcuts(shortcuts))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'escape', bubbles: true }),
      )
    })

    expect(action).toHaveBeenCalledTimes(1)
  })

  it('removes event listener on unmount', () => {
    const action = vi.fn()
    const shortcuts = [{ key: 'a', action, description: 'Test' }]

    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts))

    unmount()

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
      )
    })

    expect(action).not.toHaveBeenCalled()
  })

  describe('input focus handling', () => {
    it('does not call action when INPUT element is focused', () => {
      const action = vi.fn()
      const shortcuts = [{ key: 'a', action, description: 'Test' }]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      act(() => {
        input.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
        )
      })

      expect(action).not.toHaveBeenCalled()
      document.body.removeChild(input)
    })

    it('does not call action when TEXTAREA element is focused', () => {
      const action = vi.fn()
      const shortcuts = [{ key: 'a', action, description: 'Test' }]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.focus()

      act(() => {
        textarea.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
        )
      })

      expect(action).not.toHaveBeenCalled()
      document.body.removeChild(textarea)
    })

    it('does not call action when contentEditable element is focused', () => {
      const action = vi.fn()
      const shortcuts = [{ key: 'a', action, description: 'Test' }]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      const div = document.createElement('div')
      Object.defineProperty(div, 'isContentEditable', {
        value: true,
        writable: false,
      })
      div.tabIndex = 0
      document.body.appendChild(div)
      div.focus()

      act(() => {
        div.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
        )
      })

      expect(action).not.toHaveBeenCalled()
      document.body.removeChild(div)
    })
  })
})
