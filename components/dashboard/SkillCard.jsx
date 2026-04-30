import { motion } from 'framer-motion'

export default function SkillCard({ skill, onEdit, onDelete, index }) {
  const pct = Math.min(100, Math.max(0, skill.percent ?? 0))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="glass-card p-5 group relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm text-textMain truncate pr-4">{skill.name}</span>
        <span className="font-mono text-accent text-sm font-bold shrink-0">{pct}%</span>
      </div>

      {/* Barra de progreso */}
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #00f0ff, #00b4d8)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.05 + 0.2 }}
        />
      </div>

      {/* Orden badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-textDim font-mono">orden: {skill.order ?? 0}</span>

        {/* Acciones */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(skill)}
            id={`skill-edit-${skill.id}`}
            aria-label={`Editar ${skill.name}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-textDim hover:text-accent hover:border-accent/50 transition-all"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(skill)}
            id={`skill-delete-${skill.id}`}
            aria-label={`Eliminar ${skill.name}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-textDim hover:text-red-400 hover:border-red-400/50 transition-all"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
