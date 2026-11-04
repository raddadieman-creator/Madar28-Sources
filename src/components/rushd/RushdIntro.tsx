import { useEffect, useState } from 'react'
import { RushdBot, type RushdMood } from './RushdBot'

/**
 * تحية رُشد عند فتح الموقع (مرة في الزيارة): يطلّ برأسه من طرف الشاشة مندهشًا، يتراجع خجلًا، ثم يمشي
 * إلى الداخل فرحًا، يقف ويلوّح ويقول «مرحبا»، ثم ينسحب. الضغط عليه يفتح المحادثة.
 * الحركة في CSS (.rushd-intro)، والمشاعر تتبدّل هنا بالتوقيت نفسه. يظهر للجميع، «تقليل الحركة» أيضًا (طلب عبود).
 */
export function RushdIntro({ show, onOpen }: { show: boolean; onOpen: () => void }) {
  const [mood, setMood] = useState<RushdMood>('wow')
  const [walking, setWalking] = useState(false)
  const [bubble, setBubble] = useState(false)

  useEffect(() => {
    if (!show) return
    const at = (ms: number, f: () => void) => window.setTimeout(f, ms)
    const ts = [
      at(0, () => setMood('wow')),
      at(2200, () => { setMood('happy'); setWalking(true) }),
      at(3250, () => { setWalking(false); setMood('wave'); setBubble(true) }),
      at(5800, () => { setBubble(false); setMood('idle') }),
    ]
    return () => ts.forEach((t) => window.clearTimeout(t))
  }, [show])

  if (!show) return null
  return (
    <button type="button" onClick={onOpen} aria-label="اسأل رُشد"
      className="rushd-intro fixed bottom-[5.5rem] end-0 z-40 flex items-end lg:bottom-24">
      {/* في الاتجاه من اليمين لليسار: الفقاعة أولًا (نحو الداخل) ثم رُشد عند الحافة */}
      {bubble && (
        <span className="bubble-in mb-16 -me-2 whitespace-nowrap rounded-2xl rounded-es-sm bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 shadow-lift ring-1 ring-lav-100">
          مرحبا! أنا رُشد
        </span>
      )}
      <span className={walking ? 'rushd-walk' : ''}>
        <RushdBot size={92} body mood={mood} />
      </span>
    </button>
  )
}
