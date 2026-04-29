import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Introduce un correo válido.'
    if (!form.message.trim() || form.message.trim().length < 10)
      errs.message = 'El mensaje debe tener al menos 10 caracteres.'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSending(true)
    // Simulate sending
    setTimeout(() => {
      setSending(false)
      setForm({ name: '', email: '', message: '' })
      toast.success('¡Transmisión enviada correctamente!', {
        style: {
          background: '#141417',
          color: '#e2e2e6',
          border: '1px solid rgba(0, 240, 255, 0.3)',
        },
        iconTheme: { primary: '#00f0ff', secondary: '#0a0a0c' },
      })
    }, 1500)
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  return (
    <section id="contacto" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 mb-6">
      {/* Info */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass-card p-10"
      >
        <h2 className="text-3xl font-black mb-8">Canal de Contacto</h2>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-textDim font-semibold mb-1">E-mail</p>
            <p className="font-mono text-accent text-base">rodolfo.perez01@iest.edu.mx</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-textDim font-semibold mb-1">Ubicación</p>
            <p className="text-base">Tampico, Tamps.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-textDim font-semibold mb-1">Disponibilidad</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-accent text-sm font-mono">ACTIVO</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-10">
          {['share', 'database', 'code_off'].map((icon) => (
            <span key={icon} className="material-symbols-outlined text-textDim hover:text-accent transition-colors cursor-pointer text-3xl">
              {icon}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        noValidate
        className="glass-card p-10 lg:col-span-2 flex flex-col gap-5"
      >
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-xs uppercase tracking-widest text-textDim font-semibold mb-2">
            Nombre Completo
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
            className={`form-input ${errors.name ? 'border-red-500/60' : ''}`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-xs uppercase tracking-widest text-textDim font-semibold mb-2">
            Correo Electrónico
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="juan@ejemplo.com"
            className={`form-input ${errors.email ? 'border-red-500/60' : ''}`}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="block text-xs uppercase tracking-widest text-textDim font-semibold mb-2">
            Mensaje
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="Describe tu proyecto o consulta..."
            className={`form-input resize-none ${errors.message ? 'border-red-500/60' : ''}`}
          />
          {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
        </div>

        <motion.button
          type="submit"
          disabled={sending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          id="contact-submit-btn"
        >
          {sending ? 'ENVIANDO...' : 'ENVIAR TRANSMISIÓN'}
        </motion.button>
      </motion.form>
    </section>
  )
}
