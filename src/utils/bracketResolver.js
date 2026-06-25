/**
 * Resolves placeholder labels in knockout fixtures ("Winner Group J",
 * "3rd Group A/B/C/D/F", "Winner Match 86") into predicted team names,
 * using the user's group picks, best-thirds selection, and match predictions.
 *
 * If a fixture's team field is already a real team name (not a placeholder
 * pattern - either because reality has resolved it, or it never was one),
 * it's left untouched.
 */

const STAGE_ORDER = [
  'round-of-32', 'round-of-16', 'quarter-finals',
  'semi-finals', 'third-place', 'final',
]

export function resolvePredictedBracket(fixtures, groupPicks, bestThirds, predictions) {
  const resolved = {} // matchNumber -> { home, away }

  function resolveLabel(label) {
    if (!label) return null

    let m = label.match(/^Winner Group (\w)$/)
    if (m) return groupPicks[m[1]]?.[0] ?? null

    m = label.match(/^Runner-up Group (\w)$/)
    if (m) return groupPicks[m[1]]?.[1] ?? null

    m = label.match(/^3rd Group ([\w/]+)$/) || label.match(/^Best 3rd \(([\w/]+)\)$/)
    if (m) {
      const pool = m[1].split('/')
      const match = pool.find(g => bestThirds.includes(g))
      return match ? groupPicks[match]?.[2] ?? null : null
    }

    m = label.match(/^Winner Match (\d+)$/)
    if (m) {
      const r = resolved[parseInt(m[1])]
      const side = predictions[parseInt(m[1])]
      if (!r || !side) return null
      return side === 'home' ? r.home : r.away
    }

    m = label.match(/^Loser Match (\d+)$/)
    if (m) {
      const r = resolved[parseInt(m[1])]
      const side = predictions[parseInt(m[1])]
      if (!r || !side) return null
      return side === 'home' ? r.away : r.home
    }

    return null
  }

  const predictedFixtures = []

  STAGE_ORDER.forEach(stage => {
    fixtures
      .filter(f => f.stage === stage)
      .sort((a, b) => a.matchNumber - b.matchNumber)
      .forEach(f => {
        const home = resolveLabel(f.homeTeam) ?? f.homeTeam
        const away = resolveLabel(f.awayTeam) ?? f.awayTeam
        resolved[f.matchNumber] = { home, away }
        predictedFixtures.push({ ...f, homeTeam: home ?? 'TBD', awayTeam: away ?? 'TBD' })
      })
  })

  return predictedFixtures
}