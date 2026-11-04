import emblem from '../assets/emblem-sa.webp'
import { WavingFlag } from './LeadersBanner'

/** أعلى الرئيسية: علم المملكة يرفرف وشعارها، مع آية الدعاء للبلد والدعاء لولاة الأمر */
export function VerseFlagCard() {
  return (
    <figure className="flex flex-wrap items-center gap-x-6 gap-y-3 overflow-hidden rounded-[1.75rem] bg-gradient-to-l from-[#0D3F24] via-[#145A30] to-[#1B6B3A] px-5 py-5 text-white shadow-soft md:flex-nowrap md:gap-8 md:px-10">
      <div className="flex shrink-0 items-center gap-4">
        <WavingFlag big />
        <img src={emblem} alt="شعار المملكة العربية السعودية" className="h-16 w-auto drop-shadow-md md:h-20" />
      </div>
      <div className="min-w-0">
        <blockquote className="text-2xl font-bold leading-[1.9] md:text-3xl md:leading-[1.7]">﴿رَبِّ اجْعَلْ هَٰذَا الْبَلَدَ آمِنًا﴾</blockquote>
        <figcaption className="mt-1 text-sm text-white/75">
          [إبراهيم: 35] · <span className="text-[#F3E3B5]">اللهم احفظ ولاة أمرنا، وأدم على بلادنا نعمة الأمن والأمان</span>
        </figcaption>
      </div>
    </figure>
  )
}
