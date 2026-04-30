import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { to: '/dashboard', label: 'Proyectos', icon: 'grid_view', end: true },
  { to: '/dashboard/nuevo', label: 'Nuevo Proyecto', icon: 'add_circle' },
  { to: '/dashboard/skills', label: 'Stack / Skills', icon: 'psychology' },
]

export default function Sidebar({ onClose }) {
  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-64 min-h-screen glass-card flex flex-col py-8 px-4 shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 mb-10">
        <span className="material-symbols-outlined text-accent text-2xl">terminal</span>
        <span className="text-accent font-black text-base tracking-wider">ADMIN PANEL</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2">
        <p className="text-textDim text-xs uppercase tracking-widest px-4 mb-2 font-semibold">Gestión</p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            id={`sidebar-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="material-symbols-outlined text-xl">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {/* Divider */}
        <div className="border-t border-white/10 mx-4" />

        {/* Volver al sitio */}
        <NavLink
          to="/"
          onClick={onClose}
          id="sidebar-back-to-site"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-textDim hover:text-accent hover:bg-accent/10 transition-all duration-200 group"
        >
          <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform duration-200">
            arrow_back
          </span>
          <span className="text-sm font-semibold tracking-wide">Volver al Sitio</span>
        </NavLink>

        {/* Status card */}
        <div className="glass-card p-4 rounded-xl">
          <p className="text-xs text-textDim font-mono mb-1">SISTEMA ACTIVO</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-mono">Portfolio v1.0</span>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
