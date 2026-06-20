import { useState, useMemo } from 'react'
import { useApp } from '@context/AppContext'
import { usePredictions } from '@hooks/usePredictions'
import { resolvePredictedBracket } from '@utils/bracketResolver'
import BracketSlot from './BracketSlot'
import GroupRankPicker from './GroupRankPicker'
import { byStage } from '@utils/fixtures'
import { RotateCcw, ArrowRight } from 'lucide-react'
import PredictorHelp from './PredictorHelp'
import { cn } from '@utils/cn'

const BRACKET_STAGES = [
  { stage: 'round-of-32', label: 'R32' },
  { stage: 'round-of-16', label: 'R16' },
  { stage: 'quarter-finals', label: 'QF' },
  { stage: 'semi-finals', label: 'SF' },
  { stage: 'final', label: 'Final' },
]

const MAX_BEST_THIRDS = 8

export default function BracketView() {
  const { fixtures } = useApp()
  const { predictions, getPrediction, setPrediction, score, clearPredictions } = usePredictions()
  const [step, setStep] = useState('picks') 
  const [groupPicks, setGroupPicks] = useState({})
  const [bestThirds, setBestThirds] = useState([])

  const onGroupChange = (g, picks) => {
    setGroupPicks(prev => ({ ...prev, [g]: picks }))
    if (!picks[2]) setBestThirds(prev => prev.filter(group => group !== g))
  }

  const onToggleThird = (g) => {
    setBestThirds(prev => {
      if (prev.includes(g)) return prev.filter(x => x !== g)
      if (prev.length >= MAX_BEST_THIRDS) return prev
      return [...prev, g]
    })
  }

  const handleReset = () => {
    clearPredictions()
    setGroupPicks({})
    setBestThirds([])
  }

  const { correct, total } = score()

  const predictedFixtures = useMemo(
    () => resolvePredictedBracket(fixtures, groupPicks, bestThirds, predictions),
    [fixtures, groupPicks, bestThirds, predictions]
  )

  return (
    <div className="animate-fade-in">
      {total > 0 && (
        <div className="px-4 py-2 border-b border-navy-700 flex items-center gap-3">
          <span className="text-2xs text-content-muted">Your prediction score:</span>
          <span className="text-sm font-bold text-gold-500">{correct}/{total}</span>
        </div>
      )}

      <div className="relative px-4 py-2 border-b border-navy-700 flex justify-end items-center gap-2 flex-wrap">
        <PredictorHelp />
        <button
          onClick={() => setStep('bracket')}
          className="px-4 py-2 bg-gold-500 text-navy-950 text-xs font-bold capitalize tracking-widest !leading-none hover:bg-gold-400 transition-colors flex items-center gap-1"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex border-b border-navy-700 view-tabs">
        {[['picks', 'Group Picks'], ['bracket', 'KO Bracket']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setStep(id)}
            className={cn(
              'flex-1 py-2.5 text-base font-label font-bold uppercase tracking-widest transition-colors border-b-2',
              step === id ? 'text-gold-500 border-gold-500' : 'text-content-muted border-transparent hover:text-gold-400'
            )}
          >
            {label}
          </button>
        ))}
        <button
          onClick={handleReset}
          className="px-4 text-sm text-navy-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <RotateCcw size={16} /> <span className='hidden sm:inline leading-none'>Reset</span>
        </button>
      </div>

      {step === 'picks' && (
        <>
          <GroupRankPicker
            groupPicks={groupPicks}
            onChange={onGroupChange}
            bestThirds={bestThirds}
            onToggleThird={onToggleThird}
            maxBestThirds={MAX_BEST_THIRDS}
          />
          <div className="px-4 py-4 border-t border-navy-700 flex justify-end">
            <button
              onClick={() => setStep('bracket')}
              className="px-4 py-2 bg-gold-500 text-navy-950 text-sm font-bold capitalize tracking-widest hover:bg-gold-400 transition-colors flex items-center gap-1"
            >
              Continue to KO Bracket <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}

      {step === 'bracket' && (
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {BRACKET_STAGES.map(({ stage, label }) => {
              const matches = byStage(predictedFixtures, stage)
              return (
                <div key={stage} className="flex flex-col gap-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-gold-500 text-center mb-2">
                    {label}
                  </div>
                  {matches.length === 0 ? (
                    <p className="text-2xs text-content-muted italic w-32 text-center">Not yet scheduled</p>
                  ) : matches.map(f => (
                    <BracketSlot
                      key={f.matchNumber}
                      fixture={f}
                      predicted={getPrediction(f.matchNumber)}
                      onPick={setPrediction}
                      predictMode
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}