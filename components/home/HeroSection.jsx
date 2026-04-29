import { motion } from 'framer-motion'

export default function HeroSection({ projectCount = 0 }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
      {/* Main Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="lg:col-span-3 glass-card accent-border-left p-12 flex flex-col justify-center relative overflow-hidden"
      >
        {/* Background grid decoration */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Status badge */}
        <div className="flex items-center gap-2 font-mono text-accent text-xs mb-8 relative z-10">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          SISTEMA ACTIVO: DISPONIBLE PARA PROYECTOS
        </div>

        <h1 className="text-5xl xl:text-7xl font-black leading-tight tracking-tight mb-6 relative z-10">
          Bienvenido al Portfolio de{' '}
          <span className="text-accent text-glow block mt-2">
            Rodolfo Pérez
            <br />
            Cerecedo
          </span>
        </h1>

        <p className="text-textDim text-lg max-w-xl mb-10 relative z-10">
          Desarrollador Web Experto con{' '}
          <span className="text-textMain font-semibold">5 años de experiencia</span> creando
          infraestructuras digitales de alto rendimiento y experiencias de usuario inmersivas.
        </p>

        <div className="flex flex-wrap gap-4 relative z-10">
          <motion.a
            href="#proyectos"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            id="hero-cta-projects"
          >
            EJECUTAR PROYECTOS
          </motion.a>
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-ghost"
            id="hero-cta-contact"
          >
            CONTACTO
          </motion.a>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="lg:col-span-2 grid grid-rows-2 gap-6">
        {[
          { value: '5+', label: 'Años de Experiencia', icon: 'military_tech' },
          { value: `${projectCount}`, label: 'Proyectos Desplegados', icon: 'rocket_launch' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
            className="glass-card p-10 flex flex-col justify-center group hover:border-accent-glow transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-6xl xl:text-7xl font-black text-accent leading-none text-glow">
                {stat.value}
              </span>
              <span className="material-symbols-outlined text-accent/30 text-5xl group-hover:text-accent/60 transition-colors duration-300">
                {stat.icon}
              </span>
            </div>
            <p className="text-textDim text-xs uppercase tracking-widest font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
