import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const TOKEN_KEY = 'portfolio_auth_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)      // null = no autenticado
  const [checking, setChecking] = useState(true) // verificando token al inicio

  /* ── Verificar token guardado al montar ── */
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setChecking(false)
      return
    }
    fetch(`${API}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setUser({ username: data.username, token })
        } else {
          localStorage.removeItem(TOKEN_KEY)
        }
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setChecking(false))
  }, [])

  /* ── Login ── */
  const login = useCallback(async (username, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión')

    localStorage.setItem(TOKEN_KEY, data.token)
    setUser({ username: data.username, token: data.token })
  }, [])

  /* ── Logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, checking, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
