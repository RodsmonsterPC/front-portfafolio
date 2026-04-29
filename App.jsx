import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/proyecto/:id" element={<ProjectDetailPage />} />
          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-bgBase flex items-center justify-center">
                <div className="text-center">
                  <p className="font-mono text-accent text-6xl font-black mb-4">404</p>
                  <h1 className="text-3xl font-black mb-4">Ruta no encontrada</h1>
                  <a href="/" className="btn-primary">VOLVER AL INICIO</a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
