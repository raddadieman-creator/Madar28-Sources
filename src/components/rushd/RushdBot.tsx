import { useEffect, useId, useState } from 'react'

/**
 * «رُشد» — شخصية أصلية لمنصة مدار 28، طفولية ولطيفة (2026-10-22).
 * الرأس قوس مستدير مستوحى من عمارة المدينة المنورة، وشاشة الوجه بلون حبر الشعار، وعينان كبيرتان لامعتان،
 * ووجنتان ورديتان، والهوائي نجمة إرشاد بالأخضر المريمي. الجسم صغير كالدمية بذراعين وقدمين قصيرتين.
 * الحركات ناعمة (تنفّس، طفو، رمشة) وتعمل للجميع، حتى مع «تقليل الحركة» (طلب عبود).
 *
 * المشاعر (mood): هادئ، يفكّر، سعيد، يتكلّم، يلوّح، يعتذر، يحب، مندهش. لكل منها عينان وفم وحركة وإيموت
 * فوق الرأس (نقاط التفكير، القلوب، البريق، قطرة الاعتذار)، كلها مرسومة هنا بلا رموز تعبيرية.
 */
export type RushdMood = 'idle' | 'think' | 'happy' | 'talk' | 'wave' | 'sorry' | 'love' | 'wow'

const SAGE = '#A9C6A3'
const SAGE_D = '#86AD7F'
const LAV_D = '#7A64B6'
const PINK = '#F4B6CC'
const EYE = '#D9F2D4'
// مركزا العينين على الشاشة
const LX = 25.2, RX = 38.8, EY = 35.6

export function RushdBot({
  size = 48,
  body = false,
  animated = true,
  thinking = false,
  mood: moodProp,
  className = '',
}: {
  size?: number
  body?: boolean
  animated?: boolean
  thinking?: boolean
  mood?: RushdMood
  className?: string
}) {
  const uid = useId().replace(/:/g, '')
  const head = `rb-head-${uid}`, screen = `rb-screen-${uid}`, belly = `rb-belly-${uid}`
  const mood: RushdMood = moodProp ?? (thinking ? 'think' : 'idle')
  const vb = body ? '-3 0 70 96' : '0 0 64 64'
  const ratio = body ? 96 / 70 : 1
  const anim = (cls: string) => (animated ? cls : '')
  const hop = mood === 'happy' || mood === 'love' || mood === 'wow'
  const moodMove = hop ? 'rushd-hop' : mood === 'think' ? 'rushd-sway' : mood === 'sorry' ? 'rushd-droop' : 'rushd-breathe'

  return (
    <svg width={size} height={size * ratio} viewBox={vb} className={className} aria-hidden="true" focusable="false" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={head} x1="0.2" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#CBBFEB" />
          <stop offset="0.55" stopColor="#A08BD6" />
          <stop offset="1" stopColor={LAV_D} />
        </linearGradient>
        <linearGradient id={screen} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24606A" />
          <stop offset="1" stopColor="#123A3D" />
        </linearGradient>
        <radialGradient id={belly} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EDE7FA" />
        </radialGradient>
      </defs>

      {body && <ellipse cx="32" cy="93.2" rx="15" ry="2.6" fill="#2F2456" opacity=".12" className={anim('rushd-shadow')} style={{ transformOrigin: '32px 93px' }} />}

      <g className={anim(moodMove)} style={{ transformOrigin: body ? '32px 90px' : '32px 56px' }}>
        {body && (
          <g>
            {/* القدمان */}
            <ellipse cx="25" cy="88.6" rx="5.4" ry="3.4" fill={LAV_D} />
            <ellipse cx="39" cy="88.6" rx="5.4" ry="3.4" fill={LAV_D} />
            {/* الذراع اليسرى المتدلية */}
            <g className={anim('rushd-arm')} style={{ transformOrigin: '18px 66px' }}>
              <path d="M18.5 65.5q-6 4-7.2 11" fill="none" stroke="#9A85D2" strokeWidth="6.4" strokeLinecap="round" />
              <circle cx="11.2" cy="77.2" r="3.6" fill={SAGE} />
            </g>
            {/* الذراع الملوّحة */}
            <g className={anim(mood === 'wave' ? 'rushd-wave-big' : 'rushd-wave')} style={{ transformOrigin: '46px 66px' }}>
              <path d="M45.5 66q7.2-1.6 10.6-8.6" fill="none" stroke="#9A85D2" strokeWidth="6.4" strokeLinecap="round" />
              <circle cx="56.6" cy="56.2" r="3.8" fill={SAGE} />
            </g>
            {/* الجسم: حبّة صغيرة مستديرة */}
            <path d="M18 70c0-7 6.2-11.6 14-11.6S46 63 46 70v7.4c0 6-5 10.2-14 10.2s-14-4.2-14-10.2z" fill={`url(#${head})`} />
            <ellipse cx="32" cy="74.6" rx="8.6" ry="8" fill={`url(#${belly})`} />
            <circle cx="32" cy="74.6" r="4.6" fill="none" stroke={LAV_D} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="22 6.6" transform="rotate(-62 32 74.6)" />
            <circle cx="32" cy="74.6" r="1.6" fill="#1A4C50" />
            <circle cx="35.8" cy="72.2" r="1.2" fill="#679060" />
          </g>
        )}

        {/* الهوائي ونجمة الإرشاد */}
        <path d="M32 11.6q-.6-3.4 1-5.4" fill="none" stroke={LAV_D} strokeWidth="2" strokeLinecap="round" />
        <g className={anim(mood === 'think' ? 'rushd-antenna-fast' : 'rushd-antenna')} style={{ transformOrigin: '33px 4px' }}>
          <path d="M33 .2l1.3 2.6 2.7 1.2-2.7 1.2L33 7.8l-1.3-2.6L29 4l2.7-1.2z" fill={SAGE_D} />
          <circle cx="32.2" cy="3.2" r=".6" fill="#fff" opacity=".8" />
        </g>

        {/* الأذنان */}
        <ellipse cx="7.4" cy="36" rx="3.6" ry="6" fill={SAGE} />
        <ellipse cx="56.6" cy="36" rx="3.6" ry="6" fill={SAGE} />

        {/* الرأس: قوس مستدير */}
        <path d="M8 37C8 21 18.4 11 32 11s24 10 24 26v7c0 6.4-4.6 10.8-11 10.8H19C12.6 54.8 8 50.4 8 44z" fill={`url(#${head})`} />
        <path d="M14 30c1.4-7.4 6.8-12.6 14-13.4" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="47.8" cy="21.6" r="1.4" fill="#fff" opacity=".45" />

        {/* شاشة الوجه */}
        <rect x="14.2" y="24.4" width="35.6" height="24.4" rx="11.6" fill={`url(#${screen})`} />
        <path d="M18.6 27.6q6-1.6 12-1.2" fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth="1.6" strokeLinecap="round" />

        <Eyes mood={mood} anim={anim} />
        <Mouth mood={mood} anim={anim} />
        {/* الوجنتان */}
        <ellipse cx="19.6" cy="43" rx={mood === 'love' || hop ? 3 : 2.4} ry="1.6" fill={PINK} opacity={mood === 'love' ? 0.95 : 0.7} />
        <ellipse cx="44.4" cy="43" rx={mood === 'love' || hop ? 3 : 2.4} ry="1.6" fill={PINK} opacity={mood === 'love' ? 0.95 : 0.7} />
      </g>

      {animated && <Emote mood={mood} />}
    </svg>
  )
}

