type HapticPattern = 'success' | 'warning' | 'error' | 'light'

const patterns: Record<HapticPattern, number | number[]> = {
  success: 50,
  warning: [50, 50, 50],
  error: [100, 50, 100],
  light: 10,
}

export function vibrate(pattern: HapticPattern = 'light'): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(patterns[pattern])
  }
}

export function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator
}
