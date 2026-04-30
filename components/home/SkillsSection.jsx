import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

const skills = [
  { name: 'React.js / Next.js', percent: 95 },
  { name: 'Supabase / Backend', percent: 88 },
  { name: 'HTML5 / CSS3 Nativo', percent: 98 },
  { name: 'IA & Automation', percent: 82 },
  { name: 'Node.js / APIs', percent: 90 },
  { name: 'DevOps / Docker', percent: 75 },
]

function SkillBar({ name, percent, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="bg-white/[0.03] p-5 rounded-xl">
      <div className="flex justify-between mb-3">
        <span className="font-semibold text-sm text-textMain">{name}</span>
        <span className="font-mono text-accent text-sm">{percent}%</span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.4, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function SkillsSection() {
  const { t } = useLanguage()

  return (
    <motion.section
      id="habilidades"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="glass-card p-10 mb-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-accent">code</span>
        <h2 className="text-3xl font-black">{t.skills.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, i) => (
          <SkillBar key={skill.name} {...skill} delay={i * 0.12} />
        ))}
      </div>
    </motion.section>
  )
}
