import { useState } from 'react'
import { useApp } from '@context/AppContext'
import GroupFilter from '@components/ui/GroupFilter'
import MatchList from '@components/match/MatchList'
import StandingsTable from '@components/stats/StandingsTable'
import { fixturesByDate, fixturesByGroup, groupsFromFixtures } from '@utils/fixtures'
import { formatDateOnly } from '@utils/dateTime'
import { teamNameFromCode, getTeamByCode } from '@utils/teams'

export default function GroupStageView() {
  const { fixtures, selectedGroup, timezone, favoriteTeam } = useApp()
  const [view, setView] = useState('matches')

  const favName = teamNameFromCode(favoriteTeam)
  const favGroup = favoriteTeam ? getTeamByCode(favoriteTeam)?.group : null

  const groupStage = fixtures.filter(f => f.stage === 'group-stage')

  const filtered = selectedGroup === 'All'
    ? groupStage
    : selectedGroup === 'Fav'
      ? groupStage.filter(f => f.homeTeam === favName || f.awayTeam === favName)
      : groupStage.filter(f => f.group === selectedGroup)

  const { dates, byDate } = fixturesByDate(filtered, timezone)
  const byGrp = fixturesByGroup(fixtures)
  const groups = selectedGroup === 'All'
    ? groupsFromFixtures(fixtures)
    : selectedGroup === 'Fav'
      ? (favGroup ? [favGroup] : [])
      : [selectedGroup]

  return (
    <div className="animate-fade-in">
      <GroupFilter />
      <div className="flex border-b border-navy-700">
        {['matches', 'table'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2.5 text-base font-label font-bold uppercase tracking-widest transition-colors border-b-2 ${view === v
                ? 'text-gold-500 border-gold-500'
                : 'text-content-muted border-transparent hover:text-gold-400'
              }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'matches' ? (
        <div>
          {dates.map(date => (
            <div key={date} data-date-header={date}>
              <div className="px-4 py-2 text-sm font-label font-semibold uppercase tracking-widest text-navy-800 bg-gold-500 border-b border-navy-700 sticky top-0 z-10">
                {formatDateOnly(date)}
              </div>
              <MatchList fixtures={byDate[date]} />
            </div>
          ))}
          {dates.length === 0 && (
            <div className="px-4 py-12 text-center text-content-muted text-sm">
              {selectedGroup === 'Fav' ? 'No matches found for your favorite team.' : 'No matches found.'}
            </div>
          )}
        </div>
      ) : (
        <div>
          {groups.map(g => (
            <div key={g} className="border-b border-navy-700">
              <div className="px-4 py-2 text-sm font-label font-semibold uppercase tracking-widest text-navy-800 bg-gold-500">
                {selectedGroup === 'Fav' ? `My Team — Group ${g}` : `Group ${g}`}
              </div>
              <StandingsTable fixtures={byGrp[g] ?? []} group={g} />
            </div>
          ))}
          {groups.length === 0 && (
            <div className="px-4 py-12 text-center text-content-muted text-sm">No favorite team set.</div>
          )}
        </div>
      )}
    </div>
  )
}