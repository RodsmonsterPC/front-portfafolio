import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../hooks/useLanguage'
import LanguageSwitch from './LanguageSwitch'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuth, checking, logout } = useAuth()
  const { t } = useLanguage()
  const isDashboard = location.pathname.startsWith('/dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/#sobre-mi',   label: t.nav.aboutMe  },
    { to: '/#habilidades', label: t.nav.skills   },
    { to: '/#proyectos',   label: t.nav.projects },
    { to: '/#contacto',    label: t.nav.contact  },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 glass-card mx-4 mt-4 mb-6 px-6 py-4 flex items-center justify-between"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* Logo + Language Switch */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-accent font-black text-lg tracking-wider">
          <span className="material-symbols-outlined text-xl">terminal</span>
          <span>RODOLFO.DEV</span>
        </Link>
        <div className="hidden md:block">
          <LanguageSwitch />
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        {!isDashboard &&
          navLinks.map((link) => (
            <a key={link.label} href={link.to} className="nav-link">
              {link.label}
            </a>
          ))}
        {isDashboard && (
          <Link to="/" className="nav-link">
            {t.nav.backToPortfolio}
          </Link>
        )}
      </nav>

      {/* Right Actions */}
      <div className="hidden md:flex items-center gap-3">
        {!checking && (
          <>
            {!isDashboard && (
              <>
                {isAuth && (
                  <Link
                    to="/dashboard"
                    className="nav-link border border-white/10 px-4 py-2 rounded-lg hover:border-accent hover:text-accent transition-all"
                  >
                    {t.nav.dashboard}
                  </Link>
                )}
                <a
                  href="/cv.pdf"
                  download
                  className="tag-badge cursor-pointer hover:bg-accent hover:text-bgBase transition-all px-4 py-2"
                >
                  {t.nav.downloadCV}
                </a>
              </>
            )}

            {/* Logout */}
            {isAuth && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-textDim hover:text-red-400 transition-colors text-xs font-semibold uppercase tracking-wider"
                id="logout-btn"
                title={t.nav.closeSession}
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                {t.nav.logout}
              </button>
            )}
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-textDim hover:text-accent transition-colors"
        aria-label="Abrir menú"
        id="mobile-menu-btn"
      >
        <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 glass-card p-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="nav-link text-base"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {isAuth && (
            <Link
              to="/dashboard"
              className="nav-link text-base"
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.dashboard} →
            </Link>
          )}

          {/* Language switch en mobile */}
          <div className="pt-2 border-t border-white/10">
            <LanguageSwitch />
          </div>

          {isAuth && (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false) }}
              className="text-red-400 text-sm font-semibold uppercase tracking-wider text-left"
            >
              {t.nav.closeSession}
            </button>
          )}
        </motion.div>
      )}
    </motion.header>
  )
}
