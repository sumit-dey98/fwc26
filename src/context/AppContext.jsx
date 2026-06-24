import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'
import { TAB_TO_PATH, tabFromPath } from '@utils/routes'
import { MOCK_DATA } from '@data/mockData'
import { adaptGames, buildTeamByName, buildStadiumMap, mergeLiveScores } from '@utils/adapters/worldcup26Adapter'


const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const API_BASE = import.meta.env.VITE_LIVE_API_BASE ?? ''
const LS = key => `wc26:${key}`

// Tier 4: adaptive live-poll cadence
const POLL_BASE_MS = 30_000          // base tick — cheap, just checks activity
const POLL_IDLE_TICKS = 10           // 10 * 30s = 5 min when nothing is happening
const SOON_MS = 5 * 60 * 1000        // "starting soon" window

function hasLiveActivity(fixtures) {
  const now = Date.now()
  return fixtures.some(f =>
    f.status === 'live' ||
    (f.status === 'upcoming' && new Date(f.kickoffUtc).getTime() - now <= SOON_MS)
  )
}

function getBreakpointDefaultFontScale() {
  if (typeof window === 'undefined') return 'md'
  return window.innerWidth < 1024 ? 'md'
    : window.innerWidth < 1536 ? 'lg' : 'xl'
}

function getInitialOfflineStatus() {
  if (typeof navigator === 'undefined') return false
  return !navigator.onLine
}

const load = (key, fallback = null) => {
  try {
    const v = localStorage.getItem(LS(key))
    return v != null ? JSON.parse(v) : fallback
  } catch { return fallback }
}

const save = (key, val) => {
  try { localStorage.setItem(LS(key), JSON.stringify(val)) } catch { }
}

