import type { RoundingUnit } from '@/shared/types/currency'

export function ceilToUnit(amount: number, unit: RoundingUnit): number {
  return Math.ceil(amount / unit) * unit
}

export function floorToUnit(amount: number, unit: RoundingUnit): number {
  return Math.floor(amount / unit) * unit
}

export function roundToUnit(amount: number, unit: RoundingUnit): number {
  return Math.round(amount / unit) * unit
}
