export const TAB_TO_PATH = {
  group: '/',
  r32: '/round-of-32',
  r16: '/round-of-16',
  finals: '/finals',
  predictor: '/predictor',
  stats: '/stats',
  stadiums: '/stadiums',
  teams: '/teams',
}

export const PATH_TO_TAB = Object.fromEntries(
  Object.entries(TAB_TO_PATH).map(([tab, path]) => [path, tab])
)

export function tabFromPath(pathname) {
  return PATH_TO_TAB[pathname] ?? 'group'
}

export const STAGE_TO_TAB = {
  'group-stage': 'group',
  'round-of-32': 'r32',
  'round-of-16': 'r16',
  'quarter-finals': 'finals',
  'semi-finals': 'finals',
  'third-place': 'finals',
  'final': 'finals',
}

export const tabForStage = stage => STAGE_TO_TAB[stage] ?? 'group'