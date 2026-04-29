import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import API_BASE from '../config'

const AuthContext = createContext(null)

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
    fetch(`${API_BASE}/auth/verify`, {
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
    const res = await fetch(`${API_BASE}/auth/login`, {
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
