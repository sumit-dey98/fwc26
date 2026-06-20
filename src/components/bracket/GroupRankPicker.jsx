import { MOCK_DATA } from '@data/mockData'
import Flag from '@components/ui/Flag'
import { cn } from '@utils/cn'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function GroupRankPicker({ groupPicks, onChange, bestThirds, onToggleThird, maxBestThirds }) {
  return (
    <div className="p-4">
      <p className="text-xs text-content-muted mb-4">
        Select the 1st, 2nd, and 3rd place team for each group to build your bracket prediction.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUPS.map(g => {
          const teams = MOCK_DATA.teams.filter(t => t.group === g)
          const picks = groupPicks[g] ?? []
          return (
            <div key={g} className="bg-navy-800 border border-navy-600">
              <div className="px-3 py-2 text-base font-label font-bold uppercase tracking-widest text-navy-700 bg-gold-500 border-b border-navy-700 flex items-center justify-between">
                <span>Group {g}</span>
                <span className="text-2xs font-normal opacity-70">Rank 1st–3rd</span>
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
                    <Flag teamName={t.name} size={14} />
                    <span className="text-base tracking-wider font-display font-medium !leading-none break-words mt-1">{t.name}</span>
                    {rank > 0 && (
                      <span className={cn(
                        'text-2xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0',
                        rank === 1 ? 'bg-gold-500 text-navy-950' :
                          rank === 2 ? 'bg-navy-500 text-white' :
                            'bg-navy-700 text-content-secondary border border-navy-500'
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