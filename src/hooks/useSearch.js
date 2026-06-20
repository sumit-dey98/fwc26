import { useMemo } from 'react'
import { useApp } from '@context/AppContext'

function normalise(str) {
  return String(str ?? '').toLowerCase().trim()
}

function matchQuery(haystack, needle) {
  return normalise(haystack).includes(normalise(needle))
}

export function useSearch() {
  const { fixtures, searchQuery, setSearch, teamByName, stadiums } = useApp()

  const results = useMemo(() => {
    const q = searchQuery.trim()
    if (q.length < 2) return { teams: [], matches: [], stadiums: [] }

    const teams = Object.values(teamByName).filter(t =>
      matchQuery(t.name, q) || matchQuery(t.code, q) || matchQuery(t.group, q)
    ).slice(0, 6)

    const matches = fixtures.filter(f =>
      matchQuery(f.homeTeam, q) ||
      matchQuery(f.awayTeam, q) ||
      matchQuery(f.stadium, q) ||
      matchQuery(f.hostCity, q)
    ).slice(0, 8)

    const matchedStadiums = (stadiums ?? []).filter(s =>
      matchQuery(s.name, q) || matchQuery(s.city, q) || matchQuery(s.country, q)
    ).slice(0, 4)

    return { teams, matches, stadiums: matchedStadiums }
  }, [fixtures, searchQuery, teamByName, stadiums])

  const hasResults = results.teams.length + results.matches.length + results.stadiums.length > 0

  return { results, hasResults, searchQuery, setSearch }
}