import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project, onDelete, onEdit }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden group hover:border-accent-glow transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-44">
        <img
          src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=60'}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=60'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bgCard/90 to-transparent" />
        {/* Date badge */}
        <span className="absolute top-3 right-3 font-mono text-xs text-textDim bg-bgBase/80 px-2 py-1 rounded-md">
          {new Date(project.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-wrap gap-1 mb-3">
          {(project.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="tag-badge text-xs">{tag}</span>
          ))}
        </div>
        <h3 className="text-xl font-black mb-2 group-hover:text-accent transition-colors duration-300">
          {project.name}
        </h3>
        <p className="text-textDim text-sm line-clamp-2 mb-5">{project.description}</p>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to={`/proyecto/${project.id}`}
            className="text-accent text-xs font-bold hover:underline flex items-center gap-1"
            id={`view-project-${project.id}`}
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            VER
          </Link>
          <button
            onClick={() => onEdit(project)}
            className="text-textDim text-xs font-bold hover:text-textMain transition-colors flex items-center gap-1"
            id={`edit-project-${project.id}`}
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            EDITAR
          </button>
          <button
            onClick={() => onDelete(project)}
            className="text-red-400/70 text-xs font-bold hover:text-red-400 transition-colors flex items-center gap-1 ml-auto"
            id={`delete-project-${project.id}`}
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            ELIMINAR
          </button>
        </div>

        {/* Links */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
          {project.demoLink && (
            <a href={project.demoLink} target="_blank" rel="noreferrer"
              className="text-xs text-textDim hover:text-accent transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Demo
            </a>
          )}
          {project.repoFrontLink || project.repoBackLink ? (
            <>
              {project.repoFrontLink && (
                <a href={project.repoFrontLink} target="_blank" rel="noreferrer"
                  className="text-xs text-textDim hover:text-accent transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">web</span>
                  Frontend
                </a>
              )}
              {project.repoBackLink && (
                <a href={project.repoBackLink} target="_blank" rel="noreferrer"
                  className="text-xs text-textDim hover:text-accent transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">dns</span>
                  Backend
                </a>
              )}
            </>
          ) : project.repoLink ? (
            <a href={project.repoLink} target="_blank" rel="noreferrer"
              className="text-xs text-textDim hover:text-accent transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">code</span>
              Repositorio
            </a>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}
