import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useSkills } from '../../hooks/useSkills'

/* ─── Skeleton para cold-start ─── */
function SkeletonBar({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="bg-white/[0.03] p-5 rounded-xl"
    >
      <div className="flex justify-between mb-3">
        <div className="h-4 w-2/5 rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-10 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-3/4 rounded-full bg-white/10 animate-pulse" />
      </div>
    </motion.div>
  )
}

/* ─── Barra individual ─── */
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
  const { skills, loading } = useSkills()

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
        {loading && skills.length === 0
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonBar key={i} index={i} />)
          : skills.map((skill, i) => (
              <SkillBar
                key={skill.id ?? skill._id ?? i}
                name={skill.name}
                percent={skill.percent}
                delay={i * 0.12}
              />
            ))
        }
      </div>
    </motion.section>
  )
}
