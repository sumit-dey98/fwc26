/**
 * Primary adapter for worldcup26.ir
 * GET /get/games    → fixtures + live scores
 * GET /get/teams    → team metadata
 * GET /get/stadiums → venue metadata + timezone offsets
 */
import { MOCK_DATA } from '@data/mockData'

const STAGE_MAP = {
  group: 'group-stage',
  r32: 'round-of-32',
  r16: 'round-of-16',
  qf: 'quarter-finals',
  sf: 'semi-finals',
  final: 'final',
  third: 'third-place',
}

const KNOCKOUT_GROUPS = new Set(['R32', 'R16', 'QF', 'SF', 'FINAL', '3RD'])

const MOCK_BY_CODE = Object.fromEntries(
  MOCK_DATA.teams.map(t => [t.code, t])
)

function getUtcOffset(stadium) {
  if (!stadium) return -5
  const { country_en, region } = stadium
  if (country_en === 'Mexico') return -6   // CST - Mexico stopped DST
  if (country_en === 'Canada') return region === 'Western' ? -7 : -4
  // United States (summer DST)
  if (region === 'Eastern') return -4   // EDT
  if (region === 'Central') return -5   // CDT
  if (region === 'Western') return -7   // PDT
  return -5
}

/** "MM/DD/YYYY HH:MM" → "YYYY-MM-DD" (venue local date - used for schedule grouping) */
function parseVenueDate(localDate) {
  const [d] = localDate.split(' ')
  const [mm, dd, yyyy] = d.split('/')
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
}

/**
 * "MM/DD/YYYY HH:MM" + UTC offset → correct ISO UTC string
 * Uses Date.UTC() to avoid browser timezone interference.
 * local_time = UTC + offset  →  UTC = local_time − offset
 */
function localToUTC(localDate, utcOffset) {
  const [datePart, timePart] = localDate.split(' ')
  const [mm, dd, yyyy] = datePart.split('/')
  const [hh, mi] = timePart.split(':')
  const localMs = Date.UTC(
    parseInt(yyyy),
    parseInt(mm) - 1,
    parseInt(dd),
    parseInt(hh),
    parseInt(mi)
  )
  return new Date(localMs - utcOffset * 3_600_000).toISOString()
}

function parseScore(val) {
  if (val == null || val === 'null') return null
  const n = parseInt(val)
  return isNaN(n) ? null : n
}

/**
 * Parse PHP-style scorer set: {"Name 27'","Name 45'+2'(p)"}
 */
