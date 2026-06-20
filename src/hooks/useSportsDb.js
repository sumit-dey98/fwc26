import { useState, useEffect } from 'react'
import { getTeamSquad } from '@utils/adapters/sportsDbAdapter'

export function useTeamSquad(fifaCode, displayName) {
  const [squad, setSquad] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!fifaCode) { setLoading(false); return }
    setLoading(true)
    getTeamSquad(fifaCode, displayName)
      .then(res => setSquad(res?.players ?? []))
      .finally(() => setLoading(false))
  }, [fifaCode, displayName])

  return { squad, loading }
}