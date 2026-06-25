import { MOCK_DATA } from '@data/mockData'

// Pre-built lookup maps
export const TEAM_BY_NAME = Object.fromEntries(
  MOCK_DATA.teams.map(t => [t.name, t])
)

export const TEAM_BY_CODE = Object.fromEntries(
  MOCK_DATA.teams.map(t => [t.code, t])
)

export const STADIUM_BY_ID = Object.fromEntries(
  MOCK_DATA.stadiums.map(s => [s.id, s])
)

export const STADIUM_BY_NAME = Object.fromEntries(
  MOCK_DATA.stadiums.map(s => [s.name, s])
)

export const getTeam = name =>
  TEAM_BY_NAME[name] ?? { name, code: '???', flag: '🏳️', group: null, fifaRank: null, confederation: null }

export const getTeamByCode = code =>
  TEAM_BY_CODE[code] ?? null

export const getStadium = name =>
  STADIUM_BY_NAME[name] ?? null

export const teamsByGroup = (group) =>
  MOCK_DATA.teams.filter(t => t.group === group)

export const allGroups = () =>
  [...new Set(MOCK_DATA.teams.map(t => t.group))].sort()

export const stadiumsByCountry = (country) =>
  MOCK_DATA.stadiums.filter(s => s.country === country)

/** Flag component class for flag-icons library */
export const flagClass = (teamName) => {
  const team = getTeam(teamName)
  if (!team?.code) return ''
  const codeMap = {
    'SCO': 'gb-sct', 'ENG': 'gb-eng', 'WAL': 'gb-wls',
    'NIR': 'gb-nir', 'RSA': 'za', 'KOR': 'kr',
    'CZE': 'cz', 'BIH': 'ba', 'QAT': 'qa',
    'SUI': 'ch', 'BRA': 'br', 'MAR': 'ma',
    'HAI': 'ht', 'USA': 'us', 'PAR': 'py',
    'AUS': 'au', 'TUR': 'tr', 'GER': 'de',
    'CUW': 'cw', 'CIV': 'ci', 'ECU': 'ec',
    'NED': 'nl', 'JPN': 'jp', 'SWE': 'se',
    'TUN': 'tn', 'ESP': 'es', 'CPV': 'cv',
    'KSA': 'sa', 'URU': 'uy', 'BEL': 'be',
    'EGY': 'eg', 'IRN': 'ir', 'NZL': 'nz',
    'FRA': 'fr', 'SEN': 'sn', 'IRQ': 'iq',
    'NOR': 'no', 'ARG': 'ar', 'ALG': 'dz',
    'AUT': 'at', 'JOR': 'jo', 'POR': 'pt',
    'COD': 'cd', 'UZB': 'uz', 'COL': 'co',
    'CRO': 'hr', 'GHA': 'gh', 'PAN': 'pa',
    'CAN': 'ca', 'MEX': 'mx', 'NOR': 'no',
  }
  const iso = codeMap[team.code] ?? team.code.toLowerCase()
  return `fi fi-${iso}`
}

/** Get team name from code - for favorite matching */
export const teamNameFromCode = code =>
  TEAM_BY_CODE[code]?.name ?? null

/** Short display names for teams with long official names */
const SHORT_NAMES = {
  'Democratic Republic of the Congo': 'DR Congo',
  'Bosnia and Herzegovina': 'Bosnia & Herz.',
  'Bosnia And Herzegovina': 'Bosnia & Herz.',
}

export const getDisplayName = name => SHORT_NAMES[name] ?? name

/**
 * TheSportsDB sometimes uses different team names than worldcup26.ir.
 * Confirmed mismatches go here; add more as they're discovered through testing.
 * Falls back to the worldcup26.ir display name when no override exists.
 */
const SPORTSDB_NAME_OVERRIDES = {
  'BIH': 'Bosnia-Herzegovina',   // worldcup26.ir: "Bosnia and Herzegovina"
  'USA': 'USA',                  // worldcup26.ir: "United States"
}

export const sportsDbNameFor = code => SPORTSDB_NAME_OVERRIDES[code] ?? null