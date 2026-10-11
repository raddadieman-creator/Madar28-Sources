import type { SchoolValue } from '../types/content'
import { Icon } from './ui/Icon'

/** قيمة الأسبوع — الموضع الوحيد الذي يظهر فيه ذهبي الشعار */
export function ValueCard({ value }: { value: SchoolValue }) {
  return (
    <section aria-labelledby="value-title" className="arch-top relative overflow-hidden bg-gradient-to-b from-gold-100 via-cream to-white px-6 pb-6 pt-12 ring-1 ring-gold-100">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gold-700 shadow-soft">
        <Icon name={value.icon} className="h-7 w-7" />
      </div>
      <p className="text-center text-sm text-gold-700">قيمة الأسبوع</p>
      <h2 id="value-title" className="mt-1 text-center text-2xl font-semibold">
        {value.name}
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-center text-sm text-ink-600">{value.meaning}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-ink-700">
        {value.practices.map((p) => (
          <li key={p} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
    </section>
  )
}
