import { useRef, useEffect } from 'react'
import { useApp } from '@context/AppContext'
import { useTimezone } from '@hooks/useTimezone'
import { cn } from '@utils/cn'
import { isWithin24h } from '@utils/dateTime'
import { teamNameFromCode } from '@utils/teams'
import ScoreBox from '@components/ui/ScoreBox'
import LiveBadge from '@components/ui/LiveBadge'
import CountdownTimer from '@components/ui/CountdownTimer'
import Flag from '@components/ui/Flag'

export default function MatchRow({ fixture }) {
  const { expandedMatchId, toggleMatch, favoriteTeam } = useApp()
  const tz = useTimezone()
  const isOpen = expandedMatchId === fixture.matchNumber
  const isLive = fixture.status === 'live'
  const isDone = fixture.status === 'finished'
  const rowRef = useRef(null)

  // favoriteTeam is stored as a code (e.g. 'ARG'), fixtures use full names
  const favName = teamNameFromCode(favoriteTeam)
  const isFav = favName && (fixture.homeTeam === favName || fixture.awayTeam === favName)

  useEffect(() => {
    if (isOpen && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isOpen])

  return (
    <div
      ref={rowRef}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={() => toggleMatch(fixture.matchNumber)}
      onKeyDown={e => e.key === 'Enter' && toggleMatch(fixture.matchNumber)}
      className={cn(
        'grid items-center px-4 cursor-pointer select-none transition-colors duration-150 gloss',
        'border-b border-navy-800',
        'py-2.5',
        isLive && 'bg-live/5 border-2 live-border-blink pl-3.5',
        isOpen && !isLive && 'bg-navy-700 border-l-2 border-gold-500 pl-3.5',
        !isLive && !isOpen && 'hover:bg-navy-700',
        isFav && !isLive && !isOpen && 'border-l-2 border-gold-600 pl-3.5',
      )}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 min-w-0">
        <TeamSide name={fixture.homeTeam} align="left" isLive={isLive} />
        <ScoreArea fixture={fixture} tz={tz} isLive={isLive} isDone={isDone} />
        <TeamSide name={fixture.awayTeam} align="right" isLive={isLive} />
      </div>
    </div>
  )
}

function TeamSide({ name, align, isLive }) {
  const { teamByName } = useApp()
  const isResolved = !!teamByName[name]
  const isRight = align === 'right'
  return (
    <div className={cn('flex items-center gap-2 min-w-0 text-base', isRight && 'flex-row-reverse')}>
      {isResolved && <Flag teamName={name} size='1em' className="flex-shrink-0" />}
      <span className={cn(
        'tracking-wider font-display font-medium !leading-none break-words',
        isLive && 'animate-live-blink',
        isRight ? 'text-right' : 'text-left'
      )}>
        {name}
      </span>
    </div>
  )
}

function ScoreArea({ fixture, tz, isLive, isDone }) {
  const { score, minute, kickoffUtc } = fixture

  if (isDone) {
    return (
      <div className="flex flex-col items-center gap-0.5 px-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <ScoreBox value={score?.home} isLive={false} />
          <span className="text-navy-600 text-xs font-bold">–</span>
          <ScoreBox value={score?.away} isLive={false} />
        </div>
        <span className="font-label text-2xs font-semibold tracking-widest text-finished mt-1"> <span className='text-gold-500 mr-2'> {tz.time(kickoffUtc)}</span>  FT</span>
      </div>
    )
  }

  if (isLive) {
    return (
      <div className="flex flex-col items-center gap-0.5 px-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <ScoreBox value={score?.home ?? 0} isLive />
          <span className="text-navy-600 text-xs font-bold">–</span>
          <ScoreBox value={score?.away ?? 0} isLive />
        </div>
        <LiveBadge minute={minute} />
      </div>
    )
  }

  const within24 = isWithin24h(kickoffUtc)
  return (
    <div className="flex flex-col items-center gap-0.5 px-2 flex-shrink-0">
      <span className="font-label text-sm font-semibold tabular text-gold-500">
        {within24 ? tz.time(kickoffUtc) : tz.datetime(kickoffUtc)}
      </span>
      {within24 && <CountdownTimer kickoffUtc={kickoffUtc} />}
    </div>
  )
}
