import { useLanguage } from '../../hooks/useLanguage'

/**
 * Toggle switch ES ↔ EN
 * Uses a <button role="switch"> instead of label+checkbox to avoid
 * browser scroll-to-focus behavior when the user clicks from lower on the page.
 */
export default function LanguageSwitch() {
  const { lang, toggle } = useLanguage()
  const isEN = lang === 'en'

  const handleToggle = (e) => {
    // Remove focus immediately so the browser doesn't scroll to the sticky navbar
    e.currentTarget.blur()
    toggle()
  }

  return (
    <div
      className="flex items-center gap-2"
      title={isEN ? 'Switch to Spanish' : 'Cambiar a Inglés'}
    >
      {/* ES label */}
      <span
        className={`text-[10px] font-black font-mono tracking-widest transition-colors duration-200 ${
          !isEN ? 'text-accent' : 'text-textDim'
        }`}
      >
        ES
      </span>

      {/* Toggle — button with role="switch" for accessibility */}
      <button
        type="button"
        role="switch"
        aria-checked={isEN}
        aria-label={isEN ? 'Switch to Spanish' : 'Cambiar a Inglés'}
        onClick={handleToggle}
        className="relative inline-flex items-center cursor-pointer select-none focus:outline-none"
      >
        {/* Track */}
        <div
          className={`relative w-[50px] h-[30px] rounded-full transition-colors duration-200 ${
            isEN ? 'bg-[rgb(148,118,255)]' : 'bg-[rgb(82,82,82)]'
          }`}
        >
          {/* Thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border-[5px] border-white bg-transparent shadow-md transition-all duration-200 ${
              isEN ? 'left-[calc(100%-15px)] bg-white' : 'left-[5px]'
            }`}
          />
        </div>
      </button>

      {/* EN label */}
      <span
        className={`text-[10px] font-black font-mono tracking-widest transition-colors duration-200 ${
          isEN ? 'text-[rgb(148,118,255)]' : 'text-textDim'
        }`}
      >
        EN
      </span>
    </div>
  )
}
