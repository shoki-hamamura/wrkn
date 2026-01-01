import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { canVibrate, vibrate } from './haptics'

describe('haptics', () => {
  const mockVibrate = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      vibrate: mockVibrate,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  describe('vibrate', () => {
    it('calls navigator.vibrate with success pattern', () => {
      vibrate('success')
      expect(mockVibrate).toHaveBeenCalledWith(50)
    })

    it('calls navigator.vibrate with warning pattern', () => {
      vibrate('warning')
      expect(mockVibrate).toHaveBeenCalledWith([50, 50, 50])
    })

    it('calls navigator.vibrate with error pattern', () => {
      vibrate('error')
      expect(mockVibrate).toHaveBeenCalledWith([100, 50, 100])
    })

    it('calls navigator.vibrate with light pattern by default', () => {
      vibrate()
      expect(mockVibrate).toHaveBeenCalledWith(10)
    })

    it('does not throw when navigator.vibrate is unavailable', () => {
      vi.stubGlobal('navigator', {})
      expect(() => vibrate('success')).not.toThrow()
    })
  })

  describe('canVibrate', () => {
    it('returns true when vibrate is available', () => {
      expect(canVibrate()).toBe(true)
    })

    it('returns false when vibrate is unavailable', () => {
      vi.stubGlobal('navigator', {})
      expect(canVibrate()).toBe(false)
    })
  })
})
