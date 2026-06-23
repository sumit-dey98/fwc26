import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import NavBar from './NavBar'
import Sidebar from './Sidebar'
import MobileMatchDrawer from '@components/sidebar/MobileMatchDrawer'
import GroupStageView from '@views/GroupStageView'
import KnockoutView from '@views/KnockoutView'
import FinalsView from '@views/FinalsView'
import StatsView from '@views/StatsView'
import StadiumsView from '@views/StadiumsView'
import TeamsView from '@views/TeamsView'
import Loader from '@components/ui/Loader'
import { useApp } from '@context/AppContext'

function ActiveView() {
  const { activeTab } = useApp()
  switch (activeTab) {
    case 'group': return <GroupStageView />
    case 'r32': return <KnockoutView stage="round-of-32" label="Round of 32" />
    case 'r16': return <KnockoutView stage="round-of-16" label="Round of 16" />
    case 'finals': return <FinalsView defaultMode="live" />
    case 'predictor': return <FinalsView defaultMode="predict" />
    case 'stadiums': return <StadiumsView />
    case 'teams': return <TeamsView />
    default: return <GroupStageView />
  }
}

export default function Layout() {
  const { isLoading } = useApp()
  const mainRef = useRef(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const node = mainRef.current
    if (!node) return
    const onScroll = () => setShowBackToTop(node.scrollTop > 400)
    node.addEventListener('scroll', onScroll)
    return () => node.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-navy-900">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <main ref={mainRef} className="relative flex-1 overflow-y-auto">
          {isLoading ? <Loader label="Loading schedule..." /> : <ActiveView />}

          <div className="sticky bottom-4 z-20 h-0">
            {showBackToTop && (
              <button
                onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Back to top"
                className="absolute bottom-2 right-6 border border-navy-600 hover:border-navy-900 bg-navy-900/30 hover:bg-gold-500 hover:text-navy-900 backdrop-blur-sm p-2.5 text-white transition-colors"
              >
                <ArrowUp size={18} />
              </button>
            )}
          </div>
        </main>
        <Sidebar />
      </div>
      <MobileMatchDrawer />
    </div>
  )
}