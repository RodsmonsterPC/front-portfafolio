import { useLanguage } from '../../hooks/useLanguage'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-white/5 py-12 mt-20 text-center">
      <p className="text-textDim text-sm font-mono">
        © {new Date().getFullYear()} Rodolfo Pérez Cerecedo. {t.footer.rights}
      </p>
      <div className="mt-6 flex justify-center gap-8">
        {[
          { label: 'GitHub', href: 'https://github.com/RodsmonsterPC' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rodolfo-p%C3%A9rez-cerecedo-93b69014b/' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="text-textDim text-sm hover:text-accent transition-colors duration-300 uppercase tracking-widest font-semibold"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
