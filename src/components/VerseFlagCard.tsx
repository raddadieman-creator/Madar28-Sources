import { WavingFlag } from './WavingFlag'

/** أعلى الصفحة: علم المملكة يرفرف على ساريته، وبجانبه دعاء إبراهيم عليه السلام */
export function VerseFlagCard() {
  return (
    <figure className="flex items-center gap-5 overflow-hidden rounded-[1.75rem] bg-gradient-to-l from-[#0D3F24] via-[#145A30] to-[#1B6B3A] px-5 py-4 text-white shadow-soft md:gap-8 md:px-10 md:py-5">
      <WavingFlag className="w-32 shrink-0 md:w-40" />
      <div className="min-w-0">
        <blockquote className="text-2xl font-bold leading-[1.9] md:text-3xl md:leading-[1.7]">﴿رَبِّ اجْعَلْ هَٰذَا الْبَلَدَ آمِنًا﴾</blockquote>
        <figcaption className="mt-1 text-sm text-white/75">[إبراهيم: 35]</figcaption>
      </div>
    </figure>
  )
}
