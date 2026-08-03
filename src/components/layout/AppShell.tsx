import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { navigationItems } from '../../data/navigation'
import { BrandLogo } from '../media/BrandLogo'
import { ChatIcon, CloseIcon, MenuIcon } from '../icons/ShellIcons'

export function AppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setIsMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>

      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" to="/" aria-label="Beranda Berswara">
            <BrandLogo />
          </Link>

          <div className="mobile-header-actions">
            <Link
              className="mobile-availability-link"
              to="/contact"
              aria-label="Cek ketersediaan sewa"
            >
              <ChatIcon className="shell-icon" />
            </Link>
            <button
              ref={menuButtonRef}
              className="menu-toggle"
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="primary-navigation"
              aria-label={isMenuOpen ? 'Tutup menu utama' : 'Buka menu utama'}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              {isMenuOpen ? (
                <CloseIcon className="shell-icon" />
              ) : (
                <MenuIcon className="shell-icon" />
              )}
            </button>
          </div>

          <nav
            id="primary-navigation"
            className="site-navigation"
            aria-label="Navigasi utama"
            data-open={isMenuOpen}
          >
            <ul className="site-nav">
              {navigationItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'nav-link nav-link-active' : 'nav-link'
                    }
                    to={item.to}
                    end={item.to === '/'}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <Link
              className="availability-link desktop-availability-link"
              to="/contact"
              onClick={closeMenu}
            >
              <ChatIcon className="shell-icon shell-icon-small" />
              Cek ketersediaan
            </Link>
            <Link
              className="availability-link mobile-menu-availability"
              to="/contact"
              onClick={closeMenu}
            >
              <ChatIcon className="shell-icon shell-icon-small" />
              Cek ketersediaan
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-grid">
            <div className="footer-brand-column">
              <Link
                className="footer-brand"
                to="/"
                aria-label="Beranda Berswara"
              >
                <BrandLogo />
              </Link>
              <p>
                Sewa perlengkapan bayi hanya selama keluarga membutuhkannya.
              </p>
              <Link className="footer-availability-link" to="/contact">
                Cek ketersediaan →
              </Link>
            </div>

            <nav className="footer-column" aria-label="Navigasi footer">
              <h2>Jelajahi</h2>
              <ul className="footer-links">
                {navigationItems.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.to === '/'}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer-column">
              <h2>Informasi layanan</h2>
              <dl className="footer-details">
                <div>
                  <dt>Area layanan</dt>
                  <dd>Menunggu konfirmasi</dd>
                </div>
                <div>
                  <dt>Jam layanan</dt>
                  <dd>Menunggu konfirmasi</dd>
                </div>
                <div>
                  <dt>WhatsApp</dt>
                  <dd>Nomor resmi belum dipublikasikan</dd>
                </div>
              </dl>
            </div>

            <div className="footer-column">
              <h2>Media sosial</h2>
              <p className="footer-placeholder-copy">
                Tautan resmi akan ditampilkan setelah dikonfirmasi Berswara.
              </p>
              <Link className="footer-contact-link" to="/contact">
                Buka halaman kontak
              </Link>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Berswara</p>
            <p>Katalog penyewaan perlengkapan bayi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
