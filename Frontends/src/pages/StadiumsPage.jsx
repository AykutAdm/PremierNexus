import { StadiumList } from '../components/StadiumList.jsx'

export function StadiumsPage() {
  return (
    <div className="pn-page">
      <header className="pn-page-header">
        <h1 className="pn-page-title">Stadyumlar</h1>
        <p className="pn-page-subtitle">Premier League stadyumları</p>
      </header>

      <main className="pn-page-main">
        <StadiumList />
      </main>
    </div>
  )
}