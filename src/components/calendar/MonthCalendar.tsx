import { ChevronLeft, ChevronRight } from 'lucide-react'
import { eventCategoryStyle } from '../../data/events'
import { gregorianMonthYear, hijriDay, hijriRangeForMonth, startOfToday, toISODate, formatHijri, formatGregorian } from '../../lib/dates'
import { eventsOnDay } from '../../services/contentService'
import type { SchoolEvent } from '../../types/content'

const WEEKDAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const WEEKDAYS_SHORT = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

/**
 * تقويم شهري: الأسبوع يبدأ بالأحد، وكل يوم يعرض رقمه الميلادي والهجري (أم القرى).
 */
export function MonthCalendar({
  events,
  month,
  onMonthChange,
  selected,
  onSelect,
}: {
  events: SchoolEvent[]
  month: Date
  onMonthChange: (d: Date) => void
  selected: Date
  onSelect: (d: Date) => void
}) {
  const y = month.getFullYear()
  const m = month.getMonth()
  const first = new Date(y, m, 1)
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const lead = first.getDay()
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(y, m, i + 1)),
  ]
  while (cells.length % 7) cells.push(null)

  const today = toISODate(startOfToday())
  const sel = toISODate(selected)

  return (
    <div className="rounded-3xl bg-white p-4 ring-1 ring-lav-100 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button type="button" onClick={() => onMonthChange(new Date(y, m - 1, 1))} className="rounded-xl p-2 text-ink-600 hover:bg-lav-50" aria-label="الشهر السابق">
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="text-center" aria-live="polite">
          <h2 className="text-lg font-semibold md:text-xl">{gregorianMonthYear(first)}</h2>
          <p className="text-sm text-ink-500">{hijriRangeForMonth(y, m)}</p>
        </div>
        <button type="button" onClick={() => onMonthChange(new Date(y, m + 1, 1))} className="rounded-xl p-2 text-ink-600 hover:bg-lav-50" aria-label="الشهر التالي">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div role="grid" aria-label={`تقويم ${gregorianMonthYear(first)}`}>
        <div role="row" className="grid grid-cols-7 gap-1 pb-2">
          {WEEKDAYS.map((d, i) => (
            <div key={d} role="columnheader" className="text-center text-[11px] font-medium text-ink-500 sm:text-xs">
              <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
              <span className="hidden sm:inline">{d}</span>
            </div>
          ))}
        </div>
        {Array.from({ length: cells.length / 7 }, (_, row) => (
          <div role="row" key={row} className="grid grid-cols-7 gap-1">
            {cells.slice(row * 7, row * 7 + 7).map((d, i) => {
              if (!d) return <div key={i} role="gridcell" className="aspect-square sm:aspect-[1/0.9]" />
              const iso = toISODate(d)
              const evs = eventsOnDay(events, d)
              const isSel = iso === sel
              const isToday = iso === today
              const weekend = d.getDay() === 5 || d.getDay() === 6
              return (
                <div role="gridcell" key={iso} aria-selected={isSel}>
                  <button
                    type="button"
                    onClick={() => onSelect(d)}
                    aria-label={`${formatGregorian(d, true)}، ${formatHijri(d)}${evs.length ? `، ${evs.length} فعالية` : ''}`}
                    className={`flex aspect-square w-full flex-col items-center justify-between rounded-xl py-1.5 transition-colors sm:aspect-[1/0.9] sm:py-2 ${
                      isSel
                        ? 'bg-lav-600 text-white'
                        : isToday
                          ? 'bg-sage-50 text-ink-900 ring-2 ring-sage-400'
                          : weekend
                            ? 'bg-lav-25 text-ink-400 hover:bg-lav-50'
                            : 'text-ink-800 hover:bg-lav-50'
                    }`}
                  >
                    <span className="text-sm font-semibold leading-none sm:text-base">{d.getDate()}</span>
                    <span className={`text-[10px] leading-none sm:text-[11px] ${isSel ? 'text-lav-100' : 'text-ink-400'}`}>{hijriDay(d)}</span>
                    <span className="flex h-1.5 gap-0.5">
                      {evs.slice(0, 3).map((e) => (
                        <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${isSel ? 'bg-white' : eventCategoryStyle[e.category].dot}`} />
                      ))}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-lav-50 pt-4">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
          {Object.entries(eventCategoryStyle).map(([k, v]) => (
            <li key={k} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${v.dot}`} aria-hidden="true" />
              {k}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            const t = startOfToday()
            onMonthChange(new Date(t.getFullYear(), t.getMonth(), 1))
            onSelect(t)
          }}
          className="btn-ghost px-3 py-1.5 text-xs"
        >
          اليوم
        </button>
      </div>
    </div>
  )
}
