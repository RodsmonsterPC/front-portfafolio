import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Sidebar from '../components/layout/Sidebar'
import ProjectCard from '../components/dashboard/ProjectCard'
import ProjectForm from '../components/dashboard/ProjectForm'
import DeleteModal from '../components/dashboard/DeleteModal'
import { useProjects } from '../hooks/useProjects'

/* ─── Toast helpers ─── */
const toastStyle = {
  style: { background: '#141417', color: '#e2e2e6', border: '1px solid rgba(0,240,255,0.3)' },
  iconTheme: { primary: '#00f0ff', secondary: '#0a0a0c' },
}

const toastError = {
  style: { background: '#141417', color: '#e2e2e6', border: '1px solid rgba(255,80,80,0.4)' },
  iconTheme: { primary: '#ff5050', secondary: '#0a0a0c' },
}

/* ─── Loading spinner ─── */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full"
      />
      <p className="font-mono text-accent text-xs uppercase tracking-widest animate-pulse">
        Conectando a MongoDB...
      </p>
    </div>
  )
}

/* ─── Error state ─── */
function ErrorState({ message, onRetry }) {
  return (
    <div className="glass-card p-16 text-center flex flex-col items-center gap-4">
      <span className="material-symbols-outlined text-red-400 text-6xl">cloud_off</span>
      <p className="text-2xl font-black text-red-400">Error de conexión</p>
      <p className="text-textDim max-w-sm">{message}</p>
      <button onClick={onRetry} className="btn-primary mt-4" id="retry-btn">
        REINTENTAR
      </button>
    </div>
  )
}

/* ────────────── PROJECT LIST ────────────── */
function ProjectList({ projects, loading, error, onEdit, onDelete, onRetry }) {
  const navigate = useNavigate()

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">PANEL_CONTROL.v1</p>
          <h1 className="text-4xl font-black">Mis Proyectos</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard/nuevo')}
          className="btn-primary flex items-center gap-2"
          id="new-project-btn"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          NUEVO PROYECTO
        </motion.button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: projects.length, icon: 'folder' },
          { label: 'Con Demo', value: projects.filter((p) => p.demoLink).length, icon: 'open_in_new' },
          { label: 'Con Repo', value: projects.filter((p) => p.repoLink).length, icon: 'code' },
          {
            label: 'Este Mes',
            value: projects.filter((p) => {
              const d = new Date(p.createdAt)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length,
            icon: 'calendar_today',
          },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5 flex items-center gap-4">
            <span className="material-symbols-outlined text-accent text-3xl">{s.icon}</span>
            <div>
              <p className="text-3xl font-black text-accent">{s.value}</p>
              <p className="text-xs text-textDim uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : projects.length === 0 ? (
        <div className="glass-card p-16 text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-textDim text-6xl">folder_open</span>
          <p className="text-2xl font-black text-textDim">Sin proyectos</p>
          <p className="text-textDim">Crea tu primer proyecto para empezar.</p>
          <button
            onClick={() => navigate('/dashboard/nuevo')}
            className="btn-primary mt-4"
            id="empty-new-project-btn"
          >
            CREAR PROYECTO
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}

/* ────────────── NEW PROJECT ────────────── */
function NewProject({ onAdd }) {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const handleSave = async (data) => {
    setSaving(true)
    try {
      await onAdd(data)
      toast.success('¡Proyecto creado exitosamente!', toastStyle)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Error al crear el proyecto', toastError)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">NUEVO_PROYECTO.exe</p>
        <h1 className="text-4xl font-black">Crear Proyecto</h1>
      </div>
      <div className="glass-card p-8 max-w-2xl">
        <ProjectForm onSave={handleSave} onCancel={() => navigate('/dashboard')} saving={saving} />
      </div>
    </div>
  )
}

/* ────────────── DASHBOARD ROOT ────────────── */
export default function DashboardPage() {
  const { projects, loading, error, addProject, updateProject, deleteProject, refetch } = useProjects()
  const [editProject, setEditProject] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleEdit = (project) => setEditProject(project)

  const handleSaveEdit = async (data) => {
    setSaving(true)
    try {
      await updateProject(editProject.id, data)
      toast.success('¡Proyecto actualizado!', toastStyle)
      setEditProject(null)
    } catch (err) {
      toast.error(err.message || 'Error al actualizar', toastError)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (project) => setDeleteTarget(project)

  const handleConfirmDelete = async () => {
    try {
      await deleteProject(deleteTarget.id)
      toast.success('Proyecto eliminado.', toastStyle)
    } catch (err) {
      toast.error(err.message || 'Error al eliminar', toastError)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="min-h-screen bg-bgBase flex">
      <Toaster position="top-right" />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-bgBase/80 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="glass-card m-4 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-textDim hover:text-accent transition-colors"
            id="open-sidebar-btn"
            aria-label="Abrir sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="font-mono text-accent text-xs uppercase tracking-widest hidden md:block">
            PANEL DE CONTROL — ACTIVO
          </div>
          <div className="flex items-center gap-3">
            {/* Indicador de DB */}
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  error ? 'bg-red-400' : loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                }`}
              />
              <span className="font-mono text-xs text-textDim hidden sm:block">
                {error ? 'DB Error' : loading ? 'Conectando...' : 'MongoDB'}
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs text-accent">{projects.length} proyectos</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8">
          <Routes>
            <Route
              path="/"
              element={
                <ProjectList
                  projects={projects}
                  loading={loading}
                  error={error}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRetry={refetch}
                />
              }
            />
            <Route path="/nuevo" element={<NewProject onAdd={addProject} />} />
          </Routes>
        </main>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(10,10,12,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={() => setEditProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="glass-card p-8 w-full max-w-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">Editar Proyecto</h2>
                <button
                  onClick={() => setEditProject(null)}
                  className="text-textDim hover:text-accent"
                  id="close-edit-modal"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <ProjectForm
                initial={editProject}
                onSave={handleSaveEdit}
                onCancel={() => setEditProject(null)}
                saving={saving}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <DeleteModal
        project={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
