import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'

export default function PredictorHelp() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-content-muted hover:text-gold-400 transition-colors px-3 py-2 border border-navy-600 hover:border-gold-500 focus:border-gold-500 focus:bg-gold-500 focus:text-navy-800"
      >
        <HelpCircle size={12} />
        How this works
      </button>

      {open && (
        <div className="absolute mx-4 sm:mx-0 right-0 w-[calc(100%-2rem)] sm:w-96 top-full -mt-1 sm:mt-1 z-30 bg-navy-800 border border-gold-500/40 animate-slide-down">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-navy-700 flex-shrink-0 bg-gold-500">
            <span className="text-xs font-bold uppercase tracking-widest text-navy-900">Format & Predictor</span>
            <button onClick={() => setOpen(false)} className="text-navy-900 hover:text-navy-600 transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="px-4 py-3 border-b border-navy-700">
            <p className="text-2xs font-bold uppercase tracking-widest text-gold-400 mb-1.5">How the real bracket works</p>
            <ul className="text-xs text-content-secondary space-y-1.5 list-disc pl-4">
              <li>12 groups of 4 teams play a round-robin group stage.</li>
              <li>The top 2 from each group automatically advance - 24 teams.</li>
              <li>The 8 best 3rd-place teams (compared across all 12 groups by points, then goal difference, then goals scored) fill the remaining spots.</li>
              <li>32 teams total enter Round of 32.</li>
            </ul>
          </div>

          <div className="px-4 py-3">
            <p className="text-2xs font-bold uppercase tracking-widest text-gold-400 mb-1.5">How the predictor works</p>
            <ul className="text-xs text-content-secondary space-y-1.5 list-disc pl-4">
              <li><strong className="text-content-primary">Group Picks:</strong> click teams in each group to rank your predicted 1st, 2nd, and 3rd.</li>
              <li><strong className="text-content-primary">Auto-Pick:</strong> instantly fill all 12 groups using the current real standings - great as a starting point, then adjust manually.</li>
              <li><strong className="text-content-primary">Best Thirds:</strong> from your 12 predicted 3rd-place teams, pick exactly 8 strong enough to also qualify.</li>
              <li><strong className="text-content-primary">Knockout Bracket:</strong> builds a predicted bracket from your picks, resolving each round as you predict match winners. This isn't the real bracket - check "Live Bracket" in The Finals tab for actual results.</li>
              <li><strong className="text-content-primary">Saved automatically</strong> - your picks persist between visits. Reset clears everything.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}