function Eyes({ mood, anim }: { mood: RushdMood; anim: (c: string) => string }) {
  const arc = (x: number, up = true) => <path d={up ? `M${x - 3.4} ${EY + 1.6}q3.4-4.4 6.8 0` : `M${x - 3.2} ${EY - 0.6}q3.2 3.4 6.4 0`} fill="none" stroke={EYE} strokeWidth="2.6" strokeLinecap="round" />
  const big = (x: number, rx = 4.2, ry = 5.2) => (
    <g>
      <ellipse cx={x} cy={EY} rx={rx} ry={ry} fill={EYE} />
      <ellipse cx={x} cy={EY + 0.6} rx={rx * 0.62} ry={ry * 0.66} fill="#123A3D" />
      <circle cx={x + 1.3} cy={EY - 1.6} r={rx * 0.34} fill="#fff" />
      <circle cx={x - 1.3} cy={EY + 1.8} r={rx * 0.16} fill="#fff" opacity=".8" />
    </g>
  )
  switch (mood) {
    case 'think':
      return <g className={anim('rushd-look')}>{big(LX - 0.4, 3.8, 4.6)}{big(RX - 0.4, 3.8, 4.6)}</g>
    case 'happy':
    case 'wave':
      return <g>{arc(LX)}{arc(RX)}</g>
    case 'sorry':
      return (
        <g>
          {big(LX, 3.8, 4.4)}{big(RX, 3.8, 4.4)}
          <path d={`M${LX - 4} ${EY - 5.2}l6.2 -2.2M${RX + 4} ${EY - 5.2}l-6.2 -2.2`} stroke={SAGE} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )
    case 'love': {
      const heart = (x: number) => <path d={`M${x} ${EY + 4.4}c-4.6-3-5.8-5.4-4.9-7.1 1-1.8 3.6-1.8 4.9.4 1.3-2.2 3.9-2.2 4.9-.4.9 1.7-.3 4.1-4.9 7.1z`} fill={PINK} />
      return <g className={anim('rushd-pulse')} style={{ transformOrigin: `32px ${EY}px` }}>{heart(LX)}{heart(RX)}</g>
    }
    case 'wow':
      return <g>{big(LX, 4.8, 5.8)}{big(RX, 4.8, 5.8)}</g>
    default:
      return <g className={anim('rushd-blink')} style={{ transformOrigin: `32px ${EY}px` }}>{big(LX)}{big(RX)}</g>
  }
}

