import type { CSSProperties } from 'react'
import flag from '../assets/flag-sa.svg'
import emblem from '../assets/emblem-sa.webp'

// علم المملكة الرسمي (ويكيميديا، ملكية عامة) وشعارها الرسمي الذي أرسلته أم ريان، مع الدعاء (2026-10-22)
const STRIPS = 24

export function LeadersBanner() {
  return (
    <div className="flex items-center gap-3 md:gap-4" role="group" aria-label="دعاء للوطن وولاة الأمر">
      <WavingFlag />
      <img src={emblem} alt="شعار المملكة العربية السعودية" className="leaders-in h-14 w-auto shrink-0 drop-shadow-md md:h-16" style={{ animationDelay: '100ms' }} />
      <div className="leaders-in min-w-0" style={{ animationDelay: '200ms' }}>
        <p className="text-[15px] font-bold leading-6 text-[#F3E3B5] md:text-base">اللهم احفظ ولاة أمرنا</p>
        <p className="text-xs leading-5 text-white/80 md:text-[13px]">وأدم على بلادنا نعمة الأمن والأمان</p>
      </div>
    </div>
  )
}

// ltr ثابت: السارية يسار والشهادة تُقرأ صحيحة مهما كان اتجاه الصفحة
export function WavingFlag({ big = false }: { big?: boolean }) {
  return (
    <span dir="ltr" className="leaders-in flex shrink-0 items-stretch" role="img" aria-label="علم المملكة العربية السعودية">
      <span className={`-my-1.5 rounded-full bg-[#E9D29A] ${big ? 'w-1' : 'w-[3px]'}`} aria-hidden="true" />
      <span className={`flex drop-shadow-md ${big ? 'h-20 w-[120px] md:h-24 md:w-[144px]' : 'h-12 w-[72px] md:h-14 md:w-[84px]'}`} aria-hidden="true">
        {Array.from({ length: STRIPS }, (_, i) => {
          // السعة تكبر بالبعد عن السارية، والتأخير يجعل الموجة تسري نحو الطرف
          const wave = {
            '--a': (0.15 + (0.85 * i) / (STRIPS - 1)).toFixed(3),
            animationDelay: `${-(STRIPS - i) * 0.09}s`,
          } as CSSProperties
          return (
            <span
              key={i}
              className="flag-wave-strip relative h-full flex-1"
              style={{
                ...wave,
                backgroundImage: `url("${flag}")`,
                backgroundSize: `${STRIPS * 100}% 100%`,
                backgroundPosition: `${(i / (STRIPS - 1)) * 100}% 0`,
              }}
            >
              <span className="flag-wave-shade absolute inset-0 bg-black" style={wave} />
            </span>
          )
        })}
      </span>
    </span>
  )
}
