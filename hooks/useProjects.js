import { useState, useEffect, useCallback } from 'react'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/projects`

/* ─── Normaliza el _id de MongoDB a id ─── */
function normalize(project) {
  return { ...project, id: project._id }
}

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ─── Cargar todos los proyectos al montar ─── */
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      setProjects(data.map(normalize))
    } catch (err) {
      console.error('fetchProjects:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

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
    setProjects((prev) => [created, ...prev])
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
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }, [])

  /* ─── Eliminar proyecto ─── */
  const deleteProject = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al eliminar el proyecto')
    }

    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  /* ─── Obtener uno por id ─── */
  const getProject = useCallback(
    (id) => projects.find((p) => p.id === id),
    [projects]
  )

  return { projects, loading, error, addProject, updateProject, deleteProject, getProject, refetch: fetchProjects }
}
