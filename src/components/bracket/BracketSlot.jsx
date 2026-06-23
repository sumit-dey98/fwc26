import { cn } from '@utils/cn'
import Flag from '@components/ui/Flag'
import LiveBadge from '@components/ui/LiveBadge'

export default function BracketSlot({ fixture, predicted, onPick, predictMode }) {
  if (!fixture) return (
    <div className="border border-navy-700 px-3 py-2 text-2xs text-navy-600 italic">TBD</div>
  )

  const isLive = fixture.status === 'live'
  const isDone = fixture.status === 'finished'
  const canPick = predictMode && !isDone

  return (
    <div className={cn(
      'relative border border-navy-600 bg-navy-800',
      isLive && 'border-live/40'
    )}>
      <span className="absolute top-0.5 left-0.5 px-1 py-0.5 bg-navy-900 text-2xs font-label tracking-wider text-navy-500 leading-none">
        M{fixture.matchNumber}
      </span>
      {[{ name: fixture.homeTeam, side: 'home' }, { name: fixture.awayTeam, side: 'away' }]
        .map(({ name, side }) => {
          const score = fixture.score?.[side]
          const isPicked = predicted === side
          const isWinner = isDone && fixture.score && (
            (side === 'home' && fixture.score.home > fixture.score.away) ||
            (side === 'away' && fixture.score.away > fixture.score.home)
          )
          return (
            <div
              key={side}
              onClick={() => canPick && onPick && onPick(fixture.matchNumber, side)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 border-b last:border-b-0 border-navy-700',
                canPick && 'cursor-pointer hover:bg-navy-700',
                isPicked && !isDone && 'bg-green-500/10 border-l-2 border-l-green-500',
                isWinner && 'border-l-2 border-l-gold-500',
              )}
            >
              <Flag teamName={name} size={13} />
              <span className={cn('text-base tracking-wider font-display font-medium break-words', isWinner && 'font-bold text-gold-300')}>
                {name}
              </span>
              {(isDone || isLive) && score != null && (
                <span className={cn(
                  'text-xs tabular font-bold',
                  isLive ? 'animate-live-blink text-white' : 'text-content-secondary'
                )}>
                  {score}
                </span>
              )}
            </div>
          )
        })
      }
      {isLive && (
        <div className="px-3 py-1 border-t border-navy-700">
          <LiveBadge minute={fixture.minute} size="sm" />
        </div>
      )}
    </div>
  )
}
