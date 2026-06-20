import { useApp } from '@context/AppContext'
import { formatTime, formatDatetime, formatDate, isWithin24h, isFuture, formatCountdown, msUntil } from '@utils/dateTime'

/** Wraps timezone-aware formatting helpers, bound to user's current timezone */
export function useTimezone() {
  const { timezone } = useApp()

  return {
    timezone,
    time:     kickoffUtc => formatTime(kickoffUtc, timezone),
    datetime: kickoffUtc => formatDatetime(kickoffUtc, timezone),
    date:     kickoffUtc => formatDate(kickoffUtc, timezone),
    isWithin24h,
    isFuture,
    countdown: kickoffUtc => formatCountdown(msUntil(kickoffUtc)),
  }
}
