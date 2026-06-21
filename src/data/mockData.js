/**
 * FIFA World Cup 2026 — Mock Fixture Data
 *
 * Format mirrors TheStatsAPI fixtures JSON schema:
 *   https://thestatsapi.com/world-cup/data/fixtures.json
 *
 * ── API SWAP POINTS ────────────────────────────────────────────────────────
 *  Fixtures/Schedule  → fetch('https://thestatsapi.com/world-cup/data/fixtures.json')
 *  Live scores        → fetch('https://worldcup26.ir/get/games')
 *  Group standings    → fetch('https://worldcup26.ir/get/groups')
 *  Teams              → fetch('https://worldcup26.ir/get/teams')
 *  Stadiums           → fetch('https://worldcup26.ir/get/stadiums')
 *
 * ── EXTENSIONS (not in TheStatsAPI base schema) ────────────────────────────
 *  fixture.status   "upcoming" | "live" | "finished"
 *  fixture.score    { home: number|null, away: number|null }
 *  fixture.minute   number|null  (set only when status === "live")
 *  root.teams[]     team metadata (code, name, group, fifaRank, confederation, flag)
 *  root.stadiums[]  venue metadata
 *
 * ── SCORES ─────────────────────────────────────────────────────────────────
 *  Completed match scores (before 2026-06-15) are simulated for UI development.
 *  Today's live match score is also simulated.
 *  All future match scores are null — swap via live API when ready.
 */

