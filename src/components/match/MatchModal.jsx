import { X, MapPin, Users } from 'lucide-react'
import { useApp } from '@context/AppContext'
import { useTimezone } from '@hooks/useTimezone'
import { useMatchDetail } from '@hooks/useMatchDetail'
import { getDisplayName } from '@utils/teams'
import Flag from '@components/ui/Flag'
import LiveBadge from '@components/ui/LiveBadge'
import ScoreBox from '@components/ui/ScoreBox'
import Avatar from '@components/ui/Avatar'
import { cn } from '@utils/cn'

const EVENT_ICON = {
  Goal: type => type === 'Own Goal'
    ? <span className="inline-block w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
    : <span className="inline-block w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />,
  Card: detail => detail === 'Red Card'
    ? <span className="inline-block w-2 h-3 bg-red-500 flex-shrink-0" />
    : <span className="inline-block w-2 h-3 bg-yellow-400 flex-shrink-0" />,
  subst: () => <span className="inline-block w-2 h-2 rounded-full bg-navy-400 flex-shrink-0" />,
}

export default function MatchModal() {
  const { modalMatchId, fixtures, closeModal } = useApp()
  const tz = useTimezone()

  const fixture = fixtures.find(f => f.matchNumber === modalMatchId)

  const { referee, timeline, lineups, stats, loading: detailLoading } = useMatchDetail(
    fixture?.homeTeam,
    fixture?.awayTeam
  )

  if (!fixture) return null

  const isLive = fixture.status === 'live'
  const isDone = fixture.status === 'finished'

  const homeLineup = lineups.filter(p => p.isHome && !p.isSubstitute)
  const awayLineup = lineups.filter(p => !p.isHome && !p.isSubstitute)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-navy-800 border border-navy-600 animate-slide-down flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700 flex-shrink-0 bg-gold-500">
          <span className="text-sm font-bold uppercase tracking-widest text-navy-900">
            {fixture.stage === 'group-stage' ? `Group ${fixture.group} · ` : ''}
            Match {fixture.matchNumber}
          </span>
          <button onClick={closeModal} className="text-navy-900 hover:text-navy-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body overflow-y-auto flex-1 min-h-0">
          <div className="px-5 py-6 border-b border-navy-700">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <Flag teamName={fixture.homeTeam} size={40} />
                <span className="font-display text-xl font-semibold tracking-wider text-center">
                  {getDisplayName(fixture.homeTeam)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                {(isDone || isLive) ? (
                  <>
                    <div className="flex items-center gap-2">
                      <ScoreBox value={fixture.score?.home} isLive={isLive} />
                      <span className="text-navy-500 font-bold">–</span>
                      <ScoreBox value={fixture.score?.away} isLive={isLive} />
                    </div>
                    {isLive && <LiveBadge minute={fixture.minute} />}
                    {isDone && <span className="text-2xs font-bold tracking-widest text-finished">FULL TIME</span>}
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-xl tracking-wider font-display font-semibold text-gold-500 tabular">
                      {tz.time(fixture.kickoffUtc)}
                    </div>
                    <div className="text-sm font-medium text-content-muted">{tz.date(fixture.kickoffUtc)}</div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <Flag teamName={fixture.awayTeam} size={40} />
                <span className="font-display text-xl font-semibold tracking-wider text-center">
                  {getDisplayName(fixture.awayTeam)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-b border-navy-700">
            <p className="text-sm text-content-muted">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="flex-shrink-0 text-gold-500" />
                {fixture.stadium} · {fixture.hostCity?.replace(/-/g, ' ')}
              </span>
            </p>
          </div>

          {/* Match Events from TheSportsDB (goals, cards, subs) */}
          {(isDone || isLive) && (
            <div className="px-5 py-4 border-b border-navy-700">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">Match Events</p>
              {detailLoading ? (
                <p className="text-xs text-content-muted italic">Loading...</p>
              ) : timeline.length === 0 ? (
                <p className="text-xs text-content-muted italic">Data not available</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xs text-content-muted mb-2">{getDisplayName(fixture.homeTeam)}</p>
                    {timeline.filter(e => e.isHome).map((e, i) => (
                      <div key={i} className="text-xs text-content-secondary py-0.5">
                        <span className="inline-flex items-center gap-1.5">
                          {EVENT_ICON[e.type]?.(e.detail)}
                          {e.minute}' {e.player}
                          {e.type === 'Goal' && e.assist && <span className="text-content-muted italic">(ast. {e.assist})</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-2xs text-content-muted mb-2">{getDisplayName(fixture.awayTeam)}</p>
                    {timeline.filter(e => !e.isHome).map((e, i) => (
                      <div key={i} className="text-xs text-content-secondary py-0.5">
                        <span className="inline-flex items-center gap-1.5 justify-end">
                          {e.type === 'Goal' && e.assist && <span className="text-content-muted italic">(ast. {e.assist})</span>}
                          {e.minute}' {e.player}
                          {EVENT_ICON[e.type]?.(e.detail)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lineups from TheSportsDB */}
          <div className="px-5 py-4 border-b border-navy-700">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">Lineups</p>
            {detailLoading ? (
              <p className="text-xs text-content-muted italic">Loading...</p>
            ) : lineups.length === 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {[fixture.homeTeam, fixture.awayTeam].map(team => (
                  <div key={team}>
                    <div className='flex items-center gap-2 mb-2'>
                      <Flag teamName={team} size={20} />
                      <p className="text-base tracking-wider font-display text-content-muted mt-0.5">
                        {getDisplayName(team)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-content-muted" />
                      <span className="text-xs text-content-muted italic">Data not available</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Flag teamName={fixture.homeTeam} size={16} />
                    <p className="text-sm font-display text-content-muted !leading-none">{getDisplayName(fixture.homeTeam)}</p>
                  </div>
                  <div className="space-y-1.5">
                    {homeLineup.map(p => (
                      <div key={p.name} className="flex items-center gap-2">
                        <Avatar name={p.name} src={p.photo} size={22} />
                        <span className="text-xs text-content-secondary truncate">{p.name}</span>
                        <span className="text-2xs text-content-muted ml-auto flex-shrink-0">{p.position}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 justify-end">
                    <p className="text-sm font-display text-content-muted">{getDisplayName(fixture.awayTeam)}</p>
                    <Flag teamName={fixture.awayTeam} size={16} />
                  </div>
                  <div className="space-y-1.5">
                    {awayLineup.map(p => (
                      <div key={p.name} className="flex items-center gap-2 justify-end">
                        <span className="text-2xs text-content-muted flex-shrink-0">{p.position}</span>
                        <span className="text-xs text-content-secondary truncate">{p.name}</span>
                        <Avatar name={p.name} src={p.photo} size={22} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Match Statistics */}
          {(isDone || isLive) && (
            <div className="px-5 py-4 border-b border-navy-700">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-3">Match Statistics</p>
              {detailLoading ? (
                <p className="text-xs text-content-muted italic">Loading...</p>
              ) : stats.length === 0 ? (
                <p className="text-xs text-content-muted italic">Data not available</p>
              ) : (
                <div className="space-y-2.5">
                  {stats.map(s => {
                    const total = s.home + s.away || 1
                    const homePct = (s.home / total) * 100
                    return (
                      <div key={s.label}>
                        <div className="flex items-center justify-between text-xs text-content-secondary mb-1">
                          <span className="font-bold w-8 text-left">{s.home}</span>
                          <span className="text-2xs text-content-muted uppercase tracking-wide">{s.label}</span>
                          <span className="font-bold w-8 text-right">{s.away}</span>
                        </div>
                        <div className="h-1.5 bg-navy-900 flex overflow-hidden">
                          <div className="bg-gold-500" style={{ width: `${homePct}%` }} />
                          <div className="bg-navy-500 flex-1" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Officials */}
          <div className="px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">Officials</p>
            <div className="flex items-center gap-3">
              <Avatar name={referee ?? 'Referee'} size={28} />
              {detailLoading ? (
                <span className="text-xs text-content-muted italic">Loading...</span>
              ) : referee ? (
                <span className="text-sm text-content-secondary">{referee}</span>
              ) : (
                <span className="text-xs text-content-muted italic">Data not available</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}