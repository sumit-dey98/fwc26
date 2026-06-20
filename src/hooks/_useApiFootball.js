import { useState, useEffect } from 'react'
import { getTeamSquad } from '@utils/adapters/apiFootballAdapter'

export function useTeamSquad(fifaCode) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!fifaCode) return
    setLoading(true)
    getTeamSquad(fifaCode)
      .then(setData)
      .finally(() => setLoading(false))
  }, [fifaCode])

  return { squad: data?.players ?? [], coach: data?.coach ?? null, loading }
}

export function useVenueImage(venueName) {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!venueName) return
    setLoading(true)
    getVenueImage(venueName)
      .then(setImage)
      .finally(() => setLoading(false))
  }, [venueName])

  return { image, loading }
}

export function useFixtureReferee(homeTeamCode, awayTeamCode, dateISO) {
  const [referee, setReferee] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!homeTeamCode || !awayTeamCode || !dateISO) return
    setLoading(true)
    getFixtureReferee(homeTeamCode, awayTeamCode, dateISO)
      .then(setReferee)
      .finally(() => setLoading(false))
  }, [homeTeamCode, awayTeamCode, dateISO])

  return { referee, loading }
}