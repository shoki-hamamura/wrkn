const rtf = new Intl.RelativeTimeFormat('ja', { numeric: 'auto' })

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

export function formatRelativeDate(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  if (diff < MINUTE) {
    return 'たった今'
  }
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE)
    return rtf.format(-minutes, 'minute')
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR)
    return rtf.format(-hours, 'hour')
  }
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY)
    return rtf.format(-days, 'day')
  }
  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK)
    return rtf.format(-weeks, 'week')
  }
  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH)
    return rtf.format(-months, 'month')
  }
  const years = Math.floor(diff / YEAR)
  return rtf.format(-years, 'year')
}
