import { useState } from 'react'
import { useApp } from '@context/AppContext'
import { cn } from '@utils/cn'
import { Star } from 'lucide-react'
import Flag from '@components/ui/Flag'
import { getDisplayName } from '@utils/teams'

const GROUPS = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function TeamsView() {
  const { favoriteTeam, teamByName, openTeamModal } = useApp()
  const [group, setGroup] = useState('All')

  const allTeams = Object.values(teamByName).sort((a, b) =>
    a.group === b.group ? a.name.localeCompare(b.name) : a.group.localeCompare(b.group)
  )
  const teams = group === 'All'
    ? allTeams
    : allTeams.filter(t => t.group === group)

  return (
    <div className="animate-fade-in">
      {/* <div className="border-b border-navy-700 px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gold-500">Teams</h2>
      </div> */}

      <div className="flex gap-1.5 flex-wrap px-4 py-3 border-b border-navy-700">
        {GROUPS.map(g => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={cn(
              'w-9 h-8 font-label text-sm font-semibold uppercase tracking-widest transition-colors duration-150 gloss border',
              group === g
                ? 'bg-gold-500 text-navy-950 border-gold-500'
                : 'bg-navy-800 text-content-muted border-navy-600 hover:border-gold-500 hover:text-gold-400'
            )}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {teams.map(t => (
          <button
            key={t.code}
            onClick={() => openTeamModal(t.code)}
            className={cn(
              'bg-navy-800 border p-4 text-left transition-colors gloss flex items-start justify-start gap-6 relative',
              favoriteTeam === t.code
                ? 'border-gold-500 bg-navy-700'
                : 'border-navy-600 hover:border-gold-500/50'
            )}
          >
            <div className="text-3xl h-full">
              <Flag teamName={t.name} size={72} />
              <div className="text-xs text-content-muted font-medium mt-2">#{t.fifaRank}</div>
            </div>

            <div>
              <p className="text-lg tracking-wider font-semibold font-display text-white mb-0.5 leading-tight">{getDisplayName(t.name)}</p>
              <p className="text-sm text-gold-500 font-bold mb-1">Group {t.group}</p>

              <p className="text-xs text-navy-500/60 font-semibold">{t.confederation}</p>
            </div>

            {favoriteTeam === t.code && (
              <p className="flex items-center gap-1 text-2xs text-gold-400 font-bold absolute top-2 right-2 leading-none mb-0.5"><Star size='1em' fill="currentColor" /> </p>
            )}
          </button>
        ))}
      </div>

    </div>
  )
}