function parseScorers(raw, teamSide) {
  if (!raw || raw === 'null') return []
  try {
    const inner = raw.slice(1, -1)
    return inner
      .split('","')
      .map(s => s.replace(/^["{]+|["}]+$/g, '').trim())
      .filter(Boolean)
      .map(entry => {
        const isOG = entry.includes('(OG)')
        const isPenalty = entry.includes('(p)')
        const type = isOG ? 'og' : isPenalty ? 'penalty' : 'goal'
        const minMatch = entry.match(/(\d+)[\'\u2019]/)
        const minute = minMatch ? parseInt(minMatch[1]) : null
        const player = entry
          .replace(/\s+\d+[\'+\d]*[\'\u2019][^\'\u2019]*$/, '')
          .replace(/\s*\(OG\)|\s*\(p\)/gi, '')
          .trim()
        return { player, minute, type, teamSide }
      })
      .filter(e => e.player)
  } catch {
    return []
  }
}

function normalizeStatus(finished, timeElapsed) {
  if (finished === 'TRUE' || timeElapsed === 'finished') return 'finished'
  if (timeElapsed === 'notstarted') return 'upcoming'
  return 'live'
}

/** Build { [stadiumId]: { name, city, country, capacity, utcOffset } } */
export function buildStadiumMap(stadiumsResponse) {
  const list = Array.isArray(stadiumsResponse)
    ? stadiumsResponse
    : (stadiumsResponse.stadiums ?? [])
  return Object.fromEntries(
    list.map(s => [s.id, {
      id: s.id,
      name: s.name_en,
      city: s.city_en,
      country: s.country_en === 'United States' ? 'USA' : s.country_en,
      officialName: s.fifa_name ?? null,
      capacity: s.capacity,
      utcOffset: getUtcOffset(s),
    }])
  )
}

/**
 * Build { [teamNameEn]: teamObject }
 * Merges API data (flag URL, iso2) with mock data (fifaRank, confederation).
 * Matching is done by FIFA code to handle name differences (e.g. "Czech Republic" vs "Czechia").
 */
export function buildTeamByName(teamsResponse) {
  return Object.fromEntries(
    (teamsResponse.teams ?? []).map(t => {
      const mock = MOCK_BY_CODE[t.fifa_code] ?? {}
      return [t.name_en, {
        id: t.id,
        name: t.name_en,
        code: t.fifa_code,
        group: t.groups,
        flag: t.flag,          // flagcdn.com URL
        iso2: t.iso2,
        fifaRank: mock.fifaRank ?? null,
        confederation: mock.confederation ?? null,
      }]
    })
  )
}

/** Normalize /get/games + stadiumMap → internal fixture array */
export function adaptGames(gamesResponse, stadiumMap = {}) {
  return (gamesResponse.games ?? [])
    .map(g => {
      const stadium = stadiumMap[g.stadium_id]
      const utcOffset = stadium?.utcOffset ?? -5
      const kickoffUtc = localToUTC(g.local_date, utcOffset)
      const isKnockout = KNOCKOUT_GROUPS.has(g.group)

      return {
        matchNumber: parseInt(g.id),
        date: parseVenueDate(g.local_date),  // venue local date (schedule grouping)
        kickoffUtc,                                  // correct UTC (countdown, today's matches)
        stage: STAGE_MAP[g.type] ?? g.type,
        group: isKnockout ? null : g.group,
        homeTeam: g.home_team_name_en ?? g.home_team_label ?? 'TBD',
        awayTeam: g.away_team_name_en ?? g.away_team_label ?? 'TBD',
        stadium: stadium?.name ?? null,
        hostCity: stadium?.city ?? null,
        status: normalizeStatus(g.finished, g.time_elapsed),
        score: {
          home: parseScore(g.home_score),
          away: parseScore(g.away_score),
        },
        minute: !isNaN(parseInt(g.time_elapsed)) ? parseInt(g.time_elapsed) : null,
        events: [
          ...parseScorers(g.home_scorers, 'home'),
          ...parseScorers(g.away_scorers, 'away'),
        ].sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0)),
      }
    })
    .sort((a, b) => a.matchNumber - b.matchNumber)
}

/** Merge fresh poll data into existing fixtures - only updates live fields */
export function mergeLiveScores(fixtures, gamesResponse, stadiumMap = {}) {
  const fresh = new Map(adaptGames(gamesResponse, stadiumMap).map(f => [f.matchNumber, f]))
  return fixtures.map(f => {
    const u = fresh.get(f.matchNumber)
    if (!u) return f
    return { ...f, status: u.status, score: u.score, minute: u.minute, events: u.events }
  })
}

/** Map team_id (string, e.g. "1") -> full team name, from /get/teams response */
export function buildTeamIdToName(teamsResponse) {
  return Object.fromEntries(
    (teamsResponse.teams ?? []).map(t => [t.id, t.name_en])
  )
}

/**
 * Build standings tables from /get/groups - the API's own computed standings,
 * already including server-side tie-breaking. Each group's teams array
 * arrives pre-sorted; we apply a defensive re-sort here as a safety net using
 * only Step Two (overall GD, then GF) - NOT full head-to-head - since this is
 * meant to catch gross ordering errors, not replace the API's own tie-break logic.
 */
export function buildGroupStandings(groupsResponse, teamIdToName) {
  const result = {}
  for (const g of groupsResponse.groups ?? []) {
    const rows = (g.teams ?? []).map(t => ({
      team: teamIdToName[t.team_id] ?? `Team ${t.team_id}`,
      P: parseInt(t.mp), W: parseInt(t.w), D: parseInt(t.d), L: parseInt(t.l),
      GF: parseInt(t.gf), GA: parseInt(t.ga), GD: parseInt(t.gd), Pts: parseInt(t.pts),
    }))
    rows.sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF)
    result[g.name] = rows
  }
  return result
}