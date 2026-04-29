import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

export default function ProtectedRoute({ children }) {
  const { isAuth, checking } = useAuth()

  // Mientras verifica el token guardado, mostrar spinner
  if (checking) {
    return (
      <div className="min-h-screen bg-bgBase flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full"
        />
      </div>
    )
  }

  if (!isAuth) return <Navigate to="/login" replace />

  return children
}
