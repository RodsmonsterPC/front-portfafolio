import { motion } from 'framer-motion'
import profileImg from '../../public/expoconnect-1995.jpg'

export default function AboutSection() {
  return (
    <section id="sobre-mi" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Photo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass-card overflow-hidden lg:row-span-2 group min-h-80"
      >
        <img
          src={profileImg}
          alt="Rodolfo Pérez Cerecedo"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 min-h-80"
          style={{ minHeight: '320px' }}
        />
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="glass-card p-10 lg:col-span-2"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-accent">person</span>
          <h2 className="text-3xl font-black">Desarrollador Fullstack</h2>
        </div>
        <p className="text-textDim text-lg leading-relaxed mb-4">
          Hello, my name is <span className="text-textMain font-semibold">Rodolfo Pérez Cerecedo</span>, 27 years old, from Tampico, Tamaulipas, México.
          A Junior programmer with experience on <span className="text-accent font-semibold">JavaScript, Node.js, Git, Vite.js, Next.js and React</span>.
        </p>
        <p className="text-textDim leading-relaxed opacity-80">
          Updating to new technologies, management on unrelated databases, knowledge of <span className="text-textMain font-medium">AWS</span> and <span className="text-textMain font-medium">Google Cloud</span>.
        </p>
      </motion.div>
    </section>
  )
}
