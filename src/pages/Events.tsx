import { Archive, CalendarDays, List } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MonthCalendar } from '../components/calendar/MonthCalendar'
import { EventRow } from '../components/EventRow'
import { EmptyState, PageHeader, Skeleton } from '../components/ui/primitives'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { formatGregorian, formatHijri, startOfToday } from '../lib/dates'
import { archivedEvents, content, eventsOnDay, upcomingEvents } from '../services/contentService'
import type { EventCategory } from '../types/content'

const CATEGORIES: EventCategory[] = ['وطنية', 'عالمية', 'تربوية', 'اختبارات', 'إجازات', 'أنشطة']
const VIEWS = [
  { id: 'month', label: 'الشهر', icon: CalendarDays },
  { id: 'list', label: 'القادمة', icon: List },
  { id: 'archive', label: 'الأرشيف', icon: Archive },
] as const
type View = (typeof VIEWS)[number]['id']

export default function Events() {
  useTitle('الفعاليات والتقويم')
  const { data: all } = useContent(content.events)
  const [params, setParams] = useSearchParams()
  const view = (params.get('view') as View) || 'month'
  const cat = params.get('cat') as EventCategory | null

  const today = startOfToday()
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(today)

  const events = useMemo(() => (all ?? []).filter((e) => !cat || e.category === cat), [all, cat])
  const dayEvents = eventsOnDay(events, selected)

  const set = (k: string, v: string | null) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v)
    else p.delete(k)
    setParams(p, { replace: true })
  }

  return (
    <>
      <PageHeader
        title="الفعاليات والتقويم"
        intro="المناسبات الوطنية والعالمية والتربوية، ومواعيد المدرسة، بالتاريخين الهجري والميلادي."
        icon={<CalendarDays className="h-6 w-6" />}
      />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="طريقة العرض" className="inline-flex rounded-2xl bg-white p-1 ring-1 ring-lav-100">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={view === v.id}
              type="button"
              onClick={() => set('view', v.id === 'month' ? null : v.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${
                view === v.id ? 'bg-lav-600 font-medium text-white' : 'text-ink-600 hover:bg-lav-50'
              }`}
            >
              <v.icon className="h-4 w-4" aria-hidden="true" />
              {v.label}
            </button>
          ))}
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" aria-label="تصفية حسب النوع">
          <button type="button" onClick={() => set('cat', null)} className={`chip shrink-0 ${!cat ? 'border-lav-500 bg-lav-50 font-medium text-lav-800' : ''}`} aria-pressed={!cat}>
            الكل
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => set('cat', c)} className={`chip shrink-0 ${cat === c ? 'border-lav-500 bg-lav-50 font-medium text-lav-800' : ''}`} aria-pressed={cat === c}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {!all ? (
        <Skeleton className="h-[28rem]" />
      ) : view === 'month' ? (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <MonthCalendar events={events} month={month} onMonthChange={setMonth} selected={selected} onSelect={setSelected} />
          <section aria-labelledby="day-title" className="lg:sticky lg:top-24 lg:self-start">
            <h2 id="day-title" className="text-base font-semibold">
              {formatGregorian(selected, true)}
            </h2>
            <p className="mb-4 text-sm text-ink-500">{formatHijri(selected)}</p>
            {dayEvents.length ? (
              <div className="space-y-3">
                {dayEvents.map((e) => (
                  <EventRow key={e.id} ev={e} />
                ))}
              </div>
            ) : (
              <EmptyState title="لا توجد فعاليات في هذا اليوم">الأيام ذات العلامة الملونة فيها فعاليات.</EmptyState>
            )}
          </section>
        </div>
      ) : view === 'list' ? (
        <EventList items={upcomingEvents(events)} empty="لا توجد فعاليات قادمة في هذا التصنيف" />
      ) : (
        <EventList items={archivedEvents(events)} empty="الأرشيف فارغ" />
      )}

      <p className="mt-8 text-xs text-ink-400">
        التاريخ الهجري محسوب بتقويم أم القرى. والمرجع في مواعيد الاختبارات والإجازات التقويم الدراسي المعتمد.
      </p>
    </>
  )
}

function EventList({ items, empty }: { items: ReturnType<typeof upcomingEvents>; empty: string }) {
  if (!items.length) return <EmptyState title={empty} />
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((e) => (
        <EventRow key={e.id} ev={e} />
      ))}
    </div>
  )
}
