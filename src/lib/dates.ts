/**
 * التواريخ: الميلادي والهجري (تقويم أم القرى) عبر واجهة Intl المدمجة في المتصفح.
 * التواريخ تُخزَّن بصيغة YYYY-MM-DD وتُفسَّر بتوقيت المستخدم المحلي.
 */

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function startOfToday(): Date {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
}

const HIJRI_CAL = 'ar-SA-u-ca-islamic-umalqura-nu-latn'
const GREG_CAL = 'ar-SA-u-ca-gregory-nu-latn'

function safeFormat(locale: string, opts: Intl.DateTimeFormatOptions, date: Date): string {
  try {
    return new Intl.DateTimeFormat(locale, opts).format(date)
  } catch {
    return new Intl.DateTimeFormat('ar', opts).format(date)
  }
}

/** 11 أكتوبر 2026 */
export const formatGregorian = (date: Date, withWeekday = false) =>
  safeFormat(GREG_CAL, { day: 'numeric', month: 'long', year: 'numeric', ...(withWeekday ? { weekday: 'long' } : {}) }, date)

/** 29 ربيع الآخر 1448 هـ */
export const formatHijri = (date: Date, withWeekday = false) =>
  safeFormat(HIJRI_CAL, { day: 'numeric', month: 'long', year: 'numeric', ...(withWeekday ? { weekday: 'long' } : {}) }, date)
    .replace(/\s*هـ$/, '') + ' هـ'

export const hijriDay = (date: Date) => safeFormat(HIJRI_CAL, { day: 'numeric' }, date)
export const hijriMonthYear = (date: Date) => safeFormat(HIJRI_CAL, { month: 'long', year: 'numeric' }, date).replace(/\s*هـ$/, '')
export const gregorianMonthYear = (date: Date) => safeFormat(GREG_CAL, { month: 'long', year: 'numeric' }, date)
export const shortGregorian = (date: Date) => safeFormat(GREG_CAL, { day: 'numeric', month: 'short' }, date)
export const weekdayName = (date: Date) => safeFormat(GREG_CAL, { weekday: 'long' }, date)
export const monthShort = (date: Date) => safeFormat(GREG_CAL, { month: 'short' }, date)

/** نطاق الأشهر الهجرية التي يغطيها شهر ميلادي، مثل «ربيع الآخر – جمادى الأولى 1448» */
export function hijriRangeForMonth(year: number, month: number): string {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const a = hijriMonthYear(first)
  const b = hijriMonthYear(last)
  if (a === b) return `${a} هـ`
  const [aMonth, aYear] = splitMonthYear(a)
  const [bMonth, bYear] = splitMonthYear(b)
  return aYear === bYear ? `${aMonth} – ${bMonth} ${bYear} هـ` : `${a} – ${b} هـ`
}

function splitMonthYear(s: string): [string, string] {
  const m = s.match(/^(.*)\s(\d+)$/)
  return m ? [m[1], m[2]] : [s, '']
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

/** «اليوم» / «غدًا» / «بعد 5 أيام» */
export function relativeDays(target: Date, from = startOfToday()): string {
  const d = daysBetween(from, target)
  if (d === 0) return 'اليوم'
  if (d === 1) return 'غدًا'
  if (d === 2) return 'بعد يومين'
  if (d > 2 && d <= 10) return `بعد ${d} أيام`
  if (d > 10) return `بعد ${d} يومًا`
  if (d === -1) return 'أمس'
  return `قبل ${Math.abs(d)} يومًا`
}

export function formatTime(hhmm?: string): string | undefined {
  if (!hhmm) return undefined
  const [h, m] = hhmm.split(':').map(Number)
  const period = h < 12 ? 'صباحًا' : 'مساءً'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}
