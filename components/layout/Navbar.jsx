import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuth, checking, logout } = useAuth()
  const isDashboard = location.pathname.startsWith('/dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/#sobre-mi', label: 'Sobre Mí' },
    { to: '/#habilidades', label: 'Habilidades' },
    { to: '/#proyectos', label: 'Proyectos' },
    { to: '/#contacto', label: 'Contacto' },
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
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-accent font-black text-lg tracking-wider">
        <span className="material-symbols-outlined text-xl">terminal</span>
        <span>RODOLFO.DEV</span>
      </Link>

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
            ← Portafolio
          </Link>
        )}
      </nav>

      {/* Right Actions */}
      <div className="hidden md:flex items-center gap-3">
        {!checking && (
          <>
            {!isDashboard && (
              <>
                {/* Mostrar Dashboard solo si está autenticado */}
                {isAuth && (
                  <Link
                    to="/dashboard"
                    className="nav-link border border-white/10 px-4 py-2 rounded-lg hover:border-accent hover:text-accent transition-all"
                  >
                    Dashboard
                  </Link>
                )}
                <a
                  href="/cv.pdf"
                  download
                  className="tag-badge cursor-pointer hover:bg-accent hover:text-bgBase transition-all px-4 py-2"
                >
                  DESCARGAR CV
                </a>
              </>
            )}
            {/* Logout si está autenticado */}
            {isAuth && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-textDim hover:text-red-400 transition-colors text-xs font-semibold uppercase tracking-wider"
                id="logout-btn"
                title="Cerrar sesión"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Salir
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
          {/* Dashboard solo si autenticado */}
          {isAuth && (
            <Link
              to="/dashboard"
              className="nav-link text-base"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard →
            </Link>
          )}
          {isAuth && (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false) }}
              className="text-red-400 text-sm font-semibold uppercase tracking-wider text-left"
            >
              Cerrar sesión
            </button>
          )}
        </motion.div>
      )}
    </motion.header>
  )
}
