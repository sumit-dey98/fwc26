import { BarChart2, FlaskConical, Trophy } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@context/AppContext'
import BracketView from '@components/bracket/BracketView'
import MatchList from '@components/match/MatchList'
import { byStage } from '@utils/fixtures'
import { FINALS_STAGES } from '@utils/fixtures'
import { cn } from '@utils/cn'

const FINAL_STAGES = [
  { stage: 'quarter-finals', label: 'Quarter-Finals' },
  { stage: 'semi-finals',    label: 'Semi-Finals'    },
  { stage: 'third-place',    label: 'Third Place'    },
  { stage: 'final',          label: 'Final'          },
]

export default function FinalsView() {
  const { fixtures } = useApp()
  const [mode, setMode] = useState('live') // 'live' | 'predict'

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-0 border-b border-navy-700 px-4 py-3">
        <div className="flex">
          {[
            { id: 'live',    label: 'Live Bracket', icon: BarChart2 },
            { id: 'predict', label: 'My Prediction', icon: FlaskConical },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'px-3 py-2 text-xs font-bold uppercase tracking-widest border transition-colors flex items-center gap-1.5',
                mode === m.id
                  ? 'bg-yellow-500 text-navy-950 border-gold-500'
                  : 'bg-transparent text-content-muted border-navy-600 hover:border-gold-500 hover:text-gold-400'
              )}
            >
              {m.icon && <m.icon size={14} strokeWidth={2.5}/>} {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'live' ? (
        <div>
          {FINAL_STAGES.map(({ stage, label }) => {
            const matches = byStage(fixtures, stage)
            if (matches.length === 0) return null
            return (
              <div key={stage} className="border-b border-navy-700">
                <div className="px-4 py-2 text-sm font-label font-semibold uppercase tracking-widest text-navy-800 bg-gold-500 flex items-center gap-1.5">
                  {label}
                </div>
                <MatchList fixtures={matches} />
              </div>
            )
          })}
        </div>
      ) : (
        <BracketView />
      )}
    </div>
  )
}
