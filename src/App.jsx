import { AppProvider, useApp } from '@context/AppContext'
import Layout from '@components/layout/Layout'
import TimezoneSelector from '@components/settings/TimezoneSelector'
import SearchModal from '@components/search/SearchModal'
import SettingsDrawer from '@components/settings/SettingsDrawer'
import MatchModal from '@components/match/MatchModal'
import TeamModal from '@components/settings/TeamModal'

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

function AppShell() {
  const { timezoneConfirmed, searchOpen, settingsOpen, modalMatchId, modalTeamCode, teamByName, closeTeamModal } = useApp()

  const modalTeam = modalTeamCode
    ? Object.values(teamByName).find(t => t.code === modalTeamCode)
    : null

  return (
    <>
      {!timezoneConfirmed && <TimezoneSelector />}
      <Layout />
      {modalMatchId && <MatchModal />}
      {modalTeam && <TeamModal team={modalTeam} onClose={closeTeamModal} />}
    </>
  )
}