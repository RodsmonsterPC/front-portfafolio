import { createContext, useContext, useState } from 'react'

// ─── Translations ──────────────────────────────────────────────────────────────
const translations = {
  es: {
    // Navbar
    nav: {
      aboutMe: 'Sobre Mí',
      skills: 'Habilidades',
      projects: 'Proyectos',
      contact: 'Contacto',
      backToPortfolio: '← Portafolio',
      downloadCV: 'DESCARGAR CV',
      dashboard: 'Dashboard',
      logout: 'Salir',
      closeSession: 'Cerrar sesión',
    },

    // Hero
    hero: {
      statusBadge: 'SISTEMA ACTIVO: DISPONIBLE PARA PROYECTOS',
      greeting: 'Bienvenido al Portfolio de',
      description: 'Desarrollador Web Experto con',
      yearsExperience: '5 años de experiencia',
      descriptionEnd: 'creando infraestructuras digitales de alto rendimiento y experiencias de usuario inmersivas.',
      ctaProjects: 'EJECUTAR PROYECTOS',
      ctaContact: 'CONTACTO',
      statExperience: 'Años de Experiencia',
      statProjects: 'Proyectos Desplegados',
    },

    // About
    about: {
      title: 'Desarrollador Fullstack',
      bio1: 'Hola, mi nombre es',
      bio1End: ', 27 años, de Tampico, Tamaulipas, México. Programador Junior con experiencia en',
      bio2: 'Actualizándome en nuevas tecnologías, manejo de bases de datos no relacionales, conocimiento en',
      bio2And: 'y',
    },

    // Skills
    skills: {
      title: 'Stack Tecnológico',
    },

    // Projects
    projects: {
      tag: 'LISTADO_PROYECTOS.v1',
      title: 'Proyectos',
      explore: 'EXPLORAR NÚCLEO →',
      demo: 'DEMO ↗',
      empty: 'No hay proyectos aún.',
      prevPage: 'Página anterior',
      nextPage: 'Página siguiente',
    },

    // Contact
    contact: {
      title: 'Canal de Contacto',
      email: 'E-mail',
      location: 'Ubicación',
      locationValue: 'Tampico, Tamps.',
      availability: 'Disponibilidad',
      availabilityValue: 'ACTIVO',
      nameLabel: 'Nombre Completo',
      namePlaceholder: 'Ej: Juan Pérez',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'juan@ejemplo.com',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Describe tu proyecto o consulta...',
      submit: 'ENVIAR TRANSMISIÓN',
      sending: 'ENVIANDO...',
      successMsg: '¡Transmisión enviada correctamente!',
      errorMsg: 'Error al enviar. Intenta nuevamente.',
      // Validations
      nameRequired: 'El nombre es obligatorio.',
      emailRequired: 'El correo es obligatorio.',
      emailInvalid: 'Introduce un correo electrónico válido.',
      messageRequired: 'El mensaje es obligatorio.',
      messageTooShort: 'El mensaje debe tener al menos 10 caracteres.',
    },

    // Footer
    footer: {
      rights: 'Todos los datos, proyectos y métricas mostrados son para fines de portafolio.',
    },
  },

  en: {
    // Navbar
    nav: {
      aboutMe: 'About Me',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
      backToPortfolio: '← Portfolio',
      downloadCV: 'DOWNLOAD CV',
      dashboard: 'Dashboard',
      logout: 'Logout',
      closeSession: 'Sign out',
    },

    // Hero
    hero: {
      statusBadge: 'SYSTEM ACTIVE: AVAILABLE FOR PROJECTS',
      greeting: "Welcome to Rodolfo Pérez Cerecedo's Portfolio",
      description: 'Expert Web Developer with',
      yearsExperience: '5 years of experience',
      descriptionEnd: 'building high-performance digital infrastructures and immersive user experiences.',
      ctaProjects: 'VIEW PROJECTS',
      ctaContact: 'CONTACT',
      statExperience: 'Years of Experience',
      statProjects: 'Deployed Projects',
    },

    // About
    about: {
      title: 'Fullstack Developer',
      bio1: 'Hello, my name is',
      bio1End: ', 27 years old, from Tampico, Tamaulipas, México. Junior programmer with experience in',
      bio2: 'Updating to new technologies, management on unrelated databases, knowledge of',
      bio2And: 'and',
    },

    // Skills
    skills: {
      title: 'Tech Stack',
    },

    // Projects
    projects: {
      tag: 'PROJECT_LIST.v1',
      title: 'Projects',
      explore: 'EXPLORE →',
      demo: 'DEMO ↗',
      empty: 'No projects yet.',
      prevPage: 'Previous page',
      nextPage: 'Next page',
    },

    // Contact
    contact: {
      title: 'Contact Channel',
      email: 'E-mail',
      location: 'Location',
      locationValue: 'Tampico, Mexico',
      availability: 'Availability',
      availabilityValue: 'ACTIVE',
      nameLabel: 'Full Name',
      namePlaceholder: 'E.g.: John Doe',
      emailLabel: 'Email Address',
      emailPlaceholder: 'john@example.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Describe your project or inquiry...',
      submit: 'SEND MESSAGE',
      sending: 'SENDING...',
      successMsg: 'Message sent successfully!',
      errorMsg: 'Failed to send. Please try again.',
      // Validations
      nameRequired: 'Name is required.',
      emailRequired: 'Email is required.',
      emailInvalid: 'Please enter a valid email address.',
      messageRequired: 'Message is required.',
      messageTooShort: 'Message must be at least 10 characters.',
    },

    // Footer
    footer: {
      rights: 'All data, projects and metrics shown are for portfolio purposes.',
    },
  },
}

// ─── Context ───────────────────────────────────────────────────────────────────
const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es')
  const toggle = () => setLang((l) => (l === 'es' ? 'en' : 'es'))
  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
