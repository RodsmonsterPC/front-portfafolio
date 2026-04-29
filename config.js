/* ─── Configuración de API ───────────────────────────────────────
   En desarrollo usa localhost, en producción usa Render.
   VITE_API_URL se puede definir en Vercel si se necesita cambiar.
─────────────────────────────────────────────────────────────── */
const API_BASE =
  import.meta.env.VITE_API_URL || 'https://back-portafolio-bfe2.onrender.com/api'

export default API_BASE
