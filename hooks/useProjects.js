import { useState, useEffect, useCallback } from 'react'
import API_BASE from '../config'

const API_URL = `${API_BASE}/projects`
const CACHE_KEY = 'portfolio_projects_cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos en ms

/* ─── Normaliza el _id de MongoDB a id ─── */
function normalize(project) {
  return { ...project, id: project._id }
}

/* ─── Lee el caché de localStorage ─── */
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null // expirado
    return data
  } catch {
    return null
  }
}

/* ─── Escribe en el caché ─── */
function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    /* storage lleno, ignorar */
  }
}

/* ─── Invalida el caché ─── */
function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch { /* noop */ }
}

/* ─── Wake-up ping: despierta al servidor Render sin bloquear ─── */
function pingServer() {
  fetch(`${API_BASE}/health`, { mode: 'cors', cache: 'no-store' }).catch(() => {})
}

/* ═══════════════════════════════════════════════════════════════
   useProjects — Stale-While-Revalidate
   · Si hay caché válido → muestra datos al instante (loading=false)
     y refresca en background de forma silenciosa.
   · Si NO hay caché → carga normal con loading=true.
   · Ping inmediato al servidor para que empiece a despertar.
═══════════════════════════════════════════════════════════════ */
export function useProjects() {
  const cached = readCache()

  const [projects, setProjects]   = useState(cached ?? [])
  const [loading, setLoading]     = useState(!cached) // true sólo sin caché
  const [error, setError]         = useState(null)

  /* ─── Cargar proyectos desde la API ─── */
  const fetchProjects = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      const normalized = data.map(normalize)
      setProjects(normalized)
      writeCache(normalized)
    } catch (err) {
      console.error('fetchProjects:', err.message)
      if (!silent) setError(err.message)
      // Si hay caché, seguimos mostrándolo aunque falle el refresco
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Ping inmediato para despertar Render (si está en cold-start)
    pingServer()

    if (cached) {
      // Hay datos en caché → se muestran al instante y se refresca en background
      fetchProjects({ silent: true })
    } else {
      // Sin caché → carga normal (muestra spinner)
      fetchProjects()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ─── Crear proyecto ─── */
  const addProject = useCallback(async (data) => {
    const tags = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === 'string'
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, tags }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al crear el proyecto')
    }

    const created = normalize(await res.json())
    setProjects((prev) => {
      const updated = [created, ...prev]
      writeCache(updated)
      return updated
    })
    return created
  }, [])

  /* ─── Actualizar proyecto ─── */
  const updateProject = useCallback(async (id, data) => {
    const tags = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === 'string'
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, tags }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al actualizar el proyecto')
    }

    const updated = normalize(await res.json())
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? updated : p))
      writeCache(next)
      return next
    })
    return updated
  }, [])

  /* ─── Eliminar proyecto ─── */
  const deleteProject = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al eliminar el proyecto')
    }

    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id)
      writeCache(next)
      return next
    })
  }, [])

  /* ─── Obtener uno por id ─── */
  const getProject = useCallback(
    (id) => projects.find((p) => p.id === id),
    [projects]
  )

  /* ─── Refetch manual: invalida caché y recarga ─── */
  const refetch = useCallback(() => {
    clearCache()
    return fetchProjects()
  }, [fetchProjects])

  return { projects, loading, error, addProject, updateProject, deleteProject, getProject, refetch }
}
