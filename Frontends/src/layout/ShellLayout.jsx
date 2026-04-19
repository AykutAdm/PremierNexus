import { NavLink, Outlet } from 'react-router-dom'

export function ShellLayout() {
  return (
    <div className="pn-app">
      <header className="pn-header">
        <NavLink to="/" className="pn-brand" end>
          <span className="pn-brand-mark-wrap" aria-hidden="true">
            <img
              className="pn-brand-mark"
              src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg"
              alt=""
              width={140}
              height={60}
              decoding="async"
            />
          </span>
          <span className="pn-brand-text">Premier Nexus</span>
        </NavLink>
        <nav className="pn-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'pn-nav-active' : '')}
            end
          >
            Ana sayfa
          </NavLink>
          <NavLink
            to="/takimlar"
            className={({ isActive }) => (isActive ? 'pn-nav-active' : '')}
          >
            Takımlar
          </NavLink>
          <NavLink
            to="/puan-durumu"
            className={({ isActive }) => (isActive ? 'pn-nav-active' : '')}
          >
            Puan durumu
          </NavLink>
          <NavLink
            to="/fikstur"
            className={({ isActive }) => (isActive ? 'pn-nav-active' : '')}
          >
            Fikstür
          </NavLink>
        </nav>
      </header>

      <main className="pn-main">
        <Outlet />
      </main>

      <footer className="pn-footer">
        Premier Nexus —Tüm Hakları Saklıdır.
      </footer>
    </div>
  )
}
