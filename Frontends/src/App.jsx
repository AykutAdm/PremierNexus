import { Navigate, Route, Routes } from 'react-router-dom'
import { ShellLayout } from './layout/ShellLayout.jsx'
import { AdminLayout } from './layout/AdminLayout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { AdminDashboard } from './pages/AdminDashboard.jsx'
import { AdminTeams } from './pages/AdminTeams.jsx'
import { AdminAddTeam } from './pages/AdminAddTeam.jsx'
import { AdminEditTeam } from './pages/AdminEditTeam.jsx'
import { AdminStadiums } from './pages/AdminStadiums.jsx'
import { AdminAddStadium } from './pages/AdminAddStadium.jsx'
import { AdminEditStadium } from './pages/AdminEditStadium.jsx'
import { AdminLeagues } from './pages/AdminLeagues.jsx'
import { AdminAddLeague } from './pages/AdminAddLeague.jsx'
import { AdminEditLeague } from './pages/AdminEditLeague.jsx'
import { AdminMatches } from './pages/AdminMatches.jsx'
import { AdminAddMatch } from './pages/AdminAddMatch.jsx'
import { AdminEditMatch } from './pages/AdminEditMatch.jsx'
import { AdminAddMatchEvent } from './pages/AdminAddMatchEvent.jsx'
import { AdminAddMatchStatistics } from './pages/AdminAddMatchStatistics.jsx'
import './App.css'
import './styles/matchEvents.css'
import './styles/homepage.css'
import './styles/admin.css'
import './styles/adminTeams.css'
import { MatchList } from './components/MatchList.jsx'
import { TeamList } from './components/TeamList.jsx'
import { StandingTable } from './components/StandingTable.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<ShellLayout />}>
        <Route index element={<HomePage />} />
        <Route path="takimlar" element={<TeamList />} />
        <Route path="puan-durumu" element={<StandingTable />} />
        <Route path="fikstur" element={<MatchList />} />
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="teams" element={<AdminTeams />} />
        <Route path="add-team" element={<AdminAddTeam />} />
        <Route path="edit-team/:teamId" element={<AdminEditTeam />} />
        <Route path="stadiums" element={<AdminStadiums />} />
        <Route path="add-stadium" element={<AdminAddStadium />} />
        <Route path="edit-stadium/:stadiumId" element={<AdminEditStadium />} />
        <Route path="leagues" element={<AdminLeagues />} />
        <Route path="add-league" element={<AdminAddLeague />} />
        <Route path="edit-league/:leagueId" element={<AdminEditLeague />} />
        <Route path="matches" element={<AdminMatches />} />
        <Route path="add-match" element={<AdminAddMatch />} />
        <Route path="edit-match/:matchId" element={<AdminEditMatch />} />
        <Route path="add-match-event/:matchId" element={<AdminAddMatchEvent />} />
        <Route path="add-match-statistics/:matchId" element={<AdminAddMatchStatistics />} />
        <Route path="update-score" element={<div className="admin-page-placeholder">Skor Güncelle - Yakında</div>} />
        <Route path="add-event" element={<div className="admin-page-placeholder">Olay Ekle - Yakında</div>} />
        <Route path="add-statistics" element={<div className="admin-page-placeholder">İstatistik Ekle - Yakında</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
