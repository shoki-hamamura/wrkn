import { describe, expect, it } from 'vitest'
import { ceilToUnit, floorToUnit, roundToUnit } from './rounding'

describe('ceilToUnit', () => {
  describe('with unit = 1', () => {
    it('returns same value for integer', () => {
      expect(ceilToUnit(100, 1)).toBe(100)
    })

    it('rounds up decimal', () => {
      expect(ceilToUnit(100.1, 1)).toBe(101)
    })
  })

  describe('with unit = 10', () => {
    it('returns same value when already multiple of 10', () => {
      expect(ceilToUnit(100, 10)).toBe(100)
    })

    it('rounds up to next 10', () => {
      expect(ceilToUnit(101, 10)).toBe(110)
    })

    it('rounds up from 1', () => {
      expect(ceilToUnit(1, 10)).toBe(10)
    })

    it('handles larger numbers', () => {
      expect(ceilToUnit(7667, 10)).toBe(7670)
    })
  })

  describe('with unit = 100', () => {
    it('returns same value when already multiple of 100', () => {
      expect(ceilToUnit(1000, 100)).toBe(1000)
    })

    it('rounds up to next 100', () => {
      expect(ceilToUnit(1001, 100)).toBe(1100)
    })

    it('rounds up from small value', () => {
      expect(ceilToUnit(1, 100)).toBe(100)
    })

    it('handles larger numbers', () => {
      expect(ceilToUnit(7667, 100)).toBe(7700)
    })
  })

  it('handles zero', () => {
    expect(ceilToUnit(0, 10)).toBe(0)
  })

  it('handles negative numbers', () => {
    expect(ceilToUnit(-15, 10)).toBe(-10)
  })
})

describe('floorToUnit', () => {
  it('floors to nearest 10', () => {
    expect(floorToUnit(15, 10)).toBe(10)
  })

  it('floors to nearest 100', () => {
    expect(floorToUnit(150, 100)).toBe(100)
  })

  it('returns same value when already multiple', () => {
    expect(floorToUnit(100, 10)).toBe(100)
  })
})

describe('roundToUnit', () => {
  it('rounds down when closer to lower', () => {
    expect(roundToUnit(14, 10)).toBe(10)
  })

  it('rounds up when closer to higher', () => {
    expect(roundToUnit(16, 10)).toBe(20)
  })

  it('rounds up at midpoint', () => {
    expect(roundToUnit(15, 10)).toBe(20)
  })
})
