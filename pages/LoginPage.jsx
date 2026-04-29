import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isAuth } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  // Si ya está autenticado, redirigir directo al dashboard
  if (isAuth) return <Navigate to="/dashboard" replace />

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setError('Completa todos los campos.')
      return
    }
    setLoading(true)
    try {
      await login(form.username.trim(), form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bgBase flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-card p-10 w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 14, delay: 0.15 }}
            className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-6"
          >
            <span className="material-symbols-outlined text-accent text-3xl">lock</span>
          </motion.div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">ACCESO_RESTRINGIDO.exe</p>
          <h1 className="text-3xl font-black">Panel de Control</h1>
          <p className="text-textDim text-sm mt-2">Introduce tus credenciales de administrador</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Username */}
          <div>
            <label htmlFor="login-user" className="block text-xs uppercase tracking-widest text-textDim font-semibold mb-2">
              Usuario
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-textDim text-xl pointer-events-none">
                person
              </span>
              <input
                id="login-user"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                className="form-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-pass" className="block text-xs uppercase tracking-widest text-textDim font-semibold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-textDim text-xl pointer-events-none">
                key
              </span>
              <input
                id="login-pass"
                name="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input pl-10 pr-10 w-full"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textDim hover:text-accent transition-colors"
                tabIndex={-1}
                aria-label="Mostrar contraseña"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPass ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3"
              >
                <span className="material-symbols-outlined text-red-400 text-lg">error</span>
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            className="btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                />
                VERIFICANDO...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">login</span>
                ACCEDER AL SISTEMA
              </>
            )}
          </motion.button>
        </form>

        {/* Footer del formulario */}
        <p className="text-center text-textDim text-xs mt-8 font-mono">
          SISTEMA PROTEGIDO — ACCESO NO AUTORIZADO PROHIBIDO
        </p>
      </motion.div>
    </div>
  )
}
