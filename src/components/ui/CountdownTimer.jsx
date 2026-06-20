import { Timer } from 'lucide-react'
import { useState, useEffect } from 'react'
import { msUntil, formatCountdown } from '@utils/dateTime'

/** Live countdown  */
export default function CountdownTimer({ kickoffUtc, className = '' }) {
  const [display, setDisplay] = useState(() => formatCountdown(msUntil(kickoffUtc)))

  useEffect(() => {
    const tick = () => {
      const ms = msUntil(kickoffUtc)
      if (ms <= 0) { setDisplay('Starting'); return }
      setDisplay(formatCountdown(ms))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [kickoffUtc])

  return (
    <span className={`inline-flex items-center gap-1 text-xs text-content-muted tabular ${className}`}>
      <Timer size={10} className="flex-shrink-0" />
      {display}
    </span>
  )
}
