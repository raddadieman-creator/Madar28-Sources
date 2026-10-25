import { ChevronLeft, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SchoolValue } from '../types/content'
import { Icon } from './ui/Icon'
import { ValueIllustration } from './ValueIllustration'

/** قيمة الأسبوع في الرئيسية — الموضع الوحيد الذي يظهر فيه ذهبي الشعار */
export function ValueCard({ value }: { value: SchoolValue }) {
  return (
    <section
      aria-labelledby="value-title"
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-bl from-gold-100 via-cream to-white p-6 ring-1 ring-gold-100 md:p-8"
    >
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute -end-12 -top-12 h-52 w-52 opacity-40" aria-hidden="true">
        <circle cx="100" cy="100" r="92" fill="none" stroke="#B08A55" strokeWidth=".8" />
        <circle cx="100" cy="100" r="66" fill="none" stroke="#B08A55" strokeWidth=".8" strokeDasharray="2 6" />
      </svg>
      <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gold-700">
            <Icon name={value.icon} className="h-4 w-4" />
            ترسيخ القيم — قيمة الأسبوع
          </p>
          <h2 id="value-title" className="mt-2 text-3xl font-extrabold text-ink-900 md:text-4xl">
            {value.name}
          </h2>
          {value.quote && (
            <figure className="mt-4">
              <blockquote className="text-lg leading-9 text-ink-800">﴿{value.quote.text}﴾</blockquote>
              <figcaption className="text-xs text-gold-700">[{value.quote.ref}]</figcaption>
            </figure>
          )}
          {value.saying && (
            <figure className="mt-3 border-s-2 border-gold-300 ps-3">
              <blockquote className="text-[17px] font-semibold leading-8 text-ink-800">«{value.saying.text}»</blockquote>
              <figcaption className="text-xs text-gold-700">
                {value.saying.url ? (
                  <a href={value.saying.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">{value.saying.ref}</a>
                ) : value.saying.ref}
              </figcaption>
            </figure>
          )}
          <p className="mt-3 text-[15px] leading-7 text-ink-600">{value.meaning}</p>
        </div>
        <div className="space-y-3">
        {value.illustration && (
          <div className="flex items-center gap-4 rounded-2xl bg-white/80 p-3 ring-1 ring-gold-100">
            <ValueIllustration name={value.illustration} className="h-24 w-36 shrink-0" />
            {value.note && <p className="text-sm leading-7 text-ink-700">{value.note}</p>}
          </div>
        )}
        <div className="rounded-2xl bg-white/80 p-5 ring-1 ring-gold-100">
          <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
            <Target className="h-4 w-4 text-gold-700" aria-hidden="true" />
            تحدي الأسبوع
          </p>
          <p className="mt-2 text-[15px] leading-7 text-ink-700">{value.challenge}</p>
          <Link to="/values" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-ink-900">
            خطوات القيمة وقيم العام
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        </div>
      </div>
    </section>
  )
}
