import { Clock, Megaphone } from 'lucide-react'
import { useState } from 'react'
import type { Announcement } from '../types/content'

/** إعلان بارز أعلى الصفحة الرئيسية (مثل مواعيد الدوام) */
export function FeaturedAnnouncement({ a }: { a: Announcement }) {
  const [big, setBig] = useState(false)
  return (
    <section aria-labelledby={`fa-${a.id}`} className="overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-lav-100 shadow-soft">
      <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_14rem] md:p-7">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gold-700">
            <Megaphone className="h-4 w-4" aria-hidden="true" />
            إعلان
          </p>
          <h2 id={`fa-${a.id}`} className="mt-1 text-2xl font-extrabold text-ink-900 md:text-3xl">
            {a.title}
          </h2>
          <p className="mt-2 text-[15px] leading-7 text-ink-600">{a.body}</p>
          {a.schedule && (
            <ul className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {a.schedule.map((s) => (
                <li key={s.label} className="rounded-2xl bg-lav-50 px-3 py-3 text-center ring-1 ring-lav-100">
                  <span className="flex items-center justify-center gap-1 text-xs font-semibold text-ink-600">
                    <Clock className="h-3.5 w-3.5 text-lav-600" aria-hidden="true" />
                    {s.label}
                  </span>
                  <span className="mt-1 block text-lg font-extrabold text-ink-900">{s.time}</span>
                </li>
              ))}
            </ul>
          )}
          {a.footer && <p className="mt-4 text-sm leading-7 text-ink-700">{a.footer}</p>}
        </div>
        {a.image && (
          <button
            type="button"
            onClick={() => setBig((v) => !v)}
            aria-label={big ? 'تصغير الصورة' : 'تكبير الصورة'}
            className={`overflow-hidden rounded-2xl ring-1 ring-lav-100 transition hover:ring-lav-300 ${big ? 'md:col-span-2' : 'self-start'}`}
          >
            <img src={a.image.src} alt={a.image.alt} loading="lazy" className={`mx-auto block w-full object-contain ${big ? '' : 'max-h-80 object-top'}`} />
          </button>
        )}
      </div>
    </section>
  )
}
