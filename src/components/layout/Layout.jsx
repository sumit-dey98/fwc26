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
    case 'finals': return <FinalsView />
    case 'stats': return <StatsView />
    case 'stadiums': return <StadiumsView />
    case 'teams': return <TeamsView />
    default: return <GroupStageView />
  }
}

export default function Layout() {
  const { isLoading } = useApp()

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-navy-900">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {isLoading ? <Loader label="Loading schedule..." /> : <ActiveView />}
        </main>
        <Sidebar />
      </div>
      <MobileMatchDrawer />
    </div>
  )
}