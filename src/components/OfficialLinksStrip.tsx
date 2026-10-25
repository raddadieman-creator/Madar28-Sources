import { ChevronLeft, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { officialLinks } from '../data/links'

/** روابط المنصات الرسمية بشكل واضح */
export function OfficialLinksStrip() {
  return (
    <section aria-labelledby="links-title">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="links-title" className="text-xl font-bold text-ink-900">روابط المنصات</h2>
        <Link to="/services" className="inline-flex items-center gap-1 text-sm font-medium text-lav-700 hover:text-lav-800">
          كل الخدمات
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {Object.values(officialLinks).map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex h-full items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-lav-100 transition hover:-translate-y-0.5 hover:ring-lav-300">
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-ink-900">{l.label}</span>
                <span className="mt-0.5 block text-xs leading-5 text-ink-500">{l.note}</span>
              </span>
              <ExternalLink className="h-5 w-5 shrink-0 text-lav-500" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
