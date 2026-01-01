import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCalculatorKeyboard } from './use-calculator-keyboard'

vi.mock('@/shared/lib', () => ({
  useIsDesktop: () => true,
}))

describe('useCalculatorKeyboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls onKey when digit key is pressed', () => {
    const onKey = vi.fn()

    renderHook(() => useCalculatorKeyboard({ onKey }))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: '5', bubbles: true }),
      )
    })

    expect(onKey).toHaveBeenCalledWith('5')
  })

  it('calls onKey for all digit keys 0-9', () => {
    const onKey = vi.fn()

    renderHook(() => useCalculatorKeyboard({ onKey }))

    for (let i = 0; i <= 9; i++) {
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: String(i), bubbles: true }),
        )
      })
    }

    expect(onKey).toHaveBeenCalledTimes(10)
  })

  it('does not call onKey for non-digit keys', () => {
    const onKey = vi.fn()

    renderHook(() => useCalculatorKeyboard({ onKey }))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
      )
    })

    expect(onKey).not.toHaveBeenCalled()
  })

  it('removes event listener on unmount', () => {
    const onKey = vi.fn()

    const { unmount } = renderHook(() => useCalculatorKeyboard({ onKey }))

    unmount()

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: '1', bubbles: true }),
      )
    })

    expect(onKey).not.toHaveBeenCalled()
  })

  describe('input focus handling', () => {
    it('does not call onKey when INPUT element is focused', () => {
      const onKey = vi.fn()

      renderHook(() => useCalculatorKeyboard({ onKey }))

      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      act(() => {
        input.dispatchEvent(
          new KeyboardEvent('keydown', { key: '1', bubbles: true }),
        )
      })

      expect(onKey).not.toHaveBeenCalled()
      document.body.removeChild(input)
    })

    it('does not call onKey when TEXTAREA element is focused', () => {
      const onKey = vi.fn()

      renderHook(() => useCalculatorKeyboard({ onKey }))

      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.focus()

      act(() => {
        textarea.dispatchEvent(
          new KeyboardEvent('keydown', { key: '1', bubbles: true }),
        )
      })

      expect(onKey).not.toHaveBeenCalled()
      document.body.removeChild(textarea)
    })

    it('does not call onKey when contentEditable element is focused', () => {
      const onKey = vi.fn()

      renderHook(() => useCalculatorKeyboard({ onKey }))

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
          new KeyboardEvent('keydown', { key: '1', bubbles: true }),
        )
      })

      expect(onKey).not.toHaveBeenCalled()
      document.body.removeChild(div)
    })
  })
})

describe('useCalculatorKeyboard on mobile', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('does not add event listener on mobile', async () => {
    vi.doMock('@/shared/lib', () => ({
      useIsDesktop: () => false,
    }))

    const { useCalculatorKeyboard: useCalculatorKeyboardMobile } = await import(
      './use-calculator-keyboard'
    )
    const onKey = vi.fn()

    renderHook(() => useCalculatorKeyboardMobile({ onKey }))

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: '1', bubbles: true }),
      )
    })

    expect(onKey).not.toHaveBeenCalled()
  })
})
