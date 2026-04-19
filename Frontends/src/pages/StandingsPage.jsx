import { StandingTable } from '../components/StandingTable.jsx'

export function StandingsPage() {
  return (
    <>
      <div className="pn-page-head">
        <h1>Puan durumu</h1>
        <p>
          Lig tablosu <code>GET /api/Standings/StandingListWithTeamName</code>{' '}
          ile — takım adı ve logo dahil.
        </p>
      </div>
      <StandingTable />
    </>
  )
}
