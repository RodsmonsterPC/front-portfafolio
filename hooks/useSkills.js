import { useState, useEffect, useCallback } from 'react'
import API_BASE from '../config'

const API_URL = `${API_BASE}/skills`
const CACHE_KEY = 'portfolio_skills_cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

/* ─── Normaliza _id → id ─── */
function normalize(skill) {
  return { ...skill, id: skill._id }
}

/* ─── Caché helpers ─── */
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch { /* storage lleno */ }
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch { /* noop */ }
}

/* ═══════════════════════════════════════════════════════
   useSkills — Stale-While-Revalidate
   Muestra caché al instante y refresca en background.
═══════════════════════════════════════════════════════ */
export function useSkills() {
  const cached = readCache()

  const [skills, setSkills]   = useState(cached ?? [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError]     = useState(null)

  const fetchSkills = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      const normalized = data.map(normalize)
      setSkills(normalized)
      writeCache(normalized)
    } catch (err) {
      console.error('fetchSkills:', err.message)
      if (!silent) setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (cached) {
      fetchSkills({ silent: true })
    } else {
      fetchSkills()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ─── Agregar skill ─── */
  const addSkill = useCallback(async (data) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al crear la skill')
    }
    const created = normalize(await res.json())
    setSkills((prev) => {
      const updated = [...prev, created].sort((a, b) => a.order - b.order)
      writeCache(updated)
      return updated
    })
    return created
  }, [])

  /* ─── Actualizar skill ─── */
  const updateSkill = useCallback(async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al actualizar la skill')
    }
    const updated = normalize(await res.json())
    setSkills((prev) => {
      const next = prev.map((s) => (s.id === id ? updated : s)).sort((a, b) => a.order - b.order)
      writeCache(next)
      return next
    })
    return updated
  }, [])

  /* ─── Eliminar skill ─── */
  const deleteSkill = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al eliminar la skill')
    }
    setSkills((prev) => {
      const next = prev.filter((s) => s.id !== id)
      writeCache(next)
      return next
    })
  }, [])

  /* ─── Refetch manual ─── */
  const refetch = useCallback(() => {
    clearCache()
    return fetchSkills()
  }, [fetchSkills])

  return { skills, loading, error, addSkill, updateSkill, deleteSkill, refetch }
}
