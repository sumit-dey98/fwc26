import { useState } from 'react'
import { useApp } from '@context/AppContext'
import StandingsTable from '@components/stats/StandingsTable'
import TopScorers from '@components/stats/TopScorers'
import TeamStatCard from '@components/stats/TeamStatCard'
import { fixturesByGroup, groupsFromFixtures } from '@utils/fixtures'
import { cn } from '@utils/cn'

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']
const SECTIONS = ['Standings', 'Top Scorers', 'Attack', 'Defense']

export default function StatsView() {
  const { fixtures } = useApp()
  const [section, setSection] = useState('Standings')
  const [group,   setGroup]   = useState('A')

  const byGroup = fixturesByGroup(fixtures)

  return (
    <div className="animate-fade-in">
      {/* <div className="border-b border-navy-700 px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gold-500">Statistics</h2>
      </div> */}

      {/* Section tabs */}
      <div className="flex border-b border-navy-700 scroll-x">
        {SECTIONS.map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={cn(
              'px-4 py-2 text-base font-label font-bold uppercase tracking-widest flex-shrink-0 transition-colors border-b-2',
              section === s ? 'text-gold-500 border-gold-500' : 'text-content-muted border-transparent hover:text-gold-400'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {section === 'Standings' && (
        <div>
          <div className="flex border-b border-navy-700 scroll-x px-4 py-2 gap-1.5">
            {GROUPS.map(g => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={cn(
                  'w-9 h-8 font-label text-sm font-semibold uppercase tracking-widest transition-colors duration-150 gloss border flex-shrink-0',
                  group === g
                    ? 'bg-gold-500 text-navy-950 border-gold-500'
                    : 'bg-navy-800 text-content-muted border-navy-600 hover:border-gold-500 hover:text-gold-400'
                )}
              >
                {g}
              </button>
            ))}
          </div>
          <StandingsTable fixtures={byGroup[group] ?? []} group={group} />
        </div>
      )}

      {section === 'Top Scorers' && <TopScorers fixtures={fixtures} />}

      {section === 'Attack' && (
        <TeamStatCard fixtures={fixtures} type="attack" />
      )}

      {section === 'Defense' && (
        <TeamStatCard fixtures={fixtures} type="defense" />
      )}
    </div>
  )
}
