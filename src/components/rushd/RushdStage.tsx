import { useEffect, useRef, useState } from 'react'
import { RushdBot, type RushdMood } from './RushdBot'

const GREETING = 'أهلًا بك'
const LINES: [RushdMood, string][] = [
  ['wave', 'مرحبًا!'],
  ['happy', 'أنا رُشد، مساعدك'],
  ['wow', 'اسألني عن أي خدمة'],
  ['love', 'يسعدني أساعدك'],
]

/** رُشد في الرئيسية: يتجوّل في مداره، يلتفت نحو المؤشر، ويتفاعل باللمس والنقر */
export function RushdStage({ onOpen }: { onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [mood, setMood] = useState<RushdMood>('idle')
  const [line, setLine] = useState(GREETING)
  const [hover, setHover] = useState(false)
  const [lean, setLean] = useState({ x: 0, y: 0 })

  // يبدّل مشاعره وحده كل بضع ثوانٍ ما دام المؤشر بعيدًا عنه
  useEffect(() => {
    if (hover) return
    let i = 0
    let back = 0
    const t = window.setInterval(() => {
      const [m, l] = LINES[i++ % LINES.length]
      setMood(m)
      setLine(l)
      back = window.setTimeout(() => setMood('idle'), 1800)
    }, 5000)
    return () => {
      clearInterval(t)
      clearTimeout(back)
    }
  }, [hover])

  // يلتفت نحو المؤشر للجميع، «تقليل الحركة» أيضًا (رُشد يتحرك للجميع، Abood 2026-10-22)
  useEffect(() => {
    let raf = 0
    const clamp = (v: number) => Math.max(-1, Math.min(1, v))
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        setLean({
          x: clamp(((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2),
          y: clamp(((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 2),
        })
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="rushd-wander relative">
      <p
        key={line}
        className="bubble-in absolute -top-6 end-[72%] z-10 whitespace-nowrap rounded-2xl rounded-ee-sm bg-white px-3.5 py-2 text-sm font-medium text-ink-800 shadow-soft ring-1 ring-lav-100"
      >
        {line}
      </p>
      <button
        ref={ref}
        type="button"
        aria-label="اسأل رُشد"
        onClick={() => {
          setMood('happy')
          setLine('تفضّل، اسألني')
          window.setTimeout(onOpen, 350)
        }}
        onPointerEnter={() => {
          setHover(true)
          setMood('wave')
          setLine('مرحبًا!')
        }}
        onPointerLeave={() => {
          setHover(false)
          setMood('idle')
        }}
        className="rushd-lean block cursor-pointer rounded-full transition-transform duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lav-400"
        style={{ transform: `translate(${lean.x * 18}px, ${lean.y * 12}px) rotate(${lean.x * 7}deg)` }}
      >
        <span className="rushd-float block">
          <RushdBot size={150} body mood={mood} />
        </span>
      </button>
    </div>
  )
}
