/**
 * API-Football (api-sports.io)
 * - Fixtures (schedule, scores, referee, venue): 1 request, cached session-long
 * - Squad + coach: on-demand per team, cached session-long
 * - Team ID map + group map: 1 request each, cached session-long
 * 
 * Free tier: 100 requests/day
 * Budget: ~4 structural + lazy squad/coach trickle
 */

const API_KEY = import.meta.env.VITE_APIFOOTBALL_KEY
const BASE_URL = import.meta.env.DEV
  ? '/apifootball'                         // Vite proxy → avoids CORS in dev
  : 'https://v3.football.api-sports.io'   // Direct in production (whitelist domain in dashboard)

const LEAGUE_ID = 1
const SEASON = 2026
const headers = { 'x-apisports-key': API_KEY }

// ── cache ────────────────────────────────────────────────────────────────────
function readCache(key) {
  try { const r = sessionStorage.getItem(key); return r ? JSON.parse(r) : null }
  catch { return null }
}
function writeCache(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch { }
}

// ── quota guard ──────────────────────────────────────────────────────────────
let quotaExhausted = readCache('apifootball:quota-exhausted') === true

async function safeFetch(url) {
  if (!API_KEY) {
    console.warn('[API-Football] Key missing — set VITE_APIFOOTBALL_KEY in .env.development')
    return null
  }
  if (quotaExhausted) {
    console.warn('[API-Football] Daily quota exhausted — skipping fetch')
    return null
  }
  try {
    const res = await fetch(url, { headers })
    if (res.status === 429) {
      quotaExhausted = true
      writeCache('apifootball:quota-exhausted', true)
      return null
    }
    if (!res.ok) { console.warn('[API-Football] HTTP error:', res.status, url); return null }
    const data = await res.json()
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.warn('[API-Football] API errors:', data.errors)
      return null
    }
    console.log('[API-Football] Fetched:', url, '→', data.results, 'results')
    return data.response ?? null
  } catch (err) {
    console.warn('[API-Football] Fetch failed:', url, err.message)
    return null
  }
}

// ── stage mapping ─────────────────────────────────────────────────────────────
const ROUND_TO_STAGE = {
  'Group Stage': 'group-stage',
  'Round of 32': 'round-of-32',
  'Round of 16': 'round-of-16',
  'Quarter-finals': 'quarter-finals',
  'Semi-finals': 'semi-finals',
  '3rd Place Final': 'third-place',
  'Final': 'final',
}

function stageFromRound(round) {
  const base = round?.split(' - ')[0] ?? ''
  return ROUND_TO_STAGE[base] ?? 'group-stage'
}

function statusFromShort(short) {
  if (['FT', 'AET', 'PEN'].includes(short)) return 'finished'
  if (['NS', 'TBD', 'PST', 'CANC'].includes(short)) return 'upcoming'
  return 'live'
}

// ── team group map: teamId → 'A'|'B'|... (from standings) ────────────────────
let teamGroupMapPromise = null

export async function getTeamGroupMap() {
  const cacheKey = 'apifootball:team-group-map'
  const cached = readCache(cacheKey)
  if (cached) return cached

  if (!teamGroupMapPromise) {
    teamGroupMapPromise = safeFetch(
      `${BASE_URL}/standings?league=${LEAGUE_ID}&season=${SEASON}`
    ).then(response => {
      if (!response) return {}
      const map = {}
      for (const { league } of response) {
        for (const group of league.standings) {
          for (const entry of group) {
            const letter = entry.group?.replace('Group ', '') ?? null
            if (letter) map[entry.team.id] = letter
          }
        }
      }
      writeCache(cacheKey, map)
      return map
    })
  }
  return teamGroupMapPromise
}

// ── team ID map: fifaCode → apiFootballTeamId ─────────────────────────────────
let teamIdMapPromise = null

export async function getTeamIdMap() {
  const cacheKey = 'apifootball:team-map'
  const cached = readCache(cacheKey)
  if (cached) return cached

  if (!teamIdMapPromise) {
    teamIdMapPromise = safeFetch(
      `${BASE_URL}/teams?league=${LEAGUE_ID}&season=${SEASON}`
    ).then(response => {
      if (!response) return {}
      const map = Object.fromEntries(response.map(t => [t.team.code, t.team.id]))
      writeCache(cacheKey, map)
      return map
    })
  }
  return teamIdMapPromise
}

// ── all WC2026 fixtures (1 request, includes referee + venue) ─────────────────
let fixturesPromise = null

