import { computeTopScorers } from '@utils/standings'
import { getTeam } from '@utils/teams'
import Flag from '@components/ui/Flag'
import Avatar from '@components/ui/Avatar'

export default function TopScorers({ fixtures }) {
  const scorers = computeTopScorers(fixtures)

  if (!scorers.length) return (
    <div className="px-4 py-8 text-center text-navy-600 text-xs italic">
      Scorer data available from live API
    </div>
  )

  return (
    <div>
      {scorers.slice(0, 20).map((s, i) => (
        <div key={s.player} className="flex items-center gap-3 px-4 py-3 border-b border-navy-800 hover:bg-navy-700 transition-colors">
          <span className="text-navy-500 text-xs tabular w-5 text-right flex-shrink-0">{i + 1}</span>
          <Avatar name={s.player} size={28} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{s.player}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {s.team && <Flag teamName={s.team} size='0.8em' />}
              <p className="text-xs text-content-muted font-display mt-0.5 truncate leading-none tracking-widest">{s.team}</p>
            </div>
          </div>
          <span className="text-lg font-bold text-gold-500 tabular flex-shrink-0">{s.goals}</span>
        </div>
      ))}
    </div>
  )
}
