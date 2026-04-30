import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Sidebar from '../components/layout/Sidebar'
import ProjectCard from '../components/dashboard/ProjectCard'
import ProjectForm from '../components/dashboard/ProjectForm'
import DeleteModal from '../components/dashboard/DeleteModal'
import SkillCard from '../components/dashboard/SkillCard'
import SkillForm from '../components/dashboard/SkillForm'
import { useProjects } from '../hooks/useProjects'
import { useSkills } from '../hooks/useSkills'

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
function usePageSize() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile ? 5 : 10
}

function ProjectList({ projects, loading, error, onEdit, onDelete, onRetry }) {
  const navigate  = useNavigate()
  const pageSize  = usePageSize()
  const [page, setPage] = useState(0)

  // Reset a página 0 si cambia el tamaño de página
  useEffect(() => { setPage(0) }, [pageSize])

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize))
  const paginated  = projects.slice(page * pageSize, page * pageSize + pageSize)

  const prev = () => setPage((p) => Math.max(0, p - 1))
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1))

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
          <button onClick={() => navigate('/dashboard/nuevo')} className="btn-primary mt-4" id="empty-new-project-btn">
            CREAR PROYECTO
          </button>
        </div>
      ) : (
        <>
          {/* ── Paginación superior — solo mobile ── */}
          <div className="md:hidden mb-4 flex items-center justify-between glass-card px-5 py-3">
            <span className="font-mono text-xs text-textDim">
              {projects.length > 0
                ? `${page * pageSize + 1}–${Math.min(page * pageSize + pageSize, projects.length)} de ${projects.length}`
                : '0 proyectos'}
            </span>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={prev} disabled={page === 0}
                id="dashboard-projects-prev-top"
                aria-label="Página anterior"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-textDim hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </motion.button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i} onClick={() => setPage(i)}
                    id={`dashboard-page-dot-top-${i}`}
                    aria-label={`Página ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${i === page ? 'w-5 h-2 bg-accent' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={next} disabled={page === totalPages - 1}
                id="dashboard-projects-next-top"
                aria-label="Página siguiente"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-textDim hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {paginated.map((p) => (
                <ProjectCard key={p.id} project={p} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Paginación inferior — siempre visible ── */}
          <div className="flex items-center justify-between mt-8 glass-card px-5 py-3">
            <span className="font-mono text-xs text-textDim">
              {projects.length > 0
                ? `${page * pageSize + 1}–${Math.min(page * pageSize + pageSize, projects.length)} de ${projects.length}`
                : '0 proyectos'}
              <span className="hidden sm:inline ml-1">· mostrando {pageSize}/pág</span>
            </span>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={prev} disabled={page === 0}
                id="dashboard-projects-prev"
                aria-label="Página anterior"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-textDim hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </motion.button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i} onClick={() => setPage(i)}
                    id={`dashboard-page-dot-${i}`}
                    aria-label={`Página ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${i === page ? 'w-5 h-2 bg-accent' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={next} disabled={page === totalPages - 1}
                id="dashboard-projects-next"
                aria-label="Página siguiente"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-textDim hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </motion.button>
            </div>
          </div>
        </>

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

/* ────────────── SKILLS MANAGER ────────────── */
function SkillsManager() {
  const { skills, loading, error, addSkill, updateSkill, deleteSkill, refetch } = useSkills()
  const [editTarget, setEditTarget]     = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showForm, setShowForm]         = useState(false)
  const [saving, setSaving]             = useState(false)

  const handleAdd = async (data) => {
    setSaving(true)
    try {
      await addSkill(data)
      toast.success('¡Tecnología agregada!', toastStyle)
      setShowForm(false)
    } catch (err) {
      toast.error(err.message || 'Error al agregar', toastError)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (data) => {
    setSaving(true)
    try {
      await updateSkill(editTarget.id, data)
      toast.success('¡Tecnología actualizada!', toastStyle)
      setEditTarget(null)
    } catch (err) {
      toast.error(err.message || 'Error al actualizar', toastError)
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteSkill(deleteTarget.id)
      toast.success('Tecnología eliminada.', toastStyle)
    } catch (err) {
      toast.error(err.message || 'Error al eliminar', toastError)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">STACK_TECNOLOGICO.v1</p>
          <h1 className="text-4xl font-black">Stack / Skills</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setShowForm(true); setEditTarget(null) }}
          className="btn-primary flex items-center gap-2"
          id="new-skill-btn"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          NUEVA TECNOLOGÍA
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Skills', value: skills.length, icon: 'psychology' },
          { label: 'Dominio Prom.', value: skills.length ? Math.round(skills.reduce((s, k) => s + k.percent, 0) / skills.length) + '%' : '—', icon: 'trending_up' },
          { label: 'Nivel Top', value: skills.length ? Math.max(...skills.map((s) => s.percent)) + '%' : '—', icon: 'star' },
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
      {loading && skills.length === 0 ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : skills.length === 0 ? (
        <div className="glass-card p-16 text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-textDim text-6xl">psychology</span>
          <p className="text-2xl font-black text-textDim">Sin tecnologías</p>
          <p className="text-textDim">Agrega tu primera tecnología al stack.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4" id="empty-new-skill-btn">
            AGREGAR TECNOLOGÍA
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {skills.map((skill, i) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={i}
                onEdit={(s) => { setEditTarget(s); setShowForm(false) }}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* ── Modal: Crear skill ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(10,10,12,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="glass-card p-8 w-full max-w-lg my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">Nueva Tecnología</h2>
                <button onClick={() => setShowForm(false)} className="text-textDim hover:text-accent" id="close-skill-form">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <SkillForm onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal: Editar skill ── */}
      <AnimatePresence>
        {editTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(10,10,12,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={() => setEditTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="glass-card p-8 w-full max-w-lg my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">Editar Tecnología</h2>
                <button onClick={() => setEditTarget(null)} className="text-textDim hover:text-accent" id="close-edit-skill">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <SkillForm initial={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} saving={saving} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal: Confirmar eliminación ── */}
      <DeleteModal
        project={deleteTarget ? { name: deleteTarget.name } : null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

/* ────────────── DASHBOARD ROOT ────────────── */
export default function DashboardPage() {
  const { projects, loading, error, addProject, updateProject, deleteProject, refetch } = useProjects()
  const [editProject, setEditProject]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [saving, setSaving]             = useState(false)

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
            <Route path="/skills" element={<SkillsManager />} />
          </Routes>
        </main>
      </div>

      {/* Edit Project Modal */}
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
                <button onClick={() => setEditProject(null)} className="text-textDim hover:text-accent" id="close-edit-modal">
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

      {/* Delete Project Modal */}
      <DeleteModal
        project={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
