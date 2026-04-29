import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProjects } from '../hooks/useProjects'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { getProject } = useProjects()
  const { isAuth } = useAuth()
  const navigate = useNavigate()
  const project = getProject(id)

  if (!project) {
    return (
      <div className="min-h-screen bg-bgBase flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-textDim text-8xl mb-4 block">search_off</span>
            <h1 className="text-4xl font-black mb-4">Proyecto no encontrado</h1>
            <p className="text-textDim mb-8">El proyecto que buscas no existe o fue eliminado.</p>
            <Link to="/" className="btn-primary">
              VOLVER AL PORTFOLIO
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bgBase">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 pb-16">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-textDim hover:text-accent transition-colors mb-8 nav-link"
          id="back-btn"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          VOLVER
        </motion.button>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl overflow-hidden mb-8 border border-white/5"
          style={{ maxHeight: '520px' }}
        >
          <img
            src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80'}
            alt={project.name}
            className="w-full h-full object-cover"
            style={{ maxHeight: '520px' }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80' }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2 glass-card p-10"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(project.tags || []).map((tag) => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>

            <h1 className="text-5xl font-black mb-6 leading-tight">{project.name}</h1>
            <p className="text-textDim text-lg leading-relaxed">{project.description}</p>

            {/* Divider */}
            <div className="border-t border-white/5 my-8" />

            {/* Meta */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-textDim font-semibold mb-1">Creado</p>
                <p className="font-mono text-accent">
                  {new Date(project.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-textDim font-semibold mb-1">ID del Proyecto</p>
                <p className="font-mono text-textDim text-sm">{project.id}</p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Links card */}
            <div className="glass-card p-8">
              <h3 className="font-black text-lg mb-6">Accesos Directos</h3>
              <div className="flex flex-col gap-3">
                {project.demoLink ? (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-center flex items-center justify-center gap-2"
                    id="project-demo-link"
                  >
                    <span className="material-symbols-outlined text-xl">open_in_new</span>
                    VER DEMO
                  </a>
                ) : (
                  <div className="btn-ghost text-center opacity-40 cursor-not-allowed">SIN DEMO</div>
                )}

                {project.repoFrontLink || project.repoBackLink ? (
                  <>
                    {project.repoFrontLink && (
                      <a
                        href={project.repoFrontLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost text-center flex items-center justify-center gap-2"
                        id="project-repo-front-link"
                      >
                        <span className="material-symbols-outlined text-xl">web</span>
                        REPO FRONTEND
                      </a>
                    )}
                    {project.repoBackLink && (
                      <a
                        href={project.repoBackLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost text-center flex items-center justify-center gap-2"
                        id="project-repo-back-link"
                      >
                        <span className="material-symbols-outlined text-xl">dns</span>
                        REPO BACKEND
                      </a>
                    )}
                  </>
                ) : project.repoLink ? (
                  <a
                    href={project.repoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost text-center flex items-center justify-center gap-2"
                    id="project-repo-link"
                  >
                    <span className="material-symbols-outlined text-xl">code</span>
                    REPOSITORIO
                  </a>
                ) : (
                  <div className="btn-ghost text-center opacity-40 cursor-not-allowed">SIN REPOSITORIO</div>
                )}
              </div>
            </div>

            {/* Tech stack */}
            <div className="glass-card p-8">
              <h3 className="font-black text-lg mb-6">Stack Tecnológico</h3>
              <div className="flex flex-col gap-2">
                {(project.tags || []).map((tag) => (
                  <div key={tag} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-textMain font-medium">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions — solo visible para admin */}
            {isAuth && (
              <div className="glass-card p-8">
                <h3 className="font-black text-lg mb-6">Acciones</h3>
                <div className="flex flex-col gap-3">
                  <Link to="/dashboard" className="btn-ghost text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-xl">edit</span>
                    GESTIONAR
                  </Link>
                  <Link to="/#proyectos" className="text-textDim text-sm text-center hover:text-accent transition-colors">
                    ← Ver todos los proyectos
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
