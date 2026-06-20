import { localDate, todayInTz } from './dateTime'

export const STAGES = {
  'group-stage':   { label: 'Group Stage',   tab: 'group'   },
  'round-of-32':   { label: 'Round of 32',   tab: 'r32'     },
  'round-of-16':   { label: 'Round of 16',   tab: 'r16'     },
  'quarter-finals':{ label: 'Quarter-Finals', tab: 'finals'  },
  'semi-finals':   { label: 'Semi-Finals',    tab: 'finals'  },
  'third-place':   { label: 'Third Place',    tab: 'finals'  },
  'final':         { label: 'Final',          tab: 'finals'  },
}

export const KNOCKOUT_STAGES = ['round-of-32', 'round-of-16', 'quarter-finals', 'semi-finals', 'third-place', 'final']
export const FINALS_STAGES   = ['quarter-finals', 'semi-finals', 'third-place', 'final']

export const isLive     = f => f.status === 'live'
export const isFinished = f => f.status === 'finished'
export const isUpcoming = f => f.status === 'upcoming'

export const byStage = (fixtures, stage) =>
  fixtures.filter(f => f.stage === stage)

export const byGroup = (fixtures, group) =>
  group === 'All'
    ? fixtures.filter(f => f.stage === 'group-stage')
    : fixtures.filter(f => f.stage === 'group-stage' && f.group === group)

export const liveFixtures = fixtures =>
  fixtures.filter(isLive)

export const todayFixtures = (fixtures, timezone = 'UTC') => {
  const today = todayInTz(timezone)
  return fixtures.filter(f => localDate(f.kickoffUtc, timezone) === today)
}

export const upcomingFixtures = fixtures =>
  fixtures.filter(isUpcoming)

export const teamFixtures = (fixtures, teamName) =>
  fixtures.filter(f =>
    f.homeTeam === teamName || f.awayTeam === teamName
  )

export const groupsFromFixtures = fixtures =>
  [...new Set(
    fixtures.filter(f => f.stage === 'group-stage' && f.group)
            .map(f => f.group)
  )].sort()

export const fixturesByGroup = (fixtures) => {
  const groups = groupsFromFixtures(fixtures)
  return groups.reduce((acc, g) => {
    acc[g] = fixtures.filter(f => f.stage === 'group-stage' && f.group === g)
    return acc
  }, {})
}

/** Group fixtures by date string (YYYY-MM-DD), sorted chronologically */
export function fixturesByDate(fixtures, timezone = 'UTC') {
  const dateOf = f => localDate(f.kickoffUtc, timezone)
  const dates = [...new Set(fixtures.map(dateOf))].sort()
  return {
    dates,
    byDate: dates.reduce((acc, d) => {
      acc[d] = fixtures
        .filter(f => dateOf(f) === d)
        .sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc))
      return acc
    }, {}),
  }
}
