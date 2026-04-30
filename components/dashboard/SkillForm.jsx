import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const DEFAULT = { name: '', percent: 80, order: 0 }

export default function SkillForm({ initial = null, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial ? {
    name: initial.name ?? '',
    percent: initial.percent ?? 80,
    order: initial.order ?? 0,
  } : DEFAULT)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) {
      setForm({ name: initial.name ?? '', percent: initial.percent ?? 80, order: initial.order ?? 0 })
    }
  }, [initial])

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'El nombre es obligatorio.'
    if (form.percent < 0 || form.percent > 100) e.percent = 'Debe estar entre 0 y 100.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onSave({ name: form.name.trim(), percent: Number(form.percent), order: Number(form.order) })
  }

  const pct = Math.min(100, Math.max(0, Number(form.percent) || 0))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-textDim mb-2">
          Tecnología / Nombre *
        </label>
        <input
          id="skill-name-input"
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Ej: React.js / Next.js"
          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-sm text-textMain placeholder-textDim/50 focus:outline-none focus:ring-2 transition-all ${
            errors.name ? 'border-red-400/60 focus:ring-red-400/30' : 'border-white/10 focus:ring-accent/40 focus:border-accent/50'
          }`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      {/* Nivel */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-textDim mb-2">
          Nivel de dominio *
        </label>
        <div className="flex items-center gap-4 mb-3">
          <input
            id="skill-percent-range"
            type="range"
            min={0}
            max={100}
            step={1}
            value={form.percent}
            onChange={(e) => set('percent', e.target.value)}
            className="flex-1 accent-[#00f0ff] h-2 cursor-pointer"
          />
          <input
            id="skill-percent-number"
            type="number"
            min={0}
            max={100}
            value={form.percent}
            onChange={(e) => set('percent', e.target.value)}
            className={`w-16 bg-white/5 border rounded-lg px-2 py-1.5 text-sm text-center font-mono text-accent focus:outline-none focus:ring-2 transition-all ${
              errors.percent ? 'border-red-400/60 focus:ring-red-400/30' : 'border-white/10 focus:ring-accent/40'
            }`}
          />
          <span className="font-mono text-accent text-sm font-bold w-8">%</span>
        </div>

        {/* Preview de barra */}
        <div className="bg-white/[0.03] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-textMain">{form.name || 'Vista previa'}</span>
            <span className="font-mono text-accent text-sm">{pct}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00f0ff, #00b4d8)' }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
        {errors.percent && <p className="mt-1 text-xs text-red-400">{errors.percent}</p>}
      </div>

      {/* Orden */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-textDim mb-2">
          Orden de aparición
        </label>
        <input
          id="skill-order-input"
          type="number"
          min={0}
          value={form.order}
          onChange={(e) => set('order', e.target.value)}
          placeholder="0"
          className="w-28 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all"
        />
        <p className="mt-1 text-xs text-textDim">Número menor aparece primero.</p>
      </div>

      {/* Acciones */}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          id="skill-save-btn"
          className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full"
              />
              GUARDANDO...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">save</span>
              {initial ? 'ACTUALIZAR' : 'GUARDAR'}
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          id="skill-cancel-btn"
          className="px-5 py-2.5 rounded-lg border border-white/10 text-textDim hover:text-textMain hover:border-white/30 transition-all text-sm font-bold tracking-wide"
        >
          CANCELAR
        </motion.button>
      </div>
    </form>
  )
}
