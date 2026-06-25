import { useApp } from '@context/AppContext'
import Flag from '@components/ui/Flag'
import { Wand2 } from 'lucide-react'
import { bestThirdsFromStandings } from '@utils/standings'
import { cn } from '@utils/cn'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function GroupRankPicker({ groupPicks, onChange, bestThirds, onToggleThird, maxBestThirds }) {
  const { teamByName, groupStandings } = useApp()
  const allTeams = Object.values(teamByName)

  // Overwrites existing manual picks with the same standings shown on the Stats
  // tab — one source of truth, so this can never disagree with what's displayed.
  const handleAutoPick = () => {
    GROUPS.forEach(g => {
      const table = groupStandings[g] ?? []
      const top3 = table.slice(0, 3).map(r => r.team)
      if (top3.length === 3) onChange(g, top3)
    })

    const bestGroups = bestThirdsFromStandings(groupStandings, teamByName, maxBestThirds)
    bestThirds.filter(g => !bestGroups.includes(g)).forEach(onToggleThird)
    bestGroups.filter(g => !bestThirds.includes(g)).forEach(onToggleThird)
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-x-6 gap-y-2 items-center justify-between flex-wrap">
        <p className="text-xs text-content-muted">
          Select the 1st, 2nd, and 3rd place team for each group to build your bracket prediction.
        </p>
        <button
          onClick={handleAutoPick}
          className="px-3 py-2 border border-gold-500/60 text-navy-950 text-xs font-bold tracking-widest bg-gold-500 hover:bg-gold-400 transition-colors flex items-center gap-1.5 w-full sm:w-fit justify-center leading-none"
        >
          <Wand2 size='1em' /> Auto-Pick From Current Standings
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUPS.map(g => {
          const teams = allTeams.filter(t => t.group === g)
          const picks = groupPicks[g] ?? []
          return (
            <div key={g} className="bg-navy-800 border border-navy-600">
              <div className="px-3 py-2 text-base font-label font-bold uppercase tracking-widest text-navy-700 bg-gold-500 border-b border-navy-700 flex items-center justify-between">
                <span>Group {g}</span>
                <span className="text-2xs font-normal">Rank 1st–3rd</span>
              </div>
              {teams.map(t => {
                const rank = picks.indexOf(t.name) + 1
                return (
                  <div
                    key={t.code}
                    className="flex items-center gap-2 px-3 py-2 border-b border-navy-900 last:border-0 cursor-pointer hover:bg-navy-700 transition-colors"
                    onClick={() => {
                      let next = [...picks]
                      const idx = next.indexOf(t.name)
                      if (idx >= 0) next.splice(idx, 1)
                      else if (next.length < 3) next.push(t.name)
                      else { next.shift(); next.push(t.name) }
                      onChange(g, next)
                    }}
                  >
                    <Flag teamName={t.name} size='1.2em' />
                    <span className="text-base tracking-wider font-display font-medium !leading-none break-words mt-1">{t.name}</span>
                    {rank > 0 && (
                      <span className={cn(
                        'text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0 !leading-none font-display rounded-full  text-navy-950',
                        rank === 1 ? 'bg-green-500' :
                          rank === 2 ? 'bg-yellow-500' :
                            'bg-orange-500'
                      )}>
                        {rank}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <BestThirdsPicker
        groupPicks={groupPicks}
        bestThirds={bestThirds}
        onToggleThird={onToggleThird}
        maxBestThirds={maxBestThirds}
      />
    </div>
  )
}

function BestThirdsPicker({ groupPicks, bestThirds, onToggleThird, maxBestThirds }) {
  const thirdPlaceTeams = GROUPS
    .map(g => ({ group: g, team: groupPicks[g]?.[2] }))
    .filter(entry => entry.team)

  return (
    <div className="mt-6 bg-navy-800 border border-navy-600">
      <div className="px-3 py-2 text-base font-label font-bold uppercase tracking-widest bg-gold-500 text-navy-900 border-b border-navy-700">
        Best Third-Placed Teams ({bestThirds.length}/{maxBestThirds})
      </div>
      {thirdPlaceTeams.length === 0 ? (
        <p className="px-3 py-3 text-xs text-content-muted italic">
          Rank a 3rd place team in any group above to see candidates here.
        </p>
      ) : (
        thirdPlaceTeams.map(({ group, team }) => {
          const isSelected = bestThirds.includes(group)
          const isDisabled = !isSelected && bestThirds.length >= maxBestThirds
          return (
            <div
              key={group}
              onClick={() => !isDisabled && onToggleThird(group)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 border-b border-navy-900 last:border-0 transition-colors',
                isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-navy-700'
              )}
            >
              <Flag teamName={team} size={16} />
              <span className="text-base tracking-wider font-display font-medium !leading-none break-words flex-1">{team}</span>
              <span className="text-2xs text-content-muted">Group {group}</span>
              <span className={cn(
                'text-2xs font-bold w-4 h-4 flex items-center justify-center flex-shrink-0 border',
                isSelected ? 'border-gold-500' : 'border-navy-500 text-content-muted'
              )}>
                {isSelected ? <span className='w-2 h-2 bg-gold-500'/> : ''}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}