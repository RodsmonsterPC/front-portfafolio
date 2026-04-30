import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'
import { useLanguage } from '../../hooks/useLanguage'

// ─── EmailJS Configuration ────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_3y814nk'
const EMAILJS_TEMPLATE_ID = 'template_0rltr11'
const EMAILJS_PUBLIC_KEY  = 'iMocoRn1pAd5CAfNj'

const toastStyle = {
  style: {
    background: '#141417',
    color: '#e2e2e6',
    border: '1px solid rgba(0, 240, 255, 0.3)',
  },
  iconTheme: { primary: '#00f0ff', secondary: '#0a0a0c' },
}

export default function ContactSection() {
  const { t } = useLanguage()
  const formRef = useRef(null)
  const [form, setForm] = useState({ from_name: '', from_email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {}
    if (!form.from_name.trim())
      errs.from_name = t.contact.nameRequired
    if (!form.from_email.trim())
      errs.from_email = t.contact.emailRequired
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.from_email))
      errs.from_email = t.contact.emailInvalid
    if (!form.message.trim())
      errs.message = t.contact.messageRequired
    else if (form.message.trim().length < 10)
      errs.message = t.contact.messageTooShort
    return errs
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSending(true)
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      )
      setForm({ from_name: '', from_email: '', message: '' })
      toast.success(t.contact.successMsg, toastStyle)
    } catch (err) {
      console.error('EmailJS error:', err)
      toast.error(t.contact.errorMsg, {
        style: toastStyle.style,
        iconTheme: { primary: '#ff4d4d', secondary: '#0a0a0c' },
      })
    } finally {
      setSending(false)
    }
  }

  // ── Change handler ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
    }
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
        <h2 className="text-3xl font-black mb-8">{t.contact.title}</h2>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-textDim font-semibold mb-1">{t.contact.email}</p>
            <p className="font-mono text-accent text-base">rodolfo.perez01@iest.edu.mx</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-textDim font-semibold mb-1">{t.contact.location}</p>
            <p className="text-base">{t.contact.locationValue}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-textDim font-semibold mb-1">{t.contact.availability}</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-accent text-sm font-mono">{t.contact.availabilityValue}</span>
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
        ref={formRef}
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
            {t.contact.nameLabel} <span className="text-red-400">*</span>
          </label>
          <input
            id="contact-name"
            name="from_name"
            type="text"
            value={form.from_name}
            onChange={handleChange}
            placeholder={t.contact.namePlaceholder}
            className={`form-input ${errors.from_name ? 'border-red-500/60 focus:border-red-500/80' : ''}`}
          />
          {errors.from_name && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {errors.from_name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-xs uppercase tracking-widest text-textDim font-semibold mb-2">
            {t.contact.emailLabel} <span className="text-red-400">*</span>
          </label>
          <input
            id="contact-email"
            name="from_email"
            type="email"
            value={form.from_email}
            onChange={handleChange}
            placeholder={t.contact.emailPlaceholder}
            className={`form-input ${errors.from_email ? 'border-red-500/60 focus:border-red-500/80' : ''}`}
          />
          {errors.from_email && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {errors.from_email}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="block text-xs uppercase tracking-widest text-textDim font-semibold mb-2">
            {t.contact.messageLabel} <span className="text-red-400">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder={t.contact.messagePlaceholder}
            className={`form-input resize-none ${errors.message ? 'border-red-500/60 focus:border-red-500/80' : ''}`}
          />
          {errors.message && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {errors.message}
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={sending}
          whileHover={{ scale: sending ? 1 : 1.02 }}
          whileTap={{ scale: sending ? 1 : 0.98 }}
          className="btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          id="contact-submit-btn"
        >
          {sending ? (
            <>
              <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
              {t.contact.sending}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">send</span>
              {t.contact.submit}
            </>
          )}
        </motion.button>
      </motion.form>
    </section>
  )
}
