import { motion, AnimatePresence } from 'framer-motion'

export default function DeleteModal({ project, onConfirm, onCancel }) {
  if (!project) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(10, 10, 12, 0.85)', backdropFilter: 'blur(6px)' }}
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="glass-card p-10 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <span className="material-symbols-outlined text-red-400 text-3xl">warning</span>
          </div>

          <h3 className="text-2xl font-black mb-2">Confirmar Eliminación</h3>
          <p className="text-textDim mb-2">
            Estás a punto de eliminar permanentemente:
          </p>
          <p className="font-mono text-accent mb-8">» {project.name}</p>
          <p className="text-textDim text-sm mb-8">Esta acción no se puede deshacer.</p>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onConfirm}
              className="flex-1 bg-red-500/90 hover:bg-red-500 text-white font-black uppercase tracking-wider py-4 rounded-lg transition-all"
              id="confirm-delete-btn"
            >
              ELIMINAR
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onCancel}
              className="flex-1 btn-ghost"
              id="cancel-delete-btn"
            >
              CANCELAR
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
