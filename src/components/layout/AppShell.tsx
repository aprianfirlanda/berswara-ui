import { NavLink, Outlet } from 'react-router-dom'
import { navigationItems } from '../../data/navigation'

export function AppShell() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Berswara home">
          <span className="brand-mark" aria-hidden="true">🐻</span>
          <span>Berswara</span>
        </NavLink>

        <nav aria-label="Primary navigation">
          <ul className="site-nav">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link'
                  }
                  to={item.to}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main-content" className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>Perlengkapan bayi untuk disewa, bukan dibeli.</p>
        <p>© {new Date().getFullYear()} Berswara</p>
      </footer>
    </div>
  )
}
