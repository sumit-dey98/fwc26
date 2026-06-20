import { X, MapPin } from 'lucide-react'
import { useApp } from '@context/AppContext'
import { useTimezone } from '@hooks/useTimezone'
// import { useFixtureReferee } from '@hooks/useApiFootball'
import { getDisplayName } from '@utils/teams'
import Flag from '@components/ui/Flag'
import LiveBadge from '@components/ui/LiveBadge'
import ScoreBox from '@components/ui/ScoreBox'
import Avatar from '@components/ui/Avatar'

export default function MatchModal() {
  const { modalMatchId, fixtures, closeModal } = useApp()
  const tz = useTimezone()

  const fixture = fixtures.find(f => f.matchNumber === modalMatchId)

  // const { referee, loading: refereeLoading } = useFixtureReferee(
  //   fixture?.homeTeam, // team code expected — see note below
  //   fixture?.awayTeam,
  //   fixture?.kickoffUtc
  // )

  if (!fixture) return null

  const isLive = fixture.status === 'live'
  const isDone = fixture.status === 'finished'

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

          {(isDone || isLive) && fixture.events?.length > 0 && (
            <div className="px-5 py-4 border-b border-navy-700">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">Match Events</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xs text-content-muted mb-2">{getDisplayName(fixture.homeTeam)}</p>
                  {fixture.events.filter(e => e.teamSide === 'home').map((e, i) => (
                    <div key={i} className="text-xs text-content-secondary py-0.5">
                      <span className="inline-flex items-center gap-1.5">
                        {e.type === 'yellow' ? <span className="inline-block w-2 h-3 bg-yellow-400 flex-shrink-0" />
                          : e.type === 'red' ? <span className="inline-block w-2 h-3 bg-red-500 flex-shrink-0" />
                            : <span className="inline-block w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
                        {e.minute}' {e.player}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-2xs text-content-muted mb-2">{getDisplayName(fixture.awayTeam)}</p>
                  {fixture.events.filter(e => e.teamSide === 'away').map((e, i) => (
                    <div key={i} className="text-xs text-content-secondary py-0.5">
                      {e.player} {e.minute}' {e.type === 'yellow' ? <span className="inline-block w-2 h-3 bg-yellow-400" /> : e.type === 'red' ? <span className="inline-block w-2 h-3 bg-red-500" /> : <span className="inline-block w-2 h-2 rounded-full bg-green-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="px-5 py-4 border-b border-navy-700">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">Lineups</p>
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
                    <Avatar name="TBD" size={24} />
                    <span className="text-xs text-content-muted italic">Data not available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">Officials</p>
            <div className="flex items-center gap-3">
              <Avatar name={fixture.referee ?? 'Referee'} size={28} />
              {fixture.referee ? (
                <span className="text-sm text-content-secondary">{fixture.referee}</span>
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