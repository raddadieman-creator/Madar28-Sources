import { Link } from 'react-router-dom'
import { eventCategoryStyle } from '../data/events'
import { formatHijri, formatTime, hijriDay, monthShort, parseDate, relativeDays } from '../lib/dates'
import { eventState } from '../services/contentService'
import type { SchoolEvent } from '../types/content'
import { DraftBadge } from './ui/primitives'

/** صف فعالية: كتلة التاريخ (ميلادي + هجري) ثم التفاصيل */
export function EventRow({ ev, compact = false }: { ev: SchoolEvent; compact?: boolean }) {
  const start = parseDate(ev.start)
  const state = eventState(ev)
  const style = eventCategoryStyle[ev.category]
  return (
    <Link
      to={`/events/${ev.id}`}
      className="group flex items-stretch gap-4 rounded-2xl bg-white p-3 ring-1 ring-lav-100 transition-colors hover:ring-lav-300"
    >
      <div
        className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-xl py-2 text-center ${
          state === 'current' ? 'bg-sage-500 text-white' : 'bg-lav-50 text-ink-800'
        }`}
      >
        <span className="text-xl font-semibold leading-none">{start.getDate()}</span>
        <span className="mt-1 text-xs">{monthShort(start)}</span>
        <span className={`mt-1 text-[10px] ${state === 'current' ? 'text-white/85' : 'text-ink-400'}`}>{hijriDay(start)} هـ</span>
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`rounded-full border px-2 py-0.5 ${style.chip}`}>{ev.category}</span>
          {state === 'current' ? (
            <span className="rounded-full bg-sage-100 px-2 py-0.5 font-medium text-sage-700">جارية الآن</span>
          ) : state === 'upcoming' ? (
            <span className="text-ink-500">{relativeDays(start)}</span>
          ) : null}
          <DraftBadge status={ev.status} />
        </div>
        <h3 className="text-[15px] font-semibold group-hover:text-lav-800">{ev.title}</h3>
        {!compact && <p className="mt-0.5 line-clamp-2 text-sm text-ink-600">{ev.description}</p>}
        <p className="mt-1 text-xs text-ink-400">
          {formatHijri(start)}
          {ev.time && ` — ${formatTime(ev.time)}`}
        </p>
      </div>
    </Link>
  )
}
