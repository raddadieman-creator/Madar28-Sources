import { CalendarPlus, ChevronLeft, Clock, MapPin, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EventRow } from '../components/EventRow'
import { Icon } from '../components/ui/Icon'
import { DraftBadge, EmptyState, Skeleton } from '../components/ui/primitives'
import { eventCategoryStyle } from '../data/events'
import { school } from '../data/school'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { formatGregorian, formatHijri, formatTime, parseDate, relativeDays } from '../lib/dates'
import { downloadICS } from '../lib/ics'
import { content, eventState, upcomingEvents } from '../services/contentService'

export default function EventDetail() {
  const { id } = useParams()
  const { data: events } = useContent(content.events)
  const ev = events?.find((e) => e.id === id)
  useTitle(ev?.title ?? 'الفعاليات')

  if (!events) return <Skeleton className="h-96" />
  if (!ev)
    return (
      <EmptyState title="لم نجد هذه الفعالية">
        <Link to="/events" className="text-lav-700 underline">العودة إلى التقويم</Link>
      </EmptyState>
    )

  const start = parseDate(ev.start)
  const end = ev.end ? parseDate(ev.end) : undefined
  const state = eventState(ev)
  const style = eventCategoryStyle[ev.category]
  const more = upcomingEvents(events).filter((e) => e.id !== ev.id).slice(0, 3)

  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label="مسار التنقل" className="mb-4 text-sm text-ink-500">
        <Link to="/events" className="hover:text-lav-700">الفعاليات والتقويم</Link>
        <ChevronLeft className="mx-1 inline h-4 w-4" aria-hidden="true" />
        <span className="text-ink-700">{ev.title}</span>
      </nav>

      <article className="overflow-hidden rounded-3xl bg-white ring-1 ring-lav-100">
        <div className="bg-gradient-to-l from-lav-50 to-sage-50 px-6 py-8 md:px-10">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${style.chip}`}>
              <Icon name={style.icon} className="h-3.5 w-3.5" />
              {ev.category}
            </span>
            {state === 'current' && <span className="rounded-full bg-sage-500 px-3 py-1 font-medium text-white">جارية الآن</span>}
            {state === 'past' && <span className="rounded-full bg-ink-200/60 px-3 py-1 text-ink-700">انتهت</span>}
            {state === 'upcoming' && <span className="text-ink-600">{relativeDays(start)}</span>}
            <DraftBadge status={ev.status} />
          </div>
          <h1 className="mt-4 text-2xl font-semibold md:text-3xl">{ev.title}</h1>
        </div>

        <div className="grid gap-px bg-lav-50 sm:grid-cols-2">
          <div className="bg-white px-6 py-4 md:px-10">
            <p className="text-xs text-ink-500">التاريخ الميلادي</p>
            <p className="mt-1 font-medium text-ink-900">
              {formatGregorian(start, true)}
              {end && <span className="block text-sm font-normal text-ink-600">حتى {formatGregorian(end, true)}</span>}
            </p>
          </div>
          <div className="bg-white px-6 py-4 md:px-10">
            <p className="text-xs text-ink-500">التاريخ الهجري</p>
            <p className="mt-1 font-medium text-ink-900">
              {formatHijri(start)}
              {end && <span className="block text-sm font-normal text-ink-600">حتى {formatHijri(end)}</span>}
            </p>
          </div>
        </div>

        <div className="space-y-4 px-6 py-6 md:px-10">
          <p className="max-w-prose text-[16px] leading-8 text-ink-700">{ev.description}</p>
          <ul className="space-y-2 text-sm text-ink-600">
            {ev.time && (
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-lav-500" aria-hidden="true" />
                {formatTime(ev.time)}
              </li>
            )}
            {ev.location && (
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-lav-500" aria-hidden="true" />
                {ev.location}
              </li>
            )}
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-lav-500" aria-hidden="true" />
              {ev.audience.join(' و')}
            </li>
          </ul>
          {state !== 'past' && (
            <button type="button" onClick={() => downloadICS(ev, school.fullName)} className="btn-primary">
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              إضافة إلى التقويم
            </button>
          )}
          {state !== 'past' && <p className="text-xs text-ink-400">يُنزَّل ملف تقويم (ics) يفتح في تقويم الجوال أو Google أو Outlook.</p>}
        </div>
      </article>

      {more.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-base font-semibold">فعاليات قادمة أخرى</h2>
          <div className="space-y-3">
            {more.map((e) => (
              <EventRow key={e.id} ev={e} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
