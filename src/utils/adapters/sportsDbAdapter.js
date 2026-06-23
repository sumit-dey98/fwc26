/**
 * TheSportsDB (thesportsdb.com) - team/squad/player data only.
 * Free, keyless API. Used ONLY for squad rosters + player photos.
 * Fixtures/standings/live score/stadiums stay on worldcup26.ir.
 * No reliable coach/manager data exists here - confirmed missing even
 * for high-profile teams, so that feature has no live source anymore.
 */
import { sportsDbNameFor, TEAM_BY_NAME } from '@utils/teams'

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'

function readCache(key) {
  try { const r = sessionStorage.getItem(key); return r ? JSON.parse(r) : null }
  catch { return null }
}
function writeCache(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch { }
}

function bucketPosition(pos) {
  if (!pos) return 'Midfielders'
  const p = pos.toLowerCase()
  if (p.includes('goalkeeper')) return 'Goalkeeper'
  if (p.includes('back') || p.includes('defen')) return 'Defenders'
  if (p.includes('forward') || p.includes('striker') || p.includes('wing')) return 'Forwards'
  return 'Midfielders'
}

async function safeFetch(url) {
  try {
    const res = await fetch(url)
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

/** Resolve a FIFA code to TheSportsDB's idTeam, preferring the national-team entry */
async function findTeamId(fifaCode, displayName) {
  const cacheKey = `sportsdb:team-id:${fifaCode}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const searchName = sportsDbNameFor(fifaCode) ?? displayName
  const data = await safeFetch(`${BASE_URL}/searchteams.php?t=${encodeURIComponent(searchName)}`)
  const teams = data?.teams ?? []
  if (teams.length === 0) return null

  const best = teams.find(t => t.strLeague === 'FIFA World Cup') ?? teams[0]
  writeCache(cacheKey, best.idTeam)
  return best.idTeam
}

/** Squad for a national team |  positions already bucketed to our 4 groups */
export async function getTeamSquad(fifaCode, displayName) {
  const cacheKey = `sportsdb:squad:${fifaCode}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const idTeam = await findTeamId(fifaCode, displayName)
  if (!idTeam) return { players: [] }

  const data = await safeFetch(`${BASE_URL}/lookup_all_players.php?id=${idTeam}`)
  const players = (data?.player ?? [])
    .filter(p => p.strSport === 'Soccer')
    .map(p => ({
      name: p.strPlayer,
      position: bucketPosition(p.strPosition),
      photo: p.strThumb ?? null,
    }))

  const result = { players }
  writeCache(cacheKey, result)
  return result
}

/** Resolve a worldcup26.ir fixture to TheSportsDB's idEvent via name search */
export async function findEventId(homeTeam, awayTeam) {
  const cacheKey = `sportsdb:event-id:${homeTeam}|${awayTeam}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const homeQuery = sportsDbNameFor(TEAM_BY_NAME[homeTeam]?.code) ?? homeTeam
  const awayQuery = sportsDbNameFor(TEAM_BY_NAME[awayTeam]?.code) ?? awayTeam
  const query = `${homeQuery}_vs_${awayQuery}`.replace(/ /g, '_')

  const data = await safeFetch(`${BASE_URL}/searchevents.php?e=${encodeURIComponent(query)}&s=2026`)
  const events = data?.event ?? []
  const match = events.find(e => e.strSeason === '2026') ?? events[0]

  if (!match) return null
  writeCache(cacheKey, match.idEvent)
  return match.idEvent
}

/** Full match detail bundle - referee, timeline, lineups, stats. One-time fetch per match, cached. */
export async function getMatchDetail(homeTeam, awayTeam) {
  const cacheKey = `sportsdb:match-detail:${homeTeam}|${awayTeam}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const idEvent = await findEventId(homeTeam, awayTeam)
  if (!idEvent) return null

  const [eventRes, timelineRes, lineupRes, statsRes] = await Promise.all([
    safeFetch(`${BASE_URL}/lookupevent.php?id=${idEvent}`),
    safeFetch(`${BASE_URL}/lookuptimeline.php?id=${idEvent}`),
    safeFetch(`${BASE_URL}/lookuplineup.php?id=${idEvent}`),
    safeFetch(`${BASE_URL}/lookupeventstats.php?id=${idEvent}`),
  ])

  const event = eventRes?.events?.[0] ?? null

  const timeline = (timelineRes?.timeline ?? []).map(t => ({
    type: t.strTimeline,        // "Goal" | "Card" | "subst"
    detail: t.strTimelineDetail,  // "Normal Goal" | "Yellow Card" | "Red Card" | "Substitution 1"
    isHome: t.strHome === 'Yes',
    player: t.strPlayer,
    photo: t.strCutout ?? null,
    assist: t.strAssist || null,
    minute: parseInt(t.intTime) || null,
    comment: t.strComment !== 'NULL' ? t.strComment : null,
  })).sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0))

  const lineups = (lineupRes?.lineup ?? []).map(p => ({
    isHome: p.strHome === 'Yes',
    isSubstitute: p.strSubstitute === 'Yes',
    name: p.strPlayer,
    position: p.strPosition,
    number: p.intSquadNumber,
    club: p.strTeam,
    photo: p.strCutout ?? null,
  }))

  const stats = (statsRes?.eventstats ?? []).map(s => ({
    label: s.strStat,
    home: parseInt(s.intHome) || 0,
    away: parseInt(s.intAway) || 0,
  }))

  const result = {
    referee: event?.strOfficial || null,
    spectators: event?.intSpectators || null,
    recap: event?.strResult || null,
    timeline,
    lineups,
    stats,
  }

  writeCache(cacheKey, result)
  return result
}