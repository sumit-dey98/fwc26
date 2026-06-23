import { useState, useMemo, useRef, useEffect } from 'react'
import { useApp } from '@context/AppContext'
import { usePredictions } from '@hooks/usePredictions'
import { resolvePredictedBracket } from '@utils/bracketResolver'
import BracketSlot from './BracketSlot'
import GroupRankPicker from './GroupRankPicker'
import { byStage } from '@utils/fixtures'
import { RotateCcw, ArrowRight, Download, ChevronDown } from 'lucide-react'
import PredictorHelp from './PredictorHelp'
import BracketCanvasFrame from './BracketCanvasFrame'
import BracketPreviewModal from './BracketPreviewModal'
import { exportBracketPNG } from '@utils/exportBracket'
import { cn } from '@utils/cn'

const BRACKET_STAGES = [
  { stage: 'round-of-32', label: 'R32' },
  { stage: 'round-of-16', label: 'R16' },
  { stage: 'quarter-finals', label: 'QF' },
  { stage: 'semi-finals', label: 'SF' },
  { stage: 'third-place', label: '3rd Place' },
  { stage: 'final', label: 'Final' },
]

const MAX_BEST_THIRDS = 8

const DEFAULT_BG = { color: '#08121f', image: '/brackets-bg_2.jpg', opacity: 0.4 }

export default function BracketView() {
  const { fixtures, teamByName } = useApp()
  const [exportOpen, setExportOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [bg, setBg] = useState(DEFAULT_BG)
  const { predictions, getPrediction, setPrediction, score, clearPredictions } = usePredictions()
  const [step, setStep] = useState('picks')
  const loadPersisted = (key, fallback) => {
    try {
      const v = localStorage.getItem(`wc26:${key}`)
      return v != null ? JSON.parse(v) : fallback
    } catch { return fallback }
  }
  const savePersisted = (key, val) => {
    try { localStorage.setItem(`wc26:${key}`, JSON.stringify(val)) } catch { }
  }

  const [groupPicks, setGroupPicks] = useState(() => loadPersisted('groupPicks', {}))
  const [bestThirds, setBestThirds] = useState(() => loadPersisted('bestThirds', []))

  useEffect(() => { savePersisted('groupPicks', groupPicks) }, [groupPicks])
  useEffect(() => { savePersisted('bestThirds', bestThirds) }, [bestThirds])

  const hdFrameRef = useRef(null)
  const qhdFrameRef = useRef(null)
  const uhdFrameRef = useRef(null)

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
    try {
      localStorage.removeItem('wc26:groupPicks')
      localStorage.removeItem('wc26:bestThirds')
    } catch { }
  }

  const { correct, total } = score()

  const predictedFixtures = useMemo(
    () => resolvePredictedBracket(fixtures, groupPicks, bestThirds, predictions),
    [fixtures, groupPicks, bestThirds, predictions]
  )

  const exportOptions = [
    { label: 'Preview', action: () => setPreviewOpen(true) },
    { label: '1080p', action: () => exportBracketPNG(hdFrameRef.current, 1920, 'wc26-bracket-1080p.png') },
    { label: '2K', action: () => exportBracketPNG(qhdFrameRef.current, 2560, 'wc26-bracket-2k.png') },
    { label: '4K', action: () => exportBracketPNG(uhdFrameRef.current, 3840, 'wc26-bracket-4k.png') },
  ]

  return (
    <div className="animate-fade-in">
      <div style={{ position: 'fixed', top: 0, left: '-99999px' }} aria-hidden="true">
        <BracketCanvasFrame
          ref={hdFrameRef}
          width={1920}
          rawFixtures={fixtures}
          predictedFixtures={predictedFixtures}
          teamByName={teamByName}
          bgColor={DEFAULT_BG.color}
        />
        <BracketCanvasFrame
          ref={qhdFrameRef}
          width={2560}
          rawFixtures={fixtures}
          predictedFixtures={predictedFixtures}
          teamByName={teamByName}
          bgColor={DEFAULT_BG.color}
        />
        <BracketCanvasFrame
          ref={uhdFrameRef}
          width={3840}
          rawFixtures={fixtures}
          predictedFixtures={predictedFixtures}
          teamByName={teamByName}
          bgColor={DEFAULT_BG.color}
        />
      </div>

      <BracketPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        rawFixtures={fixtures}
        predictedFixtures={predictedFixtures}
        teamByName={teamByName}
        bg={bg}
        onBgChange={setBg}
      />

      {total > 0 && (
        <div className="px-4 py-2 border-b border-navy-700 flex items-center gap-3">
          <span className="text-2xs text-content-muted">Your prediction score:</span>
          <span className="text-sm font-bold text-gold-500">{correct}/{total}</span>
        </div>
      )}

      <div className="relative px-4 py-2 border-b border-navy-700 flex justify-end items-center gap-2 flex-wrap">
        <PredictorHelp />
        <div className="relative">
          <button
            onClick={() => setExportOpen(v => !v)}
            className="relative px-4 pr-11 py-2 border border-gold-500 bg-gold-500 hover:bg-gold-400 text-navy-800 text-xs font-bold capitalize tracking-widest !leading-none transition-colors flex items-center gap-1.5"
          >
            <Download size={14} /> Export <div className='absolute right-0 h-full px-1.5 flex items-center border-l border-navy-800'> <ChevronDown size={18} strokeWidth={2} className={exportOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /> </div>
          </button>
          {exportOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-navy-800 border border-navy-600 z-20">
              {exportOptions.map(({ label, action }) => (
                <button
                  key={label}
                  onClick={() => {
                    action()
                    setExportOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-content-secondary hover:bg-navy-700 hover:text-gold-400 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* <button
          onClick={() => setStep('bracket')}
          className="px-4 py-2 bg-gold-500 text-navy-950 text-xs font-bold capitalize tracking-widest !leading-none hover:bg-gold-400 transition-colors flex items-center gap-1"
        >
          Continue <ArrowRight size={16} />
        </button> */}
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