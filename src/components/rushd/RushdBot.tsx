import { useId } from 'react'

/**
 * «رُشد» — شخصية أصلية لمنصة مدار 28.
 * الرأس على هيئة قوس مستوحى من عمارة المدينة المنورة، وشاشة الوجه بلون حبر الشعار،
 * والهوائي نجمة إرشاد بالأخضر المريمي. الحركات خفيفة وتتوقف عند تفعيل «تقليل الحركة».
 */
export function RushdBot({
  size = 48,
  body = false,
  animated = true,
  thinking = false,
  className = '',
}: {
  size?: number
  body?: boolean
  animated?: boolean
  thinking?: boolean
  className?: string
}) {
  const uid = useId().replace(/:/g, '')
  const head = `rb-head-${uid}`
  const screen = `rb-screen-${uid}`
  const glow = `rb-glow-${uid}`
  // مع الجسم نوسّع إطار الرسم قليلًا ليتسع للذراع الملوّحة
  const vb = body ? '-3 0 70 96' : '0 0 64 64'
  const ratio = body ? 96 / 70 : 1
  const anim = (cls: string) => (animated ? cls : '')

  return (
    <svg
      width={size}
      height={size * ratio}
      viewBox={vb}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={head} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B4A5DC" />
          <stop offset="1" stopColor="#7059AA" />
        </linearGradient>
        <linearGradient id={screen} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#21585C" />
          <stop offset="1" stopColor="#123A3D" />
        </linearGradient>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#E4F5E1" />
          <stop offset="1" stopColor="#A9C6A3" />
        </radialGradient>
      </defs>

      {body && (
        <g>
          {/* الذراع المتدلية */}
          <line x1="15" y1="66" x2="8.5" y2="81" stroke="#8770C0" strokeWidth="7" strokeLinecap="round" />
          <circle cx="8" cy="83" r="3.6" fill="#A9C6A3" />
          {/* الذراع الملوّحة */}
          <g className={anim('rushd-wave')} style={{ transformOrigin: '49px 66px' }}>
            <line x1="49" y1="66" x2="59" y2="52" stroke="#8770C0" strokeWidth="7" strokeLinecap="round" />
            <circle cx="60.5" cy="49.5" r="4.4" fill="#A9C6A3" />
          </g>
          {/* الجسم */}
          <rect x="13" y="58" width="38" height="32" rx="12" fill={`url(#${head})`} />
          <rect x="13" y="58" width="38" height="32" rx="12" fill="none" stroke="#FBFAFE" strokeOpacity=".35" />
          {/* شارة المدار على الصدر */}
          <circle cx="32" cy="73" r="8.5" fill="#F5F2FB" />
          <circle cx="32" cy="73" r="5.6" fill="none" stroke="#7059AA" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="28 7.2" transform="rotate(-62 32 73)" />
          <circle cx="32" cy="73" r="1.9" fill="#1A4C50" />
          <circle cx="36.8" cy="70.1" r="1.4" fill="#679060" />
        </g>
      )}

      {/* الهوائي ونجمة الإرشاد */}
      <line x1="32" y1="12" x2="32" y2="6.5" stroke="#7059AA" strokeWidth="2" strokeLinecap="round" />
      <path
        className={anim('rushd-antenna')}
        style={{ transformOrigin: '32px 4.5px' }}
        d="M32 0.6l1.15 2.75L35.9 4.5l-2.75 1.15L32 8.4l-1.15-2.75L28.1 4.5l2.75-1.15z"
        fill="#86AD7F"
      />

      {/* الأذنان */}
      <rect x="4.5" y="33" width="6" height="12" rx="3" fill="#A9C6A3" />
      <rect x="53.5" y="33" width="6" height="12" rx="3" fill="#A9C6A3" />

      {/* الرأس: قوس */}
      <path d="M9 50V34a23 22 0 0 1 46 0v16a8 8 0 0 1-8 8H17a8 8 0 0 1-8-8z" fill={`url(#${head})`} />
      <path d="M13.5 50V34.6a18.5 17.6 0 0 1 37 0V50" fill="none" stroke="#FBFAFE" strokeOpacity=".35" strokeWidth="1.2" />

      {/* شاشة الوجه */}
      <rect x="16.5" y="27" width="31" height="23" rx="10" fill={`url(#${screen})`} />

      {/* العينان */}
      {thinking ? (
        <g fill="none" stroke={`url(#${glow})`} strokeWidth="2.2" strokeLinecap="round">
          <path d="M22.5 37.5q3-3.2 6 0" />
          <path d="M35.5 37.5q3-3.2 6 0" />
        </g>
      ) : (
        <g className={anim('rushd-blink')} style={{ transformOrigin: '32px 37px' }}>
          <rect x="23" y="32.5" width="5.2" height="8" rx="2.6" fill={`url(#${glow})`} />
          <rect x="35.8" y="32.5" width="5.2" height="8" rx="2.6" fill={`url(#${glow})`} />
          <circle cx="26.6" cy="34.6" r="1" fill="#fff" opacity=".85" />
          <circle cx="39.4" cy="34.6" r="1" fill="#fff" opacity=".85" />
        </g>
      )}

      {/* الابتسامة والوجنتان */}
      <path d="M28.6 44.2q3.4 2.6 6.8 0" fill="none" stroke="#A9C6A3" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="20.6" cy="44.5" r="1.6" fill="#C2B4E3" opacity=".55" />
      <circle cx="43.4" cy="44.5" r="1.6" fill="#C2B4E3" opacity=".55" />
    </svg>
  )
}
