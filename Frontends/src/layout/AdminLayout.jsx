import { NavLink, Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-icon">⚡</div>
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className="admin-nav-item">
            <span className="admin-nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/teams" className="admin-nav-item">
            <span className="admin-nav-icon">🏟️</span>
            <span>Takım Yönetimi</span>
          </NavLink>

          <NavLink to="/admin/stadiums" className="admin-nav-item">
            <span className="admin-nav-icon">🥅</span>
            <span>Stadyum Yönetimi</span>
          </NavLink>

          <NavLink to="/admin/leagues" className="admin-nav-item">
            <span className="admin-nav-icon">🏆</span>
            <span>Lig Yönetimi</span>
          </NavLink>

          <NavLink to="/admin/matches" className="admin-nav-item">
            <span className="admin-nav-icon">⚽</span>
            <span>Maç Yönetimi</span>
          </NavLink>

          <div className="admin-nav-divider"></div>

          <NavLink to="/" className="admin-nav-item admin-nav-item--back">
            <span className="admin-nav-icon">🏠</span>
            <span>Ana Sayfaya Dön</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}