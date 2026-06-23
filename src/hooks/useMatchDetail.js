import { useState, useEffect } from 'react'
import { getMatchDetail } from '@utils/adapters/sportsDbAdapter'

export function useMatchDetail(homeTeam, awayTeam) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!homeTeam || !awayTeam) { setLoading(false); return }
    setLoading(true)
    getMatchDetail(homeTeam, awayTeam)
      .then(setDetail)
      .finally(() => setLoading(false))
  }, [homeTeam, awayTeam])

  return {
    referee: detail?.referee ?? null,
    spectators: detail?.spectators ?? null,
    recap: detail?.recap ?? null,
    timeline: detail?.timeline ?? [],
    lineups: detail?.lineups ?? [],
    stats: detail?.stats ?? [],
    loading,
  }
}