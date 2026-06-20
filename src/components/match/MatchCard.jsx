/** Compact match card for sidebar widgets */
import { useApp } from '@context/AppContext'
import LiveBadge from '@components/ui/LiveBadge'
import Flag from '@components/ui/Flag'
import CountdownTimer from '@components/ui/CountdownTimer'
import { useTimezone } from '@hooks/useTimezone'
import { isWithin24h } from '@utils/dateTime'
import { cn } from '@utils/cn'

export default function MatchCard({ fixture, compact = false }) {
  const { toggleMatch, expandedMatchId } = useApp()
  const tz = useTimezone()
  const isLive = fixture.status === 'live'
  const isDone = fixture.status === 'finished'
  const isUpcoming = !isLive && !isDone
  const within24 = isUpcoming && isWithin24h(fixture.kickoffUtc)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => toggleMatch(fixture.matchNumber)}
      onKeyDown={e => e.key === 'Enter' && toggleMatch(fixture.matchNumber)}
      className={cn(
        'px-3 py-2.5 border-b border-navy-700 cursor-pointer transition-colors',
        'hover:bg-navy-700 gloss',
        isLive && '!border-2  bg-red-500/20 live-border-blink'
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <Flag teamName={fixture.homeTeam} size={14} />
          <span className="text-base tracking-wider font-display font-medium !leading-none break-words text-left mt-0.5">{fixture.homeTeam}</span>
        </div>
        <span className={cn(
          'text-sm font-bold tabular flex-shrink-0 px-1',
          isDone && 'text-finished',
          isLive && 'text-white animate-live-blink'
        )}>
          {isDone || isLive
            ? `${fixture.score?.home ?? 0} – ${fixture.score?.away ?? 0}`
            : tz.time(fixture.kickoffUtc)
          }
        </span>
        <div className="flex items-center gap-1.5 justify-end min-w-0">
          <span className="text-base tracking-wider font-display font-medium !leading-none break-words text-right">{fixture.awayTeam}</span>
          <Flag teamName={fixture.awayTeam} size={14} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-content-muted mt-1">{fixture.stadium}</span>
        {isLive && <LiveBadge minute={fixture.minute} />}
        {isDone && <span className="text-2xs font-bold text-finished tracking-widest">FT</span>}
        {within24 && <CountdownTimer kickoffUtc={fixture.kickoffUtc} />}
      </div>
    </div>
  )
}
