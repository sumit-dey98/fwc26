import { useApp } from '@context/AppContext'
import { MOCK_DATA } from '@data/mockData'
import Flag from '@components/ui/Flag'

export default function TeamStatCard({ fixtures, type }) {
  const finished = fixtures.filter(f => f.status === 'finished' && f.score)
  const teamStats = {}

  MOCK_DATA.teams.forEach(t => {
    teamStats[t.name] = { name: t.name, GF: 0, GA: 0, CS: 0, P: 0 }
  })

  finished.forEach(f => {
    const { home, away } = f.score
    if (home == null || away == null) return
    const h = teamStats[f.homeTeam]; const a = teamStats[f.awayTeam]
    if (!h || !a) return
    h.P++; a.P++
    h.GF += home; h.GA += away
    a.GF += away; a.GA += home
    if (away === 0) h.CS++
    if (home === 0) a.CS++
  })

  const rows = Object.values(teamStats).filter(t => t.P > 0)

  const isAttack = type === 'attack'
  const sorted = [...rows].sort((a, b) =>
    isAttack ? b.GF - a.GF : a.GA - b.GA
  )

  return (
    <div>
      <div className="px-4 py-2.5 border-b border-navy-700 text-sm font-bold uppercase tracking-widest text-gold-500 font-label">
        {isAttack ? 'Goals Scored' : 'Goals Conceded (fewest first)'}
      </div>
      {sorted.slice(0, 16).map((t, i) => (
        <div key={t.name} className="flex items-center gap-3 px-4 py-2.5 border-b border-navy-800 hover:bg-navy-700 transition-colors">
          <span className="text-navy-500 text-xs tabular w-5 text-right flex-shrink-0">{i + 1}</span>
          <Flag teamName={t.name} size='1em' />
          <span className="text-base font-medium flex-1 truncate font-display leading-none tracking-wider mt-0.5">{t.name}</span>
          <span className="text-base font-bold text-gold-500 tabular">
            {isAttack ? t.GF : t.GA}
          </span>
          <span className="text-2xs text-content-muted w-16 text-right">
            {isAttack ? `${t.P} games` : `${t.CS} clean sheets`}
          </span>
        </div>
      ))}
    </div>
  )
}
