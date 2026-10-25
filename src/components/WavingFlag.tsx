import flagUrl from '../assets/flag-sa.svg'

/**
 * علم المملكة العربية السعودية يرفرف على سارية.
 * الصورة: flag-icons (رخصة MIT). الحركة شرائح عمودية متتابعة بالـ CSS، يزداد اهتزازها
 * كلما ابتعدت عن السارية، وتتوقف تلقائيًا لمن فعّل تقليل الحركة في جهازه.
 */
const SLICES = 28

export function WavingFlag({ className = '' }: { className?: string }) {
  return (
    <div className={`flag-mast ${className}`} role="img" aria-label="علم المملكة العربية السعودية على سارية">
      <span className="flag-mast__finial" aria-hidden="true" />
      <span className="flag-mast__pole" aria-hidden="true" />
      <div className="flag-wave" aria-hidden="true">
        {Array.from({ length: SLICES }, (_, i) => (
          <span
            key={i}
            style={
              {
                backgroundImage: `url("${flagUrl}")`,
                backgroundSize: `${SLICES * 100}% 100%`,
                backgroundPosition: `${(i / (SLICES - 1)) * 100}% 0`,
                animationDelay: `${-i * 0.07}s`,
                '--amp': `${1 + (i / (SLICES - 1)) * 9}%`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