export const MOCK_DATA = {
  name: "FIFA World Cup 2026 Fixtures",
  _isMock: true,
  tournament: {
    edition: "2026 FIFA World Cup",
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    totalMatches: 104,
    format: "12 groups of 4 → Round of 32 (32 teams) → R16 → QF → SF → Final",
    hosts: ["Canada", "Mexico", "United States"],
    competitionId: "comp_6107",
    seasonId: "sn_118868"
  },

  // ── STADIUMS ──────────────────────────────────────────────────────────────
  stadiums: [
    { id: "att",          name: "AT&T Stadium",            officialName: "Dallas Stadium",                city: "Arlington",       state: "TX", country: "USA",    hostCity: "dallas",         capacity: 94000 },
    { id: "azteca",       name: "Estadio Azteca",          officialName: "Mexico City Stadium",           city: "Mexico City",              country: "Mexico", hostCity: "mexico-city",    capacity: 83000 },
    { id: "metlife",      name: "MetLife Stadium",         officialName: "New York New Jersey Stadium",   city: "East Rutherford", state: "NJ", country: "USA",    hostCity: "new-york",       capacity: 82500 },
    { id: "mercedes-benz",name: "Mercedes-Benz Stadium",  officialName: "Atlanta Stadium",               city: "Atlanta",         state: "GA", country: "USA",    hostCity: "atlanta",        capacity: 75000 },
    { id: "arrowhead",    name: "Arrowhead Stadium",       officialName: "Kansas City Stadium",           city: "Kansas City",     state: "MO", country: "USA",    hostCity: "kansas-city",    capacity: 73000 },
    { id: "nrg",          name: "NRG Stadium",             officialName: "Houston Stadium",               city: "Houston",         state: "TX", country: "USA",    hostCity: "houston",        capacity: 72000 },
    { id: "levis",        name: "Levi's Stadium",          officialName: "San Francisco Bay Area Stadium",city: "Santa Clara",     state: "CA", country: "USA",    hostCity: "san-francisco",  capacity: 71000 },
    { id: "sofi",         name: "SoFi Stadium",            officialName: "Los Angeles Stadium",           city: "Inglewood",       state: "CA", country: "USA",    hostCity: "los-angeles",    capacity: 70000 },
    { id: "lincoln",      name: "Lincoln Financial Field", officialName: "Philadelphia Stadium",          city: "Philadelphia",    state: "PA", country: "USA",    hostCity: "philadelphia",   capacity: 69000 },
    { id: "lumen",        name: "Lumen Field",             officialName: "Seattle Stadium",               city: "Seattle",         state: "WA", country: "USA",    hostCity: "seattle",        capacity: 69000 },
    { id: "gillette",     name: "Gillette Stadium",        officialName: "Boston Stadium",                city: "Foxborough",      state: "MA", country: "USA",    hostCity: "boston",         capacity: 65000 },
    { id: "hard-rock",    name: "Hard Rock Stadium",       officialName: "Miami Stadium",                 city: "Miami Gardens",   state: "FL", country: "USA",    hostCity: "miami",          capacity: 65000 },
    { id: "bc-place",     name: "BC Place",                officialName: "BC Place Vancouver",            city: "Vancouver",                country: "Canada", hostCity: "vancouver",      capacity: 54000 },
    { id: "bbva",         name: "Estadio BBVA",            officialName: "Estadio Monterrey",             city: "Monterrey",                country: "Mexico", hostCity: "monterrey",      capacity: 53500 },
    { id: "akron",        name: "Estadio Akron",           officialName: "Estadio Guadalajara",           city: "Guadalajara",              country: "Mexico", hostCity: "guadalajara",    capacity: 48000 },
    { id: "bmo",          name: "BMO Field",               officialName: "Toronto Stadium",               city: "Toronto",                  country: "Canada", hostCity: "toronto",        capacity: 45000 }
  ],

  // ── TEAMS ─────────────────────────────────────────────────────────────────
  teams: [
    // Group A
    { code: "MEX", name: "Mexico",                  group: "A", fifaRank: 16, confederation: "CONCACAF", flag: "🇲🇽" },
    { code: "RSA", name: "South Africa",            group: "A", fifaRank: 62, confederation: "CAF",      flag: "🇿🇦" },
    { code: "KOR", name: "South Korea",             group: "A", fifaRank: 22, confederation: "AFC",      flag: "🇰🇷" },
    { code: "CZE", name: "Czechia",                 group: "A", fifaRank: 37, confederation: "UEFA",     flag: "🇨🇿" },
    // Group B
    { code: "CAN", name: "Canada",                  group: "B", fifaRank: 40, confederation: "CONCACAF", flag: "🇨🇦" },
    { code: "BIH", name: "Bosnia and Herzegovina",  group: "B", fifaRank: 60, confederation: "UEFA",     flag: "🇧🇦" },
    { code: "QAT", name: "Qatar",                   group: "B", fifaRank: 34, confederation: "AFC",      flag: "🇶🇦" },
    { code: "SUI", name: "Switzerland",             group: "B", fifaRank: 18, confederation: "UEFA",     flag: "🇨🇭" },
    // Group C
    { code: "BRA", name: "Brazil",                  group: "C", fifaRank:  5, confederation: "CONMEBOL", flag: "🇧🇷" },
    { code: "MAR", name: "Morocco",                 group: "C", fifaRank: 12, confederation: "CAF",      flag: "🇲🇦" },
    { code: "SCO", name: "Scotland",                group: "C", fifaRank: 28, confederation: "UEFA",     flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
    { code: "HAI", name: "Haiti",                   group: "C", fifaRank: 78, confederation: "CONCACAF", flag: "🇭🇹" },
    // Group D
    { code: "USA", name: "United States",           group: "D", fifaRank: 11, confederation: "CONCACAF", flag: "🇺🇸" },
    { code: "PAR", name: "Paraguay",                group: "D", fifaRank: 55, confederation: "CONMEBOL", flag: "🇵🇾" },
    { code: "AUS", name: "Australia",               group: "D", fifaRank: 23, confederation: "AFC",      flag: "🇦🇺" },
    { code: "TUR", name: "Türkiye",                 group: "D", fifaRank: 29, confederation: "UEFA",     flag: "🇹🇷" },
    // Group E
    { code: "GER", name: "Germany",                 group: "E", fifaRank:  9, confederation: "UEFA",     flag: "🇩🇪" },
    { code: "CUW", name: "Curaçao",                 group: "E", fifaRank: 90, confederation: "CONCACAF", flag: "🇨🇼" },
    { code: "CIV", name: "Ivory Coast",             group: "E", fifaRank: 38, confederation: "CAF",      flag: "🇨🇮" },
    { code: "ECU", name: "Ecuador",                 group: "E", fifaRank: 21, confederation: "CONMEBOL", flag: "🇪🇨" },
    // Group F
    { code: "NED", name: "Netherlands",             group: "F", fifaRank:  8, confederation: "UEFA",     flag: "🇳🇱" },
    { code: "JPN", name: "Japan",                   group: "F", fifaRank: 13, confederation: "AFC",      flag: "🇯🇵" },
    { code: "SWE", name: "Sweden",                  group: "F", fifaRank: 24, confederation: "UEFA",     flag: "🇸🇪" },
    { code: "TUN", name: "Tunisia",                 group: "F", fifaRank: 27, confederation: "CAF",      flag: "🇹🇳" },
    // Group G
    { code: "ESP", name: "Spain",                   group: "G", fifaRank:  3, confederation: "UEFA",     flag: "🇪🇸" },
    { code: "CPV", name: "Cape Verde",              group: "G", fifaRank: 47, confederation: "CAF",      flag: "🇨🇻" },
    { code: "KSA", name: "Saudi Arabia",            group: "G", fifaRank: 26, confederation: "AFC",      flag: "🇸🇦" },
    { code: "URU", name: "Uruguay",                 group: "G", fifaRank: 19, confederation: "CONMEBOL", flag: "🇺🇾" },
    // Group H
    { code: "BEL", name: "Belgium",                 group: "H", fifaRank:  7, confederation: "UEFA",     flag: "🇧🇪" },
    { code: "EGY", name: "Egypt",                   group: "H", fifaRank: 43, confederation: "CAF",      flag: "🇪🇬" },
    { code: "IRN", name: "Iran",                    group: "H", fifaRank: 39, confederation: "AFC",      flag: "🇮🇷" },
    { code: "NZL", name: "New Zealand",             group: "H", fifaRank: 85, confederation: "OFC",      flag: "🇳🇿" },
    // Group I
    { code: "FRA", name: "France",                  group: "I", fifaRank:  2, confederation: "UEFA",     flag: "🇫🇷" },
    { code: "SEN", name: "Senegal",                 group: "I", fifaRank: 20, confederation: "CAF",      flag: "🇸🇳" },
    { code: "IRQ", name: "Iraq",                    group: "I", fifaRank: 58, confederation: "AFC",      flag: "🇮🇶" },
    { code: "NOR", name: "Norway",                  group: "I", fifaRank: 17, confederation: "UEFA",     flag: "🇳🇴" },
    // Group J
    { code: "ARG", name: "Argentina",               group: "J", fifaRank:  1, confederation: "CONMEBOL", flag: "🇦🇷" },
    { code: "ALG", name: "Algeria",                 group: "J", fifaRank: 36, confederation: "CAF",      flag: "🇩🇿" },
    { code: "AUT", name: "Austria",                 group: "J", fifaRank: 25, confederation: "UEFA",     flag: "🇦🇹" },
    { code: "JOR", name: "Jordan",                  group: "J", fifaRank: 68, confederation: "AFC",      flag: "🇯🇴" },
    // Group K
    { code: "POR", name: "Portugal",                group: "K", fifaRank:  6, confederation: "UEFA",     flag: "🇵🇹" },
    { code: "COD", name: "Democratic Republic of the Congo",                group: "K", fifaRank: 56, confederation: "CAF",      flag: "🇨🇩" },
    { code: "UZB", name: "Uzbekistan",              group: "K", fifaRank: 50, confederation: "AFC",      flag: "🇺🇿" },
    { code: "COL", name: "Colombia",                group: "K", fifaRank: 13, confederation: "CONMEBOL", flag: "🇨🇴" },
    // Group L
    { code: "ENG", name: "England",                 group: "L", fifaRank:  4, confederation: "UEFA",     flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { code: "CRO", name: "Croatia",                 group: "L", fifaRank: 10, confederation: "UEFA",     flag: "🇭🇷" },
    { code: "GHA", name: "Ghana",                   group: "L", fifaRank: 30, confederation: "CAF",      flag: "🇬🇭" },
    { code: "PAN", name: "Panama",                  group: "L", fifaRank: 33, confederation: "CONCACAF", flag: "🇵🇦" }
  ],

  // ── FIXTURES ──────────────────────────────────────────────────────────────
  // status  : "finished" | "live" | "upcoming"
  // score   : { home: number|null, away: number|null }
  // minute  : number|null  — only set for status="live"
  // Scores before 2026-06-15 are simulated. Live score on Jun 15 is simulated.
  // All upcoming scores are null — replace via live API.
  fixtures: [

    // ═════════════════════════════════════════════════════════════════════════
    // GROUP STAGE — MATCHDAY 1  (Jun 11–17)
    // ═════════════════════════════════════════════════════════════════════════

    // Jun 11 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 1, date: "2026-06-11", kickoffUtc: "2026-06-11T19:00:00Z",
      stage: "group-stage", group: "A",
      homeTeam: "Mexico", awayTeam: "South Africa",
      stadium: "Estadio Azteca", hostCity: "mexico-city",
      status: "finished", score: { home: 2, away: 0 }, minute: null
    },

    // Jun 12 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 2, date: "2026-06-12", kickoffUtc: "2026-06-12T17:00:00Z",
      stage: "group-stage", group: "A",
      homeTeam: "South Korea", awayTeam: "Czechia",
      stadium: "NRG Stadium", hostCity: "houston",
      status: "finished", score: { home: 1, away: 1 }, minute: null
    },
    {
      matchNumber: 3, date: "2026-06-12", kickoffUtc: "2026-06-12T20:00:00Z",
      stage: "group-stage", group: "B",
      homeTeam: "Canada", awayTeam: "Bosnia and Herzegovina",
      stadium: "BMO Field", hostCity: "toronto",
      status: "finished", score: { home: 1, away: 0 }, minute: null
    },
    {
      matchNumber: 4, date: "2026-06-12", kickoffUtc: "2026-06-12T23:00:00Z",
      stage: "group-stage", group: "B",
      homeTeam: "Qatar", awayTeam: "Switzerland",
      stadium: "BC Place", hostCity: "vancouver",
      status: "finished", score: { home: 0, away: 2 }, minute: null
    },

    // Jun 13 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 5, date: "2026-06-13", kickoffUtc: "2026-06-13T19:00:00Z",
      stage: "group-stage", group: "D",
      homeTeam: "United States", awayTeam: "Paraguay",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "finished", score: { home: 2, away: 1 }, minute: null
    },
    {
      matchNumber: 6, date: "2026-06-13", kickoffUtc: "2026-06-13T22:00:00Z",
      stage: "group-stage", group: "C",
      homeTeam: "Brazil", awayTeam: "Morocco",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "finished", score: { home: 3, away: 1 }, minute: null
    },

    // Jun 14 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 7, date: "2026-06-14", kickoffUtc: "2026-06-14T16:00:00Z",
      stage: "group-stage", group: "C",
      homeTeam: "Haiti", awayTeam: "Scotland",
      stadium: "Hard Rock Stadium", hostCity: "miami",
      status: "finished", score: { home: 0, away: 2 }, minute: null
    },
    {
      matchNumber: 8, date: "2026-06-14", kickoffUtc: "2026-06-14T18:00:00Z",
      stage: "group-stage", group: "D",
      homeTeam: "Australia", awayTeam: "Türkiye",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "finished", score: { home: 1, away: 1 }, minute: null
    },
    {
      matchNumber: 9, date: "2026-06-14", kickoffUtc: "2026-06-14T19:00:00Z",
      stage: "group-stage", group: "E",
      homeTeam: "Germany", awayTeam: "Curaçao",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "finished", score: { home: 4, away: 0 }, minute: null
    },
    {
      matchNumber: 10, date: "2026-06-14", kickoffUtc: "2026-06-14T22:00:00Z",
      stage: "group-stage", group: "E",
      homeTeam: "Ivory Coast", awayTeam: "Ecuador",
      stadium: "Arrowhead Stadium", hostCity: "kansas-city",
      status: "finished", score: { home: 2, away: 2 }, minute: null
    },
    {
      matchNumber: 11, date: "2026-06-14", kickoffUtc: "2026-06-15T01:00:00Z",
      stage: "group-stage", group: "F",
      homeTeam: "Netherlands", awayTeam: "Japan",
      stadium: "Lumen Field", hostCity: "seattle",
      status: "finished", score: { home: 2, away: 1 }, minute: null
    },

    // Jun 15 — TODAY ──────────────────────────────────────────────────────────
    {
      matchNumber: 12, date: "2026-06-15", kickoffUtc: "2026-06-15T16:00:00Z",
      stage: "group-stage", group: "F",
      homeTeam: "Sweden", awayTeam: "Tunisia",
      stadium: "Levi's Stadium", hostCity: "san-francisco",
      status: "finished", score: { home: 1, away: 0 }, minute: null
    },
    {
      matchNumber: 13, date: "2026-06-15", kickoffUtc: "2026-06-15T19:00:00Z",
      stage: "group-stage", group: "G",
      homeTeam: "Spain", awayTeam: "Cape Verde",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "live", score: { home: 2, away: 0 }, minute: 67   // ← simulated live
    },
    {
      matchNumber: 14, date: "2026-06-15", kickoffUtc: "2026-06-15T22:00:00Z",
      stage: "group-stage", group: "H",
      homeTeam: "Belgium", awayTeam: "Egypt",
      stadium: "Lincoln Financial Field", hostCity: "philadelphia",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 15, date: "2026-06-15", kickoffUtc: "2026-06-16T01:00:00Z",
      stage: "group-stage", group: "G",
      homeTeam: "Saudi Arabia", awayTeam: "Uruguay",
      stadium: "Hard Rock Stadium", hostCity: "miami",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 16 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 16, date: "2026-06-16", kickoffUtc: "2026-06-16T19:00:00Z",
      stage: "group-stage", group: "H",
      homeTeam: "Iran", awayTeam: "New Zealand",
      stadium: "Gillette Stadium", hostCity: "boston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 17, date: "2026-06-16", kickoffUtc: "2026-06-16T22:00:00Z",
      stage: "group-stage", group: "I",
      homeTeam: "France", awayTeam: "Senegal",
      stadium: "NRG Stadium", hostCity: "houston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 18, date: "2026-06-16", kickoffUtc: "2026-06-17T01:00:00Z",
      stage: "group-stage", group: "I",
      homeTeam: "Iraq", awayTeam: "Norway",
      stadium: "Levi's Stadium", hostCity: "san-francisco",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 17 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 19, date: "2026-06-17", kickoffUtc: "2026-06-17T16:00:00Z",
      stage: "group-stage", group: "J",
      homeTeam: "Argentina", awayTeam: "Algeria",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 20, date: "2026-06-17", kickoffUtc: "2026-06-17T19:00:00Z",
      stage: "group-stage", group: "J",
      homeTeam: "Austria", awayTeam: "Jordan",
      stadium: "Arrowhead Stadium", hostCity: "kansas-city",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 21, date: "2026-06-17", kickoffUtc: "2026-06-17T20:00:00Z",
      stage: "group-stage", group: "K",
      homeTeam: "Portugal", awayTeam: "DR Congo",
      stadium: "Gillette Stadium", hostCity: "boston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 22, date: "2026-06-17", kickoffUtc: "2026-06-17T22:00:00Z",
      stage: "group-stage", group: "L",
      homeTeam: "England", awayTeam: "Croatia",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 23, date: "2026-06-17", kickoffUtc: "2026-06-18T01:00:00Z",
      stage: "group-stage", group: "L",
      homeTeam: "Ghana", awayTeam: "Panama",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // ═════════════════════════════════════════════════════════════════════════
    // GROUP STAGE — MATCHDAY 2  (Jun 18–24)
    // ═════════════════════════════════════════════════════════════════════════

    // Jun 18 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 24, date: "2026-06-18", kickoffUtc: "2026-06-18T19:00:00Z",
      stage: "group-stage", group: "K",
      homeTeam: "Uzbekistan", awayTeam: "Colombia",
      stadium: "Lumen Field", hostCity: "seattle",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 25, date: "2026-06-18", kickoffUtc: "2026-06-18T20:00:00Z",
      stage: "group-stage", group: "A",
      homeTeam: "Czechia", awayTeam: "South Africa",
      stadium: "Estadio BBVA", hostCity: "monterrey",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 26, date: "2026-06-18", kickoffUtc: "2026-06-18T23:00:00Z",
      stage: "group-stage", group: "B",
      homeTeam: "Switzerland", awayTeam: "Bosnia and Herzegovina",
      stadium: "BMO Field", hostCity: "toronto",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 27, date: "2026-06-18", kickoffUtc: "2026-06-19T01:00:00Z",
      stage: "group-stage", group: "B",
      homeTeam: "Canada", awayTeam: "Qatar",
      stadium: "BC Place", hostCity: "vancouver",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 19 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 28, date: "2026-06-19", kickoffUtc: "2026-06-19T19:00:00Z",
      stage: "group-stage", group: "A",
      homeTeam: "Mexico", awayTeam: "South Korea",
      stadium: "Estadio Azteca", hostCity: "mexico-city",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 29, date: "2026-06-19", kickoffUtc: "2026-06-19T22:00:00Z",
      stage: "group-stage", group: "D",
      homeTeam: "United States", awayTeam: "Australia",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 30, date: "2026-06-19", kickoffUtc: "2026-06-20T01:00:00Z",
      stage: "group-stage", group: "C",
      homeTeam: "Scotland", awayTeam: "Morocco",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 20 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 31, date: "2026-06-20", kickoffUtc: "2026-06-20T17:00:00Z",
      stage: "group-stage", group: "C",
      homeTeam: "Brazil", awayTeam: "Haiti",
      stadium: "Hard Rock Stadium", hostCity: "miami",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 32, date: "2026-06-20", kickoffUtc: "2026-06-20T20:00:00Z",
      stage: "group-stage", group: "D",
      homeTeam: "Türkiye", awayTeam: "Paraguay",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 33, date: "2026-06-20", kickoffUtc: "2026-06-20T23:00:00Z",
      stage: "group-stage", group: "F",
      homeTeam: "Netherlands", awayTeam: "Sweden",
      stadium: "Lumen Field", hostCity: "seattle",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 34, date: "2026-06-20", kickoffUtc: "2026-06-21T01:00:00Z",
      stage: "group-stage", group: "E",
      homeTeam: "Germany", awayTeam: "Ivory Coast",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 21 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 35, date: "2026-06-21", kickoffUtc: "2026-06-21T16:00:00Z",
      stage: "group-stage", group: "E",
      homeTeam: "Ecuador", awayTeam: "Curaçao",
      stadium: "NRG Stadium", hostCity: "houston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 36, date: "2026-06-21", kickoffUtc: "2026-06-21T19:00:00Z",
      stage: "group-stage", group: "F",
      homeTeam: "Tunisia", awayTeam: "Japan",
      stadium: "Arrowhead Stadium", hostCity: "kansas-city",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 37, date: "2026-06-21", kickoffUtc: "2026-06-21T21:00:00Z",
      stage: "group-stage", group: "G",
      homeTeam: "Spain", awayTeam: "Saudi Arabia",
      stadium: "Gillette Stadium", hostCity: "boston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 38, date: "2026-06-21", kickoffUtc: "2026-06-21T23:00:00Z",
      stage: "group-stage", group: "H",
      homeTeam: "Belgium", awayTeam: "Iran",
      stadium: "Lincoln Financial Field", hostCity: "philadelphia",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 39, date: "2026-06-21", kickoffUtc: "2026-06-22T01:00:00Z",
      stage: "group-stage", group: "G",
      homeTeam: "Uruguay", awayTeam: "Cape Verde",
      stadium: "Hard Rock Stadium", hostCity: "miami",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 22 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 40, date: "2026-06-22", kickoffUtc: "2026-06-22T19:00:00Z",
      stage: "group-stage", group: "H",
      homeTeam: "New Zealand", awayTeam: "Egypt",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 41, date: "2026-06-22", kickoffUtc: "2026-06-22T22:00:00Z",
      stage: "group-stage", group: "J",
      homeTeam: "Argentina", awayTeam: "Austria",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 42, date: "2026-06-22", kickoffUtc: "2026-06-23T01:00:00Z",
      stage: "group-stage", group: "I",
      homeTeam: "France", awayTeam: "Iraq",
      stadium: "Levi's Stadium", hostCity: "san-francisco",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 23 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 43, date: "2026-06-23", kickoffUtc: "2026-06-23T17:00:00Z",
      stage: "group-stage", group: "I",
      homeTeam: "Norway", awayTeam: "Senegal",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 44, date: "2026-06-23", kickoffUtc: "2026-06-23T19:00:00Z",
      stage: "group-stage", group: "J",
      homeTeam: "Jordan", awayTeam: "Algeria",
      stadium: "Arrowhead Stadium", hostCity: "kansas-city",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 45, date: "2026-06-23", kickoffUtc: "2026-06-23T20:00:00Z",
      stage: "group-stage", group: "K",
      homeTeam: "Portugal", awayTeam: "Uzbekistan",
      stadium: "NRG Stadium", hostCity: "houston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 46, date: "2026-06-23", kickoffUtc: "2026-06-23T22:00:00Z",
      stage: "group-stage", group: "L",
      homeTeam: "England", awayTeam: "Ghana",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 47, date: "2026-06-23", kickoffUtc: "2026-06-24T01:00:00Z",
      stage: "group-stage", group: "L",
      homeTeam: "Panama", awayTeam: "Croatia",
      stadium: "Lumen Field", hostCity: "seattle",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 24 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 48, date: "2026-06-24", kickoffUtc: "2026-06-24T17:00:00Z",
      stage: "group-stage", group: "K",
      homeTeam: "Colombia", awayTeam: "DR Congo",
      stadium: "Levi's Stadium", hostCity: "san-francisco",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 49, date: "2026-06-24", kickoffUtc: "2026-06-24T19:00:00Z",  // simultaneous
      stage: "group-stage", group: "B",
      homeTeam: "Switzerland", awayTeam: "Canada",
      stadium: "BMO Field", hostCity: "toronto",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 50, date: "2026-06-24", kickoffUtc: "2026-06-24T19:00:00Z",  // simultaneous
      stage: "group-stage", group: "B",
      homeTeam: "Bosnia and Herzegovina", awayTeam: "Qatar",
      stadium: "BC Place", hostCity: "vancouver",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 51, date: "2026-06-24", kickoffUtc: "2026-06-24T22:00:00Z",  // simultaneous
      stage: "group-stage", group: "C",
      homeTeam: "Scotland", awayTeam: "Brazil",
      stadium: "Gillette Stadium", hostCity: "boston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 52, date: "2026-06-24", kickoffUtc: "2026-06-24T22:00:00Z",  // simultaneous
      stage: "group-stage", group: "C",
      homeTeam: "Morocco", awayTeam: "Haiti",
      stadium: "Lincoln Financial Field", hostCity: "philadelphia",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // ═════════════════════════════════════════════════════════════════════════
    // GROUP STAGE — MATCHDAY 3  (Jun 25–28)
    // ═════════════════════════════════════════════════════════════════════════

    // Jun 25 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 53, date: "2026-06-25", kickoffUtc: "2026-06-25T20:00:00Z",  // simultaneous
      stage: "group-stage", group: "A",
      homeTeam: "South Africa", awayTeam: "South Korea",
      stadium: "Estadio BBVA", hostCity: "monterrey",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 54, date: "2026-06-25", kickoffUtc: "2026-06-25T20:00:00Z",  // simultaneous
      stage: "group-stage", group: "A",
      homeTeam: "Czechia", awayTeam: "Mexico",
      stadium: "Estadio Akron", hostCity: "guadalajara",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 55, date: "2026-06-25", kickoffUtc: "2026-06-25T23:00:00Z",  // simultaneous
      stage: "group-stage", group: "E",
      homeTeam: "Ecuador", awayTeam: "Germany",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 56, date: "2026-06-25", kickoffUtc: "2026-06-25T23:00:00Z",  // simultaneous
      stage: "group-stage", group: "E",
      homeTeam: "Curaçao", awayTeam: "Ivory Coast",
      stadium: "NRG Stadium", hostCity: "houston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 57, date: "2026-06-25", kickoffUtc: "2026-06-26T02:00:00Z",  // simultaneous
      stage: "group-stage", group: "F",
      homeTeam: "Tunisia", awayTeam: "Netherlands",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 58, date: "2026-06-25", kickoffUtc: "2026-06-26T02:00:00Z",  // simultaneous
      stage: "group-stage", group: "F",
      homeTeam: "Japan", awayTeam: "Sweden",
      stadium: "Lincoln Financial Field", hostCity: "philadelphia",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 26 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 59, date: "2026-06-26", kickoffUtc: "2026-06-26T21:00:00Z",  // simultaneous
      stage: "group-stage", group: "D",
      homeTeam: "Paraguay", awayTeam: "Australia",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 60, date: "2026-06-26", kickoffUtc: "2026-06-26T21:00:00Z",  // simultaneous
      stage: "group-stage", group: "D",
      homeTeam: "Türkiye", awayTeam: "United States",
      stadium: "Arrowhead Stadium", hostCity: "kansas-city",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 61, date: "2026-06-26", kickoffUtc: "2026-06-27T00:00:00Z",  // simultaneous
      stage: "group-stage", group: "I",
      homeTeam: "Norway", awayTeam: "France",
      stadium: "Gillette Stadium", hostCity: "boston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 62, date: "2026-06-26", kickoffUtc: "2026-06-27T00:00:00Z",  // simultaneous
      stage: "group-stage", group: "I",
      homeTeam: "Senegal", awayTeam: "Iraq",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 27 ─────────────────────────────────────────────────────────────────
    {
      matchNumber: 63, date: "2026-06-27", kickoffUtc: "2026-06-27T20:00:00Z",  // simultaneous
      stage: "group-stage", group: "G",
      homeTeam: "Uruguay", awayTeam: "Spain",
      stadium: "Hard Rock Stadium", hostCity: "miami",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 64, date: "2026-06-27", kickoffUtc: "2026-06-27T20:00:00Z",  // simultaneous
      stage: "group-stage", group: "G",
      homeTeam: "Cape Verde", awayTeam: "Saudi Arabia",
      stadium: "BC Place", hostCity: "vancouver",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 65, date: "2026-06-27", kickoffUtc: "2026-06-27T23:00:00Z",  // simultaneous
      stage: "group-stage", group: "H",
      homeTeam: "New Zealand", awayTeam: "Belgium",
      stadium: "Levi's Stadium", hostCity: "san-francisco",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 66, date: "2026-06-27", kickoffUtc: "2026-06-27T23:00:00Z",  // simultaneous
      stage: "group-stage", group: "H",
      homeTeam: "Egypt", awayTeam: "Iran",
      stadium: "Lumen Field", hostCity: "seattle",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 67, date: "2026-06-27", kickoffUtc: "2026-06-28T02:00:00Z",  // simultaneous
      stage: "group-stage", group: "L",
      homeTeam: "Panama", awayTeam: "England",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 68, date: "2026-06-27", kickoffUtc: "2026-06-28T02:00:00Z",  // simultaneous
      stage: "group-stage", group: "L",
      homeTeam: "Croatia", awayTeam: "Ghana",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 69, date: "2026-06-27", kickoffUtc: "2026-06-28T04:00:00Z",  // simultaneous
      stage: "group-stage", group: "K",
      homeTeam: "Colombia", awayTeam: "Portugal",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 70, date: "2026-06-27", kickoffUtc: "2026-06-28T04:00:00Z",  // simultaneous
      stage: "group-stage", group: "K",
      homeTeam: "DR Congo", awayTeam: "Uzbekistan",
      stadium: "Lumen Field", hostCity: "seattle",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // Jun 28 — final group-stage day ─────────────────────────────────────────
    {
      matchNumber: 71, date: "2026-06-28", kickoffUtc: "2026-06-28T20:00:00Z",  // simultaneous
      stage: "group-stage", group: "J",
      homeTeam: "Jordan", awayTeam: "Argentina",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 72, date: "2026-06-28", kickoffUtc: "2026-06-28T20:00:00Z",  // simultaneous
      stage: "group-stage", group: "J",
      homeTeam: "Algeria", awayTeam: "Austria",
      stadium: "Arrowhead Stadium", hostCity: "kansas-city",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // ═════════════════════════════════════════════════════════════════════════
    // ROUND OF 32  (Jun 29 – Jul 3)  — 16 matches
    // homeTeam/awayTeam are bracket placeholders until group stage resolves
    // ═════════════════════════════════════════════════════════════════════════
    {
      matchNumber: 73, date: "2026-06-29", kickoffUtc: "2026-06-29T19:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group A", awayTeam: "Best 3rd (C/D/E/F)",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 74, date: "2026-06-29", kickoffUtc: "2026-06-29T22:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group B", awayTeam: "Best 3rd (A/G/H)",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 75, date: "2026-06-29", kickoffUtc: "2026-06-30T01:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group C", awayTeam: "2nd Group D",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 76, date: "2026-06-30", kickoffUtc: "2026-06-30T19:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group D", awayTeam: "2nd Group C",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 77, date: "2026-06-30", kickoffUtc: "2026-06-30T22:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group E", awayTeam: "Best 3rd (I/J/K/L)",
      stadium: "Arrowhead Stadium", hostCity: "kansas-city",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 78, date: "2026-06-30", kickoffUtc: "2026-07-01T01:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group F", awayTeam: "2nd Group E",
      stadium: "NRG Stadium", hostCity: "houston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 79, date: "2026-07-01", kickoffUtc: "2026-07-01T19:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group G", awayTeam: "2nd Group H",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 80, date: "2026-07-01", kickoffUtc: "2026-07-01T22:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group H", awayTeam: "2nd Group G",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 81, date: "2026-07-01", kickoffUtc: "2026-07-02T01:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group I", awayTeam: "Best 3rd (B/K/L)",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 82, date: "2026-07-02", kickoffUtc: "2026-07-02T19:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group J", awayTeam: "2nd Group I",
      stadium: "Levi's Stadium", hostCity: "san-francisco",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 83, date: "2026-07-02", kickoffUtc: "2026-07-02T22:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group K", awayTeam: "2nd Group L",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 84, date: "2026-07-02", kickoffUtc: "2026-07-03T01:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "1st Group L", awayTeam: "2nd Group K",
      stadium: "Arrowhead Stadium", hostCity: "kansas-city",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 85, date: "2026-07-03", kickoffUtc: "2026-07-03T18:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "2nd Group A", awayTeam: "Best 3rd (B/E/F)",
      stadium: "Gillette Stadium", hostCity: "boston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 86, date: "2026-07-03", kickoffUtc: "2026-07-03T21:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "2nd Group B", awayTeam: "Best 3rd (A/C/D)",
      stadium: "Lincoln Financial Field", hostCity: "philadelphia",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 87, date: "2026-07-03", kickoffUtc: "2026-07-04T00:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "2nd Group F", awayTeam: "2nd Group J",
      stadium: "NRG Stadium", hostCity: "houston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 88, date: "2026-07-03", kickoffUtc: "2026-07-04T02:00:00Z",
      stage: "round-of-32", group: null,
      homeTeam: "2nd Group I", awayTeam: "2nd Group J",
      stadium: "Lumen Field", hostCity: "seattle",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // ═════════════════════════════════════════════════════════════════════════
    // ROUND OF 16  (Jul 4–7)  — 8 matches
    // ═════════════════════════════════════════════════════════════════════════
    {
      matchNumber: 89, date: "2026-07-04", kickoffUtc: "2026-07-04T19:00:00Z",
      stage: "round-of-16", group: null,
      homeTeam: "Winner Match 73", awayTeam: "Winner Match 76",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 90, date: "2026-07-04", kickoffUtc: "2026-07-04T23:00:00Z",
      stage: "round-of-16", group: null,
      homeTeam: "Winner Match 74", awayTeam: "Winner Match 77",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 91, date: "2026-07-05", kickoffUtc: "2026-07-05T19:00:00Z",
      stage: "round-of-16", group: null,
      homeTeam: "Winner Match 75", awayTeam: "Winner Match 78",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 92, date: "2026-07-05", kickoffUtc: "2026-07-05T23:00:00Z",
      stage: "round-of-16", group: null,
      homeTeam: "Winner Match 79", awayTeam: "Winner Match 82",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 93, date: "2026-07-06", kickoffUtc: "2026-07-06T19:00:00Z",
      stage: "round-of-16", group: null,
      homeTeam: "Winner Match 80", awayTeam: "Winner Match 83",
      stadium: "Arrowhead Stadium", hostCity: "kansas-city",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 94, date: "2026-07-06", kickoffUtc: "2026-07-06T23:00:00Z",
      stage: "round-of-16", group: null,
      homeTeam: "Winner Match 81", awayTeam: "Winner Match 84",
      stadium: "NRG Stadium", hostCity: "houston",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 95, date: "2026-07-07", kickoffUtc: "2026-07-07T19:00:00Z",
      stage: "round-of-16", group: null,
      homeTeam: "Winner Match 85", awayTeam: "Winner Match 87",
      stadium: "Levi's Stadium", hostCity: "san-francisco",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 96, date: "2026-07-07", kickoffUtc: "2026-07-07T23:00:00Z",
      stage: "round-of-16", group: null,
      homeTeam: "Winner Match 86", awayTeam: "Winner Match 88",
      stadium: "Lumen Field", hostCity: "seattle",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // ═════════════════════════════════════════════════════════════════════════
    // QUARTER-FINALS  (Jul 9–10)  — 4 matches
    // ═════════════════════════════════════════════════════════════════════════
    {
      matchNumber: 97, date: "2026-07-09", kickoffUtc: "2026-07-09T19:00:00Z",
      stage: "quarter-finals", group: null,
      homeTeam: "Winner Match 89", awayTeam: "Winner Match 90",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 98, date: "2026-07-09", kickoffUtc: "2026-07-09T23:00:00Z",
      stage: "quarter-finals", group: null,
      homeTeam: "Winner Match 91", awayTeam: "Winner Match 92",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 99, date: "2026-07-10", kickoffUtc: "2026-07-10T19:00:00Z",
      stage: "quarter-finals", group: null,
      homeTeam: "Winner Match 93", awayTeam: "Winner Match 94",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 100, date: "2026-07-10", kickoffUtc: "2026-07-10T23:00:00Z",
      stage: "quarter-finals", group: null,
      homeTeam: "Winner Match 95", awayTeam: "Winner Match 96",
      stadium: "Mercedes-Benz Stadium", hostCity: "atlanta",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // ═════════════════════════════════════════════════════════════════════════
    // SEMI-FINALS  (Jul 14–15)  — 2 matches
    // ═════════════════════════════════════════════════════════════════════════
    {
      matchNumber: 101, date: "2026-07-14", kickoffUtc: "2026-07-14T23:00:00Z",
      stage: "semi-finals", group: null,
      homeTeam: "Winner Match 97", awayTeam: "Winner Match 98",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },
    {
      matchNumber: 102, date: "2026-07-15", kickoffUtc: "2026-07-15T23:00:00Z",
      stage: "semi-finals", group: null,
      homeTeam: "Winner Match 99", awayTeam: "Winner Match 100",
      stadium: "AT&T Stadium", hostCity: "dallas",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // ═════════════════════════════════════════════════════════════════════════
    // THIRD-PLACE PLAY-OFF  (Jul 18)
    // ═════════════════════════════════════════════════════════════════════════
    {
      matchNumber: 103, date: "2026-07-18", kickoffUtc: "2026-07-18T23:00:00Z",
      stage: "third-place", group: null,
      homeTeam: "Loser Match 101", awayTeam: "Loser Match 102",
      stadium: "SoFi Stadium", hostCity: "los-angeles",
      status: "upcoming", score: { home: null, away: null }, minute: null
    },

    // ═════════════════════════════════════════════════════════════════════════
    // FINAL  (Jul 19)
    // ═════════════════════════════════════════════════════════════════════════
    {
      matchNumber: 104, date: "2026-07-19", kickoffUtc: "2026-07-19T21:00:00Z",
      stage: "final", group: null,
      homeTeam: "Winner Match 101", awayTeam: "Winner Match 102",
      stadium: "MetLife Stadium", hostCity: "new-york",
      status: "upcoming", score: { home: null, away: null }, minute: null
    }
  ]
};

// ── CONVENIENCE LOOKUPS ───────────────────────────────────────────────────────
// Build maps for O(1) access in the app

export const TEAM_BY_CODE = Object.fromEntries(
  MOCK_DATA.teams.map(t => [t.code, t])
);

export const TEAM_BY_NAME = Object.fromEntries(
  MOCK_DATA.teams.map(t => [t.name, t])
);

export const STADIUM_BY_ID = Object.fromEntries(
  MOCK_DATA.stadiums.map(s => [s.id, s])
);

export const FIXTURES_BY_STAGE = MOCK_DATA.fixtures.reduce((acc, f) => {
  if (!acc[f.stage]) acc[f.stage] = [];
  acc[f.stage].push(f);
  return acc;
}, {});

export const FIXTURES_BY_GROUP = MOCK_DATA.fixtures
  .filter(f => f.group)
  .reduce((acc, f) => {
    if (!acc[f.group]) acc[f.group] = [];
    acc[f.group].push(f);
    return acc;
  }, {});

export const GROUPS = [...new Set(MOCK_DATA.teams.map(t => t.group))].sort();
