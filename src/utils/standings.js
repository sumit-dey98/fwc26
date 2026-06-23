import { teamsByGroup } from './teams'

const defaultRow = (name) => ({
  team: name, P: 0, W: 0, D: 0, L: 0,
  GF: 0, GA: 0, GD: 0, Pts: 0,
})

/** Compute standings table for one group from fixtures */
/**
 * Head-to-head record between exactly two teams, using only the match(es)
 * played directly between them (FIFA tie-break Step One).
 */
function headToHeadStats(teamA, teamB, fixtures) {
  let ptsA = 0, ptsB = 0, gfA = 0, gfB = 0

  fixtures.forEach(f => {
    if (f.status !== 'finished') return
    const isBetweenThem =
      (f.homeTeam === teamA && f.awayTeam === teamB) ||
      (f.homeTeam === teamB && f.awayTeam === teamA)
    if (!isBetweenThem) return

    const { home, away } = f.score ?? {}
    if (home == null || away == null) return

    const aIsHome = f.homeTeam === teamA
    const aGoals = aIsHome ? home : away
    const bGoals = aIsHome ? away : home
    gfA += aGoals; gfB += bGoals

    if (aGoals > bGoals) ptsA += 3
    else if (aGoals < bGoals) ptsB += 3
    else { ptsA += 1; ptsB += 1 }
  })

  return { ptsA, ptsB, gdA: gfA - gfB, gdB: gfB - gfA, gfA, gfB }
}

/**
 * Compute standings for one group, applying FIFA's official tie-break order:
 *   Step One — head-to-head points, then GD, then goals scored (teams concerned only)
 *   Step Two — overall goal difference, then overall goals scored
 *   (Step Two continues with disciplinary points, which we don't track, then
 *    FIFA ranking, which we apply here as a final fallback since fifaRank is available)
 *
 * LIMITATION: Step One's head-to-head comparison is only applied when exactly
 * two teams share the same points total. FIFA's real procedure also reapplies
 * these criteria recursively to 3-or-4-way ties via a mini-league among just
 * the tied teams — that recursive case isn't implemented here, and falls
 * through directly to Step Two (overall GD/GF) instead.
 *
 * @param {object} teamByName — optional, used only for the final FIFA-rank tiebreak
 */
export function computeGroupStandings(groupFixtures, teamByName = {}) {
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

    if (home > away) { h.W++; h.Pts += 3; a.L++ }
    else if (home < away) { a.W++; a.Pts += 3; h.L++ }
    else { h.D++; h.Pts++; a.D++; a.Pts++ }
  })

  const rows = Object.values(table).map(r => ({ ...r, GD: r.GF - r.GA }))

  // Find points-tied clusters and pre-compute Step One head-to-head ranking
  // for the common 2-team-tied case (see LIMITATION above for 3+ ties).
  const pointsGroups = {}
  rows.forEach(r => { (pointsGroups[r.Pts] ??= []).push(r) })

  Object.values(pointsGroups).forEach(tied => {
    if (tied.length !== 2) return
    const [a, b] = tied
    const h2h = headToHeadStats(a.team, b.team, groupFixtures)
    a._h2hRank =
      h2h.ptsA !== h2h.ptsB ? Math.sign(h2h.ptsA - h2h.ptsB) :
        h2h.gdA !== h2h.gdB ? Math.sign(h2h.gdA - h2h.gdB) :
          h2h.gfA !== h2h.gfB ? Math.sign(h2h.gfA - h2h.gfB) : 0
    b._h2hRank = -a._h2hRank
  })

  return rows
    .sort((a, b) => {
      if (b.Pts !== a.Pts) return b.Pts - a.Pts

      // Step One — head-to-head (only set when exactly 2 teams tied on points)
      const h2hDiff = (b._h2hRank ?? 0) - (a._h2hRank ?? 0)
      if (h2hDiff !== 0) return h2hDiff

      // Step Two — overall goal difference, then overall goals scored
      if (b.GD !== a.GD) return b.GD - a.GD
      if (b.GF !== a.GF) return b.GF - a.GF

      // Final fallback — FIFA ranking (lower number = better), if provided
      const rankA = teamByName[a.team]?.fifaRank
      const rankB = teamByName[b.team]?.fifaRank
      if (rankA != null && rankB != null) return rankA - rankB

      return 0
    })
    .map(({ _h2hRank, ...r }) => r) // strip internal scratch field before returning
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

/**
 * Determine the best N third-placed teams across all groups, per FIFA's rule:
 * points -> goal difference -> goals scored (all group matches) ->
 * [disciplinary points, not tracked] -> FIFA ranking.
 * Returns GROUP LETTERS (not team names) of the top N, ranked order.
 */
export function computeBestThirdPlacedGroups(fixtures, teamByName = {}, n = 8) {
  const groups = [...new Set(fixtures.filter(f => f.group).map(f => f.group))].sort()

  const thirds = groups
    .map(g => {
      const groupFixtures = fixtures.filter(f => f.stage === 'group-stage' && f.group === g)
      const table = computeGroupStandings(groupFixtures, teamByName)
      const thirdRow = table[2]
      return thirdRow ? { group: g, ...thirdRow } : null
    })
    .filter(Boolean)

  thirds.sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts
    if (b.GD !== a.GD) return b.GD - a.GD
    if (b.GF !== a.GF) return b.GF - a.GF
    const rankA = teamByName[a.team]?.fifaRank
    const rankB = teamByName[b.team]?.fifaRank
    if (rankA != null && rankB != null) return rankA - rankB
    return 0
  })

  return thirds.slice(0, n).map(t => t.group)
}