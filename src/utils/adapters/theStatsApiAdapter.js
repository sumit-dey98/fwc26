/**
 * Maps TheStatsAPI fixtures JSON → internal fixture shape.
 * API: https://thestatsapi.com/world-cup/data/fixtures.json
 */
function deriveStatus(kickoffUtc) {
  const now  = Date.now()
  const kick = new Date(kickoffUtc).getTime()
  if (now < kick) return 'upcoming'
  if (now > kick + 115 * 60 * 1000) return 'finished'
  return 'live'
}

export function adaptFixtures(apiResponse) {
  return (apiResponse.fixtures ?? []).map(f => ({
    matchNumber: f.matchNumber,
    date:        f.date,
    kickoffUtc:  f.kickoffUtc,
    stage:       f.stage,
    group:       f.group ?? null,
    homeTeam:    f.homeTeam,
    awayTeam:    f.awayTeam,
    stadium:     f.stadium,
    hostCity:    f.hostCity,
    // Augmented fields — filled by live API
    status:  deriveStatus(f.kickoffUtc),
    score:   { home: null, away: null },
    minute:  null,
    events:  [],
  }))
}
