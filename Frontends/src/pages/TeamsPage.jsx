import { TeamList } from '../components/TeamList.jsx'

export function TeamsPage() {
  return (
    <>
      <div className="pn-page-head">
        <h1>Takımlar</h1>
        <p>
          Premier League kulüpleri — logo, şehir ve stadyum bilgileri{' '}
          <code>GET /api/Teams</code> üzerinden.
        </p>
      </div>
      <TeamList />
    </>
  )
}
