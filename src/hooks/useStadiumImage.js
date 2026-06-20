import { useState, useEffect } from 'react'

// Titles that don't match the stadium name exactly
const WIKI_OVERRIDES = {
  'GEHA Field at Arrowhead Stadium': 'Arrowhead_Stadium',
  'AT&T Stadium': 'AT%26T_Stadium',
}

export function useStadiumImage(stadiumName) {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!stadiumName) return
    setLoading(true)
    setImageUrl(null)

    const title = WIKI_OVERRIDES[stadiumName]
      ?? encodeURIComponent(stadiumName.replace(/ /g, '_'))

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setImageUrl(data?.originalimage?.source ?? data?.thumbnail?.source ?? null)
      })
      .catch(() => setImageUrl(null))
      .finally(() => setLoading(false))
  }, [stadiumName])

  return { imageUrl, loading }
}