export async function getApiFixtures() {
  const cacheKey = 'apifootball:fixtures'
  const cached = readCache(cacheKey)
  if (cached) return cached

  if (!fixturesPromise) {
    fixturesPromise = Promise.all([
      safeFetch(`${BASE_URL}/fixtures?league=${LEAGUE_ID}&season=${SEASON}`),
      getTeamGroupMap(),
    ]).then(([response, teamGroupMap]) => {
      if (!response) return []

      const adapted = response
        .sort((a, b) => a.fixture.timestamp - b.fixture.timestamp)
        .map((f, idx) => {
          const stage = stageFromRound(f.league.round)
          const isGroupStage = stage === 'group-stage'
          return {
            matchNumber: idx + 1,
            apiFixtureId: f.fixture.id,
            date: f.fixture.date.slice(0, 10),
            kickoffUtc: f.fixture.date,       // Already UTC from API-Football
            stage,
            group: isGroupStage ? (teamGroupMap[f.teams.home.id] ?? null) : null,
            homeTeam: f.teams.home.name,
            awayTeam: f.teams.away.name,
            stadium: f.fixture.venue.name ?? null,
            hostCity: f.fixture.venue.city ?? null,
            status: statusFromShort(f.fixture.status.short),
            score: {
              home: f.goals.home,
              away: f.goals.away,
            },
            minute: f.fixture.status.elapsed ?? null,
            events: [],   // Not in bulk fetch — populated by live poll merge
            referee: f.fixture.referee ?? null,
          }
        })

      writeCache(cacheKey, adapted)
      return adapted
    })
  }
  return fixturesPromise
}

// ── merge live scores from worldcup26.ir poll into API-Football fixtures ──────
// Matches by team name since IDs differ between the two APIs.
const NAME_ALIASES = {
  // Add pairs here if team names differ between worldcup26.ir and API-Football
  // e.g. 'USA': 'United States'
}
const norm = name => NAME_ALIASES[name] ?? name

function parseScorers(homeRaw, awayRaw) {
  const parse = (raw, side) => {
    if (!raw || raw === 'null') return []
    try {
      return raw.slice(1, -1).split('","')
        .map(s => s.replace(/^["{]+|["}]+$/g, '').trim())
        .filter(Boolean)
        .map(entry => {
          const isOG = entry.includes('(OG)')
          const isPen = entry.includes('(p)')
          const m = entry.match(/(\d+)[''']/)
          return {
            player: entry.replace(/\s+\d+['+\d]*[''][^'']*$/, '').replace(/\s*\(OG\)|\s*\(p\)/gi, '').trim(),
            minute: m ? parseInt(m[1]) : null,
            type: isOG ? 'og' : isPen ? 'penalty' : 'goal',
            teamSide: side,
          }
        })
        .filter(e => e.player)
    } catch { return [] }
  }
  return [...parse(homeRaw, 'home'), ...parse(awayRaw, 'away')]
    .sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0))
}

function parseScore(v) {
  if (v == null || v === 'null') return null
  const n = parseInt(v); return isNaN(n) ? null : n
}

export function mergeLiveScores(fixtures, gamesResponse) {
  // Build lookup by normalized "HomeTeam|||AwayTeam"
  const byNames = new Map(
    fixtures.map(f => [`${norm(f.homeTeam)}|||${norm(f.awayTeam)}`, f])
  )

  const updates = new Map()
  for (const g of gamesResponse.games ?? []) {
    const key = `${norm(g.home_team_name_en)}|||${norm(g.away_team_name_en)}`
    const fixture = byNames.get(key)
    if (!fixture) continue

    const status = g.finished === 'TRUE' || g.time_elapsed === 'finished'
      ? 'finished'
      : g.time_elapsed === 'notstarted' ? 'upcoming' : 'live'

    updates.set(fixture.matchNumber, {
      status,
      score: { home: parseScore(g.home_score), away: parseScore(g.away_score) },
      minute: !isNaN(parseInt(g.time_elapsed)) ? parseInt(g.time_elapsed) : null,
      events: parseScorers(g.home_scorers, g.away_scorers),
    })
  }

  return fixtures.map(f => {
    const u = updates.get(f.matchNumber)
    return u ? { ...f, ...u } : f
  })
}

// ── squad + coach (on-demand, cached per team) ────────────────────────────────
export async function getTeamSquad(fifaCode) {
  const cacheKey = `apifootball:squad:${fifaCode}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const teamMap = await getTeamIdMap()
  const teamId = teamMap[fifaCode]
  if (!teamId) return null

  const [squadRes, coachRes] = await Promise.all([
    safeFetch(`${BASE_URL}/players/squads?team=${teamId}`),
    safeFetch(`${BASE_URL}/coachs?team=${teamId}`),
  ])

  const players = squadRes?.[0]?.players?.map(p => ({
    name: p.name, position: p.position, photo: p.photo,
  })) ?? []

  const coach = coachRes?.[0]
    ? { name: coachRes[0].name, photo: coachRes[0].photo }
    : null

  const result = { players, coach }
  writeCache(cacheKey, result)
  return result
}