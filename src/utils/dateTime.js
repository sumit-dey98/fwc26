/**
 * Date/time utilities — all times stored as UTC, displayed in user's timezone.
 */

/** Format a UTC ISO string to local time in given timezone */
export function formatTime(kickoffUtc, timezone = 'UTC') {
  return new Intl.DateTimeFormat('en-GB', {
    hour:     '2-digit',
    minute:   '2-digit',
    hour12:   false,
    timeZone: timezone,
  }).format(new Date(kickoffUtc))
}

/** Format date + time e.g. "Jun 16 · 22:00" */
export function formatDatetime(kickoffUtc, timezone = 'UTC') {
  const date = new Intl.DateTimeFormat('en-GB', {
    month:    'short',
    day:      'numeric',
    timeZone: timezone,
  }).format(new Date(kickoffUtc))
  const time = formatTime(kickoffUtc, timezone)
  return `${date} · ${time}`
}

/** Format a YYYY-MM-DD string as-is (no timezone shifting) e.g. "Jun 15" */
export function formatDateOnly(dateStr) {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateStr + 'T00:00:00Z'))
}

/** Returns true if kickoff is within the next 24 hours and in the future */
export function isWithin24h(kickoffUtc) {
  const now  = Date.now()
  const kick = new Date(kickoffUtc).getTime()
  return kick > now && kick - now < 24 * 60 * 60 * 1000
}

/** Returns true if kickoff is in the future */
export function isFuture(kickoffUtc) {
  return new Date(kickoffUtc).getTime() > Date.now()
}

/** Returns milliseconds until kickoff (negative if past) */
export function msUntil(kickoffUtc) {
  return new Date(kickoffUtc).getTime() - Date.now()
}

/** Format ms duration as "Xh Ym" or "Xm Ys" */
export function formatCountdown(ms) {
  if (ms <= 0) return '0m 0s'
  const totalSec = Math.floor(ms / 1000)
  const h  = Math.floor(totalSec / 3600)
  const m  = Math.floor((totalSec % 3600) / 60)
  const s  = totalSec % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${String(s).padStart(2, '0')}s`
}

/** Format date only e.g. "Jun 16" */
export function formatDate(kickoffUtc, timezone = 'UTC') {
  return new Intl.DateTimeFormat('en-GB', {
    month:    'short',
    day:      'numeric',
    timeZone: timezone,
  }).format(new Date(kickoffUtc))
}

/** Returns local YYYY-MM-DD in the given timezone */
export function localDate(kickoffUtc, timezone = 'UTC') {
  return new Intl.DateTimeFormat('en-CA', { // YYYY-MM-DD format
    year:     'numeric',
    month:    '2-digit',
    day:      '2-digit',
    timeZone: timezone,
  }).format(new Date(kickoffUtc))
}

/** Today's date string (YYYY-MM-DD) in given timezone */
export function todayInTz(timezone = 'UTC') {
  return localDate(new Date().toISOString(), timezone)
}
