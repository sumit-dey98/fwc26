import { useApp } from '@context/AppContext'
import LiveBadge from '@components/ui/LiveBadge'
import { useTimezone } from '@hooks/useTimezone'
import { cn } from '@utils/cn'
import { ExternalLink, MapPin } from 'lucide-react'
import CountdownTimer from '@components/ui/CountdownTimer'
import { isWithin24h } from '@utils/dateTime'

function EventIcon({ type }) {
  if (type === 'yellow') return <span className="inline-block w-2 h-3 bg-yellow-400 flex-shrink-0" />
  if (type === 'red')    return <span className="inline-block w-2 h-3 bg-red-500 flex-shrink-0" />
  return <span className="inline-block w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-0.5" />
}

export default function MatchDropdownCard({ fixture }) {
  const { openModal } = useApp()
  const tz = useTimezone()
  const isLive  = fixture.status === 'live'
  const isDone  = fixture.status === 'finished'
  const homeEvents = (fixture.events ?? []).filter(e => e.teamSide === 'home')
  const awayEvents = (fixture.events ?? []).filter(e => e.teamSide === 'away')

  return (
    <div className="animate-slide-down bg-navy-700 border-t border-b border-navy-600 px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs text-content-muted mb-3">
        <MapPin size={16} className="flex-shrink-0 stroke-gold-400" />
        <span className="">{fixture.hostCity?.replace(/-/g, ' ')} · {fixture.stadium}</span>
        <span className="ml-auto flex-shrink-0 font-label font-semibold uppercase tracking-widest">
          {fixture.stage === 'group-stage' ? `Group ${fixture.group} · ` : ''}M{fixture.matchNumber}
        </span>
      </div>

      {isLive && <div className="mb-3"><LiveBadge minute={fixture.minute} /></div>}
      {!isLive && !isDone && isWithin24h(fixture.kickoffUtc) && (
        <div className="mb-3 text-xs text-gold-500 font-label font-semibold">
          Kickoff {tz.time(fixture.kickoffUtc)} ·{" "}
          <CountdownTimer kickoffUtc={fixture.kickoffUtc} className="inline" />
        </div>
      )}

      {(isDone || isLive) && (
        <div className="grid grid-cols-2 gap-4 mb-3 border-t border-navy-900 pt-3">
          <div>
            {/* <p className="font-label text-2xs font-semibold uppercase tracking-widest text-gold-500 mb-2 truncate">
              {fixture.homeTeam}
            </p> */}
            {homeEvents.length === 0
              ? <p className="text-2xs text-content-muted">—</p>
              : homeEvents.map((ev, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-content-secondary py-0.5">
                    <EventIcon type={ev.type} />
                    <span>{ev.minute}'</span>
                    <span className="truncate">{ev.player}</span>
                    {ev.type === 'og' && <span className="text-content-muted">(og)</span>}
                  </div>
                ))
            }
          </div>
          <div className="text-right">
            {/* <p className="font-label text-2xs font-semibold uppercase tracking-widest text-gold-500 mb-2 truncate">
              {fixture.awayTeam}
            </p> */}
            {awayEvents.length === 0
              ? <p className="text-2xs text-content-muted">—</p>
              : awayEvents.map((ev, i) => (
                  <div key={i} className="flex items-center justify-end gap-1.5 text-xs text-content-secondary py-0.5">
                    {ev.type === 'og' && <span className="text-content-muted">(og)</span>}
                    <span className="truncate">{ev.player}</span>
                    <span>{ev.minute}'</span>
                    <EventIcon type={ev.type} />
                  </div>
                ))
            }
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={e => { e.stopPropagation(); openModal(fixture.matchNumber) }}
          className="flex items-center gap-1.5 font-label text-xs font-semibold uppercase tracking-widest text-gold-500 border border-gold-500/30 px-2.5 py-1 hover:bg-gold-500/10 transition-colors"
        >
          <ExternalLink size={12} />
          Full match
        </button>
      </div>
    </div>
  )
}