function Mouth({ mood, anim }: { mood: RushdMood; anim: (c: string) => string }) {
  const s = { fill: 'none', stroke: EYE, strokeWidth: 1.6, strokeLinecap: 'round' as const }
  switch (mood) {
    case 'talk':
      return <ellipse className={anim('rushd-talk')} style={{ transformOrigin: '32px 44.2px' }} cx="32" cy="44.2" rx="2.6" ry="1.9" fill={PINK} />
    case 'happy':
    case 'wave':
    case 'love':
      return <path d="M28.6 42.6q3.4 3.6 6.8 0z" fill={PINK} stroke={PINK} strokeWidth="1" strokeLinejoin="round" />
    case 'sorry':
      return <path d="M29.6 45.2q2.4-1.8 4.8 0" {...s} />
    case 'wow':
      return <ellipse cx="32" cy="44.4" rx="1.9" ry="2.3" fill={PINK} />
    case 'think':
      return <path d="M30.4 44.4q1.6.8 3.4-.2" {...s} />
    default:
      return <path d="M29.4 43q2.6 2.2 5.2 0" {...s} />
  }
}

/** الإيموت فوق الرأس */
function Emote({ mood }: { mood: RushdMood }) {
  switch (mood) {
    case 'think':
      return (
        <g transform="translate(47 4)">
          <circle cx="-3" cy="9" r="1.4" fill="#F5F2FB" stroke="#C2B4E3" strokeWidth=".8" />
          <rect x="-2" y="-6" width="22" height="12" rx="6" fill="#F5F2FB" stroke="#C2B4E3" strokeWidth="1" />
          {[3.5, 9, 14.5].map((x, k) => <circle key={x} className="rushd-dot" style={{ animationDelay: `${k * 0.18}s` }} cx={x} cy="0" r="1.6" fill={LAV_D} />)}
        </g>
      )
    case 'love':
      return (
        <g>
          {[[52, 10, 0], [60, 18, 0.5], [46, 4, 1]].map(([x, y, d]) => (
            <path key={d} className="rushd-heart" style={{ animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}
              d={`M${x} ${y + 4}c-4.2-2.8-5.4-4.9-4.6-6.5.9-1.6 3.3-1.6 4.6.3 1.3-1.9 3.7-1.9 4.6-.3.8 1.6-.4 3.7-4.6 6.5z`} fill={PINK} />
          ))}
        </g>
      )
    case 'happy':
    case 'wow':
      return (
        <g>
          {[[57, 9, 4, 0], [7, 8, 3, 0.3], [62, 26, 2.6, 0.6]].map(([x, y, r, d]) => (
            <path key={d} className="rushd-spark" style={{ animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}
              d={`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`} fill="#F2DDA9" stroke="#B08A55" strokeWidth=".6" />
          ))}
        </g>
      )
    case 'sorry':
      return <path className="rushd-drop" d="M53 17q3 4.4 0 6.2-3-1.8 0-6.2z" fill="#BFE0EE" stroke="#7FA9BB" strokeWidth=".6" />
    default:
      return null
  }
}

/**
 * رُشد في الأزرار والقوائم يعيش وحده: كل بضع ثوانٍ يبتسم أو يلوّح أو يُرسل قلبًا لحظةً ثم يهدأ.
 * يعمل للجميع، «تقليل الحركة» أيضًا (طلب عبود).
 */
export function useAliveMood(base: RushdMood = 'idle', every = 9000): RushdMood {
  const [m, setM] = useState<RushdMood>(base)
  useEffect(() => {
    const cycle: RushdMood[] = ['happy', 'wave', 'love', 'wow']
    let k = 0
    let back: ReturnType<typeof setTimeout> | undefined
    const id = setInterval(() => {
      setM(cycle[k++ % cycle.length])
      back = setTimeout(() => setM(base), 2200)
    }, every)
    return () => { clearInterval(id); if (back) clearTimeout(back) }
  }, [base, every])
  return m
}
