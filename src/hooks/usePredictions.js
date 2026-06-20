import { useApp } from '@context/AppContext'

export function usePredictions() {
  const { predictions, fixtures, setPrediction, clearPredictions } = useApp()

  const getPrediction    = matchNumber => predictions[matchNumber] ?? null
  const hasPrediction    = matchNumber => matchNumber in predictions

  /** Count correct predictions for finished matches */
  const score = () => {
    let correct = 0, total = 0
    fixtures.forEach(f => {
      if (f.status !== 'finished' || !hasPrediction(f.matchNumber)) return
      const { home, away } = f.score ?? {}
      if (home == null || away == null) return
      total++
      const actual = home > away ? 'home' : away > home ? 'away' : 'draw'
      if (predictions[f.matchNumber] === actual) correct++
    })
    return { correct, total }
  }

  return { predictions, getPrediction, hasPrediction, setPrediction, clearPredictions, score }
}
