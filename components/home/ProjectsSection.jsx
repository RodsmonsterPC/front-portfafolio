import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const CARDS_PER_PAGE = 4

function ProjectCard({ project, index }) {
  const { t } = useLanguage()

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative rounded-xl overflow-hidden border border-white/5 group"
      style={{ aspectRatio: '16/9' }}
    >
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bgBase/95 via-bgBase/40 to-transparent flex flex-col justify-end p-8 transition-all duration-300">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(project.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="tag-badge text-xs">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-2xl font-black mb-2">{project.name}</h3>
        <p className="text-textDim text-sm mb-4 line-clamp-2">{project.description}</p>

        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/proyecto/${project.id}`}
            className="text-accent font-bold text-sm hover:underline"
            id={`project-detail-${project.id}`}
          >
            {t.projects.explore}
          </Link>
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noreferrer"
              className="text-textDim font-semibold text-sm hover:text-accent transition-colors"
            >
              {t.projects.demo}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection({ projects }) {
  const { t } = useLanguage()
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(projects.length / CARDS_PER_PAGE)
  const paginated = projects.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE)

  const prev = () => setPage((p) => Math.max(0, p - 1))
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1))

  return (
    <section id="proyectos" className="mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <p className="font-mono text-accent text-xs mb-1 uppercase tracking-widest">
            {t.projects.tag}
          </p>
          <h2 className="text-4xl font-black">{t.projects.title}</h2>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              disabled={page === 0}
              id="projects-prev-btn"
              aria-label={t.projects.prevPage}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-textDim hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </motion.button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  id={`projects-dot-${i}`}
                  aria-label={`${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === page
                      ? 'w-6 h-2 bg-accent'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              disabled={page === totalPages - 1}
              id="projects-next-btn"
              aria-label={t.projects.nextPage}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-textDim hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </motion.button>

            <span className="font-mono text-xs text-textDim ml-1">
              {page + 1}/{totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {paginated.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Estado vacío */}
      {projects.length === 0 && (
        <div className="glass-card p-16 text-center text-textDim">
          <span className="material-symbols-outlined text-5xl mb-4 block">folder_open</span>
          <p className="text-lg font-semibold">{t.projects.empty}</p>
        </div>
      )}
    </section>
  )
}
