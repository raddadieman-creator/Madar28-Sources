import type { SchoolEvent } from '../types/content'
import { parseDate, toISODate } from './dates'

/** إنشاء ملف تقويم .ics لإضافة الفعالية إلى تقويم الجوال أو Outlook أو Google */
export function buildICS(ev: SchoolEvent, schoolName: string): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const compact = (iso: string) => iso.replace(/-/g, '')
  let dtStart: string
  let dtEnd: string
  if (ev.time) {
    // توقيت الرياض ثابت UTC+3 بلا توقيت صيفي، فنحوّل إلى UTC مباشرة
    const [h, m] = ev.time.split(':').map(Number)
    const toUtc = (iso: string, hour: number) => {
      const [y, mo, d] = iso.split('-').map(Number)
      return new Date(Date.UTC(y, mo - 1, d, hour - 3, m)).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    dtStart = `DTSTART:${toUtc(ev.start, h)}`
    dtEnd = `DTEND:${toUtc(ev.end ?? ev.start, h + 1)}`
  } else {
    const endDate = parseDate(ev.end ?? ev.start)
    endDate.setDate(endDate.getDate() + 1)
    dtStart = `DTSTART;VALUE=DATE:${compact(ev.start)}`
    dtEnd = `DTEND;VALUE=DATE:${compact(toISODate(endDate))}`
  }
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => '\\' + c).replace(/\n/g, '\\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Madar28//AR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.id}@madar28`,
    `DTSTAMP:${stamp}`,
    dtStart,
    dtEnd,
    `SUMMARY:${esc(ev.title)}`,
    `DESCRIPTION:${esc(ev.description)}`,
    `LOCATION:${esc(ev.location ?? schoolName)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadICS(ev: SchoolEvent, schoolName: string) {
  const blob = new Blob([buildICS(ev, schoolName)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${ev.id}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
