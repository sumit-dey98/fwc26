import { teamsByGroup } from './teams'

const defaultRow = (name) => ({
  team: name, P: 0, W: 0, D: 0, L: 0,
  GF: 0, GA: 0, GD: 0, Pts: 0,
})

/** Compute standings table for one group from fixtures */
export function computeGroupStandings(groupFixtures) {
  const table = {}

  groupFixtures.forEach(f => {
    if (!table[f.homeTeam]) table[f.homeTeam] = defaultRow(f.homeTeam)
    if (!table[f.awayTeam]) table[f.awayTeam] = defaultRow(f.awayTeam)
  })

  groupFixtures.forEach(f => {
    if (f.status !== 'finished') return
    const { home, away } = f.score ?? {}
    if (home == null || away == null) return

    const h = table[f.homeTeam]
    const a = table[f.awayTeam]

    h.P++; a.P++
    h.GF += home; h.GA += away
    a.GF += away; a.GA += home

    if (home > away)      { h.W++; h.Pts += 3; a.L++ }
    else if (home < away) { a.W++; a.Pts += 3; h.L++ }
    else                  { h.D++; h.Pts++;    a.D++; a.Pts++ }
  })

  return Object.values(table)
    .map(r => ({ ...r, GD: r.GF - r.GA }))
    .sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF)
}

/** Compute all groups at once */
export function computeAllStandings(fixtures) {
  const groups = [...new Set(fixtures.filter(f => f.group).map(f => f.group))].sort()
  return groups.reduce((acc, g) => {
    const gf = fixtures.filter(f => f.stage === 'group-stage' && f.group === g)
    acc[g] = computeGroupStandings(gf)
    return acc
  }, {})
}

/** Simulate top scorers from events */
export function computeTopScorers(fixtures) {
  const scorers = {}
  fixtures.forEach(f => {
    if (!f.events?.length) return
    f.events.forEach(ev => {
      if (ev.type !== 'goal' && ev.type !== 'penalty') return
      const key = ev.player
      if (!scorers[key]) scorers[key] = { player: ev.player, team: ev.type === 'goal' ? (ev.teamSide === 'home' ? f.homeTeam : f.awayTeam) : '', goals: 0 }
      scorers[key].goals++
    })
  })
  return Object.values(scorers).sort((a, b) => b.goals - a.goals)
}
