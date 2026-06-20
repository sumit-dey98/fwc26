import { useApp } from '@context/AppContext'
import MatchList from '@components/match/MatchList'
import { byStage } from '@utils/fixtures'

export default function KnockoutView({ stage, label }) {
  const { fixtures } = useApp()
  const matches = byStage(fixtures, stage)
  return (
    <div className="animate-fade-in">
      {/* <div className="px-4 py-3 border-b border-navy-700">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gold-500">{label}</h2>
      </div> */}
      <MatchList fixtures={matches} />
    </div>
  )
}