const INIT = {
  fixtures: [],
  teamByName: {},
  stadiums: [],
  stadiumMap: {},
  isLoading: true,
  error: null,
  lastUpdated: null,
  isOffline: getInitialOfflineStatus(),
  usingCachedData: false,
  activeTab: tabFromPath(window.location.pathname),
  selectedGroup: 'All',
  expandedMatchId: null,
  modalMatchId: null,
  modalTeamCode: null,
  targetStadiumId: null,
  searchOpen: false,
  searchQuery: '',
  settingsOpen: false,
  timezone: load('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC'),
  timezoneConfirmed: load('timezoneConfirmed', false),
  favoriteTeam: load('favoriteTeam', null),
  predictions: load('predictions', {}),
  fontScale: load('fontScale', getBreakpointDefaultFontScale()),
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'FIXTURES_LOADED':
      return { ...state, fixtures: payload, isLoading: false, error: null }
    case 'TEAMS_LOADED':
      return { ...state, teamByName: payload }
    case 'STADIUMS_LOADED':
      return { ...state, stadiums: payload.list, stadiumMap: payload.map }
    case 'FIXTURES_ERROR':
      return { ...state, isLoading: false, error: payload }
    case 'LIVE_UPDATE':
      return { ...state, fixtures: payload, lastUpdated: new Date() }
    case 'SET_DATA_STATUS':
      return { ...state, ...payload }
    case 'SET_TAB':
      return { ...state, activeTab: payload, expandedMatchId: null }
    case 'SET_GROUP':
      return { ...state, selectedGroup: payload, expandedMatchId: null }
    case 'TOGGLE_MATCH':
      return { ...state, expandedMatchId: state.expandedMatchId === payload ? null : payload }
    case 'EXPAND_MATCH':
      return { ...state, expandedMatchId: payload }
    case 'OPEN_MODAL':
      return { ...state, modalMatchId: payload }
    case 'CLOSE_MODAL':
      return { ...state, modalMatchId: null }
    case 'OPEN_TEAM_MODAL':
      return { ...state, modalTeamCode: payload }
    case 'CLOSE_TEAM_MODAL':
      return { ...state, modalTeamCode: null }
    case 'GO_TO_STADIUM':
      return { ...state, activeTab: 'stadiums', targetStadiumId: payload }
    case 'CLEAR_STADIUM_TARGET':
      return { ...state, targetStadiumId: null }
    case 'TOGGLE_SEARCH':
      return { ...state, searchOpen: !state.searchOpen, searchQuery: '' }
    case 'SET_SEARCH':
      return { ...state, searchQuery: payload }
    case 'TOGGLE_SETTINGS':
      return { ...state, settingsOpen: !state.settingsOpen }
    case 'SET_TIMEZONE':
      save('timezone', payload)
      save('timezoneConfirmed', true)
      return { ...state, timezone: payload, timezoneConfirmed: true }
    case 'SET_FAVORITE':
      save('favoriteTeam', payload)
      return { ...state, favoriteTeam: payload }
    case 'SET_PREDICTION': {
      const predictions = { ...state.predictions, [payload.matchNumber]: payload.side }
      save('predictions', predictions)
      return { ...state, predictions }
    }
    case 'CLEAR_PREDICTIONS':
      save('predictions', {})
      return { ...state, predictions: {} }
    case 'SET_FONT_SCALE':
      save('fontScale', payload)
      document.documentElement.setAttribute('data-fontscale', payload)
      return { ...state, fontScale: payload }
    default:
      return state
  }
}

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INIT)

  // Keep a ref to the latest fixtures so the polling interval can read
  // current activity without re-subscribing on every fixtures change.
  const fixturesRef = useRef(state.fixtures)
  useEffect(() => { fixturesRef.current = state.fixtures }, [state.fixtures])

  // Holds the load() function so the online-reconnect listener can re-invoke it
  const loadRef = useRef(null)

  // Apply saved font scale on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-fontscale', INIT.fontScale)
  }, [])

  // (setTab, search, goToStadium, future actions), sync the URL to match.
  useEffect(() => {
    const path = TAB_TO_PATH[state.activeTab] ?? '/'
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path)
    }
  }, [state.activeTab])

  // Sync state when the user navigates via browser back/forward
  useEffect(() => {
    const onPopState = () => {
      dispatch({ type: 'SET_TAB', payload: tabFromPath(window.location.pathname) })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Load fixtures + teams + stadiums
  useEffect(() => {
    // Tier 1: stadiums + teams | permanent, version-keyed localStorage.
    // Bump CACHE_VERSION manually if stadium/team data ever needs a forced refresh.
    const CACHE_VERSION = 'v1'
    const tier1Key = name => `wc26:${name}:${CACHE_VERSION}`

    function loadForever(name) {
      try {
        const raw = localStorage.getItem(tier1Key(name))
        return raw != null ? JSON.parse(raw) : null
      } catch { return null }
    }
    function saveForever(name, val) {
      try { localStorage.setItem(tier1Key(name), JSON.stringify(val)) } catch { }
    }

    // Tier 2: finished fixtures | permanent, merged by matchNumber, never expire.
    function loadFinished() {
      return loadForever('finished-fixtures') ?? {}
    }
    function saveFinishedMerge(newFinished) {
      const merged = { ...loadFinished() }
      for (const f of newFinished) merged[f.matchNumber] = f
      saveForever('finished-fixtures', merged)
      return merged
    }

    // Tier 3: upcoming/live shell | sessionStorage, event-triggered refetch.
    const SHELL_KEY = 'wc26:shell'
    const SHELL_TTL = 6 * 60 * 60 * 1000 // 6h fallback safety net
    const MATCH_DURATION_MS = 2.5 * 60 * 60 * 1000 // generous, covers ET + penalties

    function readShell() {
      try {
        const raw = sessionStorage.getItem(SHELL_KEY)
        return raw ? JSON.parse(raw) : null
      } catch { return null }
    }
    function writeShell(fixtures) {
      try { sessionStorage.setItem(SHELL_KEY, JSON.stringify({ ts: Date.now(), fixtures })) } catch { }
    }
    function shellIsStale(shell) {
      if (!shell) return true
      const { ts, fixtures } = shell
      const now = Date.now()
      if (now - ts > SHELL_TTL) return true
      return fixtures.some(f => {
        const kickoff = new Date(f.kickoffUtc).getTime()
        // (a) a cached "upcoming" match's kickoff has already passed - should be live by now
        if (f.status === 'upcoming' && kickoff <= now) return true
        // (b) a cached "live" match has run past a normal match duration - should be
        // finished by now, and any dependent knockout TBD slot should have resolved
        if (f.status === 'live' && now - kickoff > MATCH_DURATION_MS) return true
        return false
      })
    }

    async function fetchWithRetry(url, attempts = 3, delayMs = 800) {
      for (let i = 0; i < attempts; i++) {
        try {
          const r = await fetch(url)
          if (r.ok) return r.json()
          throw new Error(`HTTP ${r.status}`)
        } catch (err) {
          if (i === attempts - 1) throw err
          await new Promise(res => setTimeout(res, delayMs * (i + 1)))
        }
      }
    }

    async function fetchStadiums() {
      const urls = [
        `${API_BASE}/get/stadiums`,
        'https://cdn.jsdelivr.net/gh/rezarahiminia/worldcup2026@main/football.stadiums.json',
        'https://raw.githubusercontent.com/rezarahiminia/worldcup2026/main/football.stadiums.json',
      ]
      for (const url of urls) {
        try {
          const r = await fetch(url)
          if (r.ok) return r.json()
        } catch { }
      }
      throw new Error('All stadium sources failed')
    }

    function serveFromCache(cachedStadiumMap, cachedTeamByName, shell, finished, { offline, usingCache }) {
      const fixtures = [...finished, ...(shell?.fixtures ?? [])].sort((a, b) => a.matchNumber - b.matchNumber)
      dispatch({ type: 'STADIUMS_LOADED', payload: { list: Object.values(cachedStadiumMap ?? {}), map: cachedStadiumMap ?? {} } })
      dispatch({ type: 'FIXTURES_LOADED', payload: fixtures })
      dispatch({ type: 'TEAMS_LOADED', payload: cachedTeamByName ?? {} })
      dispatch({ type: 'SET_DATA_STATUS', payload: { isOffline: offline, usingCachedData: usingCache } })
    }

    async function load() {
      if (USE_MOCK) {
        const mockTeamByName = Object.fromEntries(MOCK_DATA.teams.map(t => [t.name, t]))
        const mockStadiumMap = Object.fromEntries(MOCK_DATA.stadiums.map(s => [s.id, s]))
        dispatch({ type: 'STADIUMS_LOADED', payload: { list: MOCK_DATA.stadiums, map: mockStadiumMap } })
        dispatch({ type: 'TEAMS_LOADED', payload: mockTeamByName })
        dispatch({ type: 'FIXTURES_LOADED', payload: MOCK_DATA.fixtures })
        return
      }

      const cachedStadiumMap = loadForever('stadiums')
      const cachedTeamByName = loadForever('teams')
      const shell = readShell()
      const finishedObj = loadFinished()
      const finished = Object.values(finishedObj)
      const hasAnyCache = shell || finished.length || cachedStadiumMap || cachedTeamByName

      // Offline: don't attempt a fetch at all — serve whatever cache exists immediately,
      // even if it's technically stale by Tier 3's rules. Stale-but-real data beats nothing.
      if (!navigator.onLine) {
        if (hasAnyCache) {
          serveFromCache(cachedStadiumMap, cachedTeamByName, shell, finished, { offline: true, usingCache: true })
        } else {
          dispatch({ type: 'FIXTURES_LOADED', payload: MOCK_DATA.fixtures })
          dispatch({ type: 'SET_DATA_STATUS', payload: { isOffline: true, usingCachedData: true } })
        }
        return
      }

      const needStadiums = !cachedStadiumMap
      const needTeams = !cachedTeamByName

      // Fully servable from fresh-enough cache | skip the games fetch entirely.
      // This is normal efficient caching, NOT a degraded state — don't flag usingCachedData.
      if (!shellIsStale(shell) && cachedStadiumMap && cachedTeamByName) {
        const fixtures = [...finished, ...shell.fixtures].sort((a, b) => a.matchNumber - b.matchNumber)
        dispatch({ type: 'STADIUMS_LOADED', payload: { list: Object.values(cachedStadiumMap), map: cachedStadiumMap } })
        dispatch({ type: 'FIXTURES_LOADED', payload: fixtures })
        dispatch({ type: 'TEAMS_LOADED', payload: cachedTeamByName })
        dispatch({ type: 'SET_DATA_STATUS', payload: { isOffline: false, usingCachedData: false } })
        return
      }

      const [gamesResult, teamsResult, stadiumsResult] = await Promise.allSettled([
        fetchWithRetry(`${API_BASE}/get/games`),
        needTeams ? fetchWithRetry(`${API_BASE}/get/teams`) : Promise.resolve(null),
        needStadiums ? fetchStadiums() : Promise.resolve(null),
      ])

      if (gamesResult.status === 'rejected') {
        console.warn('Games API failed:', gamesResult.reason.message)
        if (hasAnyCache) {
          serveFromCache(cachedStadiumMap, cachedTeamByName, shell, finished, { offline: false, usingCache: true })
        } else {
          dispatch({ type: 'FIXTURES_LOADED', payload: MOCK_DATA.fixtures })
          dispatch({ type: 'SET_DATA_STATUS', payload: { isOffline: false, usingCachedData: true } })
        }
        return
      }

      const stadiumMap = cachedStadiumMap
        ?? (stadiumsResult.status === 'fulfilled' ? buildStadiumMap(stadiumsResult.value) : {})
      if (needStadiums && stadiumsResult.status === 'fulfilled') saveForever('stadiums', stadiumMap)

      const allFixtures = adaptGames(gamesResult.value, stadiumMap)
      const teamByName = cachedTeamByName
        ?? (teamsResult.status === 'fulfilled' ? buildTeamByName(teamsResult.value) : {})
      if (needTeams && teamsResult.status === 'fulfilled') saveForever('teams', teamByName)

      // Split + cache: Tier 2 (finished, forever) / Tier 3 (upcoming+live, shell)
      const finishedNow = allFixtures.filter(f => f.status === 'finished')
      const activeNow = allFixtures.filter(f => f.status !== 'finished')
      saveFinishedMerge(finishedNow)
      writeShell(activeNow)

      dispatch({ type: 'STADIUMS_LOADED', payload: { list: Object.values(stadiumMap), map: stadiumMap } })
      dispatch({ type: 'FIXTURES_LOADED', payload: allFixtures })
      dispatch({ type: 'TEAMS_LOADED', payload: teamByName })
      dispatch({ type: 'SET_DATA_STATUS', payload: { isOffline: false, usingCachedData: false } })
    }

    loadRef.current = load
    load()
  }, [])

  // Refetch automatically when connectivity returns; flip isOffline instantly either way
  // so the UI banner responds immediately, even before the refetch completes.
  useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: 'SET_DATA_STATUS', payload: { isOffline: false } })
      loadRef.current?.()
    }
    const handleOffline = () => {
      dispatch({ type: 'SET_DATA_STATUS', payload: { isOffline: true, usingCachedData: true } })
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Poll live scores
  const pollLive = useCallback(async () => {
    if (USE_MOCK) return
    try {
      const res = await fetch(`${API_BASE}/get/games`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const games = await res.json()
      dispatch({
        type: 'LIVE_UPDATE',
        payload: mergeLiveScores(state.fixtures, games, state.stadiumMap),
      })
    } catch (err) {
      console.warn('Live poll failed:', err.message)
    }
  }, [state.fixtures, state.stadiumMap])

  // Tier 4: 30s base tick, but only actually hits the API every tick when
  // something is live/starting soon | otherwise 1-in-10 ticks (~5 min) when idle.
  useEffect(() => {
    if (state.isLoading) return
    let idleTicks = 0

    const interval = setInterval(() => {
      if (hasLiveActivity(fixturesRef.current)) {
        idleTicks = 0
        pollLive()
      } else {
        idleTicks++
        if (idleTicks >= POLL_IDLE_TICKS) {
          idleTicks = 0
          pollLive()
        }
      }
    }, POLL_BASE_MS)

    const onVisible = () => { if (document.visibilityState === 'visible') pollLive() }
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onVisible) }
  }, [pollLive, state.isLoading])

  const actions = {
    setTab: tab => dispatch({ type: 'SET_TAB', payload: tab }),
    setGroup: group => dispatch({ type: 'SET_GROUP', payload: group }),
    toggleMatch: id => dispatch({ type: 'TOGGLE_MATCH', payload: id }),
    expandMatch: id => dispatch({ type: 'EXPAND_MATCH', payload: id }),
    openModal: id => dispatch({ type: 'OPEN_MODAL', payload: id }),
    closeModal: () => dispatch({ type: 'CLOSE_MODAL' }),
    openTeamModal: code => dispatch({ type: 'OPEN_TEAM_MODAL', payload: code }),
    closeTeamModal: () => dispatch({ type: 'CLOSE_TEAM_MODAL' }),
    goToStadium: id => dispatch({ type: 'GO_TO_STADIUM', payload: id }),
    clearStadiumTarget: () => dispatch({ type: 'CLEAR_STADIUM_TARGET' }),
    toggleSearch: () => dispatch({ type: 'TOGGLE_SEARCH' }),
    setSearch: q => dispatch({ type: 'SET_SEARCH', payload: q }),
    toggleSettings: () => dispatch({ type: 'TOGGLE_SETTINGS' }),
    setTimezone: tz => dispatch({ type: 'SET_TIMEZONE', payload: tz }),
    setFavorite: code => dispatch({ type: 'SET_FAVORITE', payload: code }),
    setPrediction: (no, s) => dispatch({ type: 'SET_PREDICTION', payload: { matchNumber: no, side: s } }),
    clearPredictions: () => dispatch({ type: 'CLEAR_PREDICTIONS' }),
    setFontScale: scale => dispatch({ type: 'SET_FONT_SCALE', payload: scale }),
  }

  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  )
}