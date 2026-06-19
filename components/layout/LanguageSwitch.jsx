import { useLanguage } from '../../hooks/useLanguage'

/**
 * Toggle switch ES ↔ EN
 * Adapts the HTML/CSS design provided by the user to React + Tailwind.
 */
export default function LanguageSwitch() {
  const { lang, toggle } = useLanguage()
  const isEN = lang === 'en'

  return (
    <div className="flex items-center gap-2" title={isEN ? 'Switch to Spanish' : 'Cambiar a Inglés'}>
      {/* ES label */}
      <span
        className={`text-[10px] font-black font-mono tracking-widest transition-colors duration-200 ${
          !isEN ? 'text-accent' : 'text-textDim'
        }`}
      >
        ES
      </span>

      {/* Toggle */}
      <label
        className="relative inline-flex items-center cursor-pointer select-none"
        onMouseDown={(e) => e.preventDefault()}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={isEN}
          onChange={(e) => {
            e.preventDefault()
            toggle()
          }}
          onFocus={(e) => e.target.blur()}
          id="lang-toggle"
          aria-label="Toggle language"
        />
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
      </label>

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
