import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EMPTY = {
  name: '',
  description: '',
  image: '',
  demoLink: '',
  repoLink: '',
  repoFrontLink: '',
  repoBackLink: '',
  tags: '',
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-widest text-textDim font-semibold mb-2">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-400 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProjectForm({ initial, onSave, onCancel, saving = false }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(false)
  // Checkbox: repos separados (front + back)
  const [splitRepo, setSplitRepo] = useState(false)

  useEffect(() => {
    if (initial) {
      const hasSplit = !!(initial.repoFrontLink || initial.repoBackLink)
      setSplitRepo(hasSplit)
      setForm({
        name: initial.name || '',
        description: initial.description || '',
        image: initial.image || '',
        demoLink: initial.demoLink || '',
        repoLink: hasSplit ? '' : (initial.repoLink || ''),
        repoFrontLink: initial.repoFrontLink || '',
        repoBackLink: initial.repoBackLink || '',
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : initial.tags || '',
      })
    } else {
      setSplitRepo(false)
      setForm(EMPTY)
    }
    setErrors({})
  }, [initial])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio.'
    if (!form.description.trim()) errs.description = 'La descripción es obligatoria.'
    if (form.image && !/^https?:\/\/.+/.test(form.image)) errs.image = 'Introduce una URL válida.'
    if (form.demoLink && !/^https?:\/\/.+/.test(form.demoLink)) errs.demoLink = 'Introduce una URL válida.'
    if (!splitRepo) {
      if (form.repoLink && !/^https?:\/\/.+/.test(form.repoLink)) errs.repoLink = 'Introduce una URL válida.'
    } else {
      if (form.repoFrontLink && !/^https?:\/\/.+/.test(form.repoFrontLink)) errs.repoFrontLink = 'Introduce una URL válida.'
      if (form.repoBackLink && !/^https?:\/\/.+/.test(form.repoBackLink)) errs.repoBackLink = 'Introduce una URL válida.'
    }
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSplitToggle = () => {
    setSplitRepo((prev) => {
      const next = !prev
      // Limpiar los campos al cambiar de modo
      if (next) {
        setForm((f) => ({ ...f, repoLink: '', repoFrontLink: '', repoBackLink: '' }))
      } else {
        setForm((f) => ({ ...f, repoFrontLink: '', repoBackLink: '', repoLink: '' }))
      }
      setErrors((prev) => ({ ...prev, repoLink: undefined, repoFrontLink: undefined, repoBackLink: undefined }))
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    // Limpiar campos que no aplican según el modo
    const payload = { ...form }
    if (splitRepo) {
      payload.repoLink = ''
    } else {
      payload.repoFrontLink = ''
      payload.repoBackLink = ''
    }
    onSave(payload)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-5"
    >
      <Field id="form-name" label="Nombre del Proyecto *" error={errors.name}>
        <input
          id="form-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Ej: Plataforma Fintech"
          className={`form-input ${errors.name ? 'border-red-500/60' : ''}`}
        />
      </Field>

      <Field id="form-desc" label="Descripción *" error={errors.description}>
        <textarea
          id="form-desc"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe el proyecto, tecnologías y logros..."
          className={`form-input resize-none ${errors.description ? 'border-red-500/60' : ''}`}
        />
      </Field>

      <Field id="form-image" label="Imagen URL" error={errors.image}>
        <div className="flex gap-2">
          <input
            id="form-image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className={`form-input ${errors.image ? 'border-red-500/60' : ''}`}
          />
          {form.image && (
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="btn-ghost px-3 py-2 text-xs shrink-0"
            >
              {preview ? 'OCULTAR' : 'VER'}
            </button>
          )}
        </div>
        <AnimatePresence>
          {preview && form.image && (
            <motion.img
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              src={form.image}
              alt="Preview"
              className="mt-2 rounded-lg w-full max-h-32 object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
        </AnimatePresence>
      </Field>

      <Field id="form-demo" label="Link Demo" error={errors.demoLink}>
        <input
          id="form-demo"
          name="demoLink"
          type="url"
          value={form.demoLink}
          onChange={handleChange}
          placeholder="https://mi-proyecto.com"
          className={`form-input ${errors.demoLink ? 'border-red-500/60' : ''}`}
        />
      </Field>

      {/* ── Repositorios ── */}
      <div className="flex flex-col gap-4">
        {/* Checkbox header */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-textDim font-semibold">
            {splitRepo ? 'Repositorios (Front + Back)' : 'Link Repositorio'}
          </span>
          <label
            htmlFor="split-repo-toggle"
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <span className="text-xs text-textDim group-hover:text-textMain transition-colors">
              Repos separados (Front / Back)
            </span>
            <div className="relative">
              <input
                id="split-repo-toggle"
                type="checkbox"
                checked={splitRepo}
                onChange={handleSplitToggle}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                  splitRepo ? 'bg-accent' : 'bg-white/10'
                }`}
              />
              <motion.div
                layout
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                animate={{ left: splitRepo ? '1.25rem' : '0.125rem' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </label>
        </div>

        {/* Single repo */}
        <AnimatePresence mode="wait">
          {!splitRepo ? (
            <motion.div
              key="single-repo"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <input
                id="form-repo"
                name="repoLink"
                type="url"
                value={form.repoLink}
                onChange={handleChange}
                placeholder="https://github.com/user/repo"
                className={`form-input w-full ${errors.repoLink ? 'border-red-500/60' : ''}`}
              />
              {errors.repoLink && (
                <p className="text-red-400 text-xs mt-1">{errors.repoLink}</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="split-repos"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Frontend */}
              <div>
                <label htmlFor="form-repo-front" className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-accent/70 font-semibold mb-2">
                  <span className="material-symbols-outlined text-sm">web</span>
                  Frontend
                </label>
                <input
                  id="form-repo-front"
                  name="repoFrontLink"
                  type="url"
                  value={form.repoFrontLink}
                  onChange={handleChange}
                  placeholder="https://github.com/user/frontend"
                  className={`form-input w-full ${errors.repoFrontLink ? 'border-red-500/60' : ''}`}
                />
                {errors.repoFrontLink && (
                  <p className="text-red-400 text-xs mt-1">{errors.repoFrontLink}</p>
                )}
              </div>

              {/* Backend */}
              <div>
                <label htmlFor="form-repo-back" className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-accent/70 font-semibold mb-2">
                  <span className="material-symbols-outlined text-sm">dns</span>
                  Backend
                </label>
                <input
                  id="form-repo-back"
                  name="repoBackLink"
                  type="url"
                  value={form.repoBackLink}
                  onChange={handleChange}
                  placeholder="https://github.com/user/backend"
                  className={`form-input w-full ${errors.repoBackLink ? 'border-red-500/60' : ''}`}
                />
                {errors.repoBackLink && (
                  <p className="text-red-400 text-xs mt-1">{errors.repoBackLink}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Field id="form-tags" label="Tags (separados por coma)" error={errors.tags}>
        <input
          id="form-tags"
          name="tags"
          type="text"
          value={form.tags}
          onChange={handleChange}
          placeholder="React, Node.js, Supabase"
          className="form-input"
        />
      </Field>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap mt-2">
        <motion.button
          type="submit"
          whileHover={saving ? {} : { scale: 1.03 }}
          whileTap={saving ? {} : { scale: 0.97 }}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          id="form-submit-btn"
          disabled={saving}
        >
          {saving && (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
            />
          )}
          {saving ? 'GUARDANDO...' : initial ? 'ACTUALIZAR PROYECTO' : 'CREAR PROYECTO'}
        </motion.button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost"
            id="form-cancel-btn"
          >
            CANCELAR
          </button>
        )}
      </div>
    </motion.form>
  )
}
