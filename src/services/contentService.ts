import { announcements } from '../data/announcements'
import { availablePhones } from '../data/contact-phones'
import { contacts, schoolChannels } from '../data/contacts'
import { events } from '../data/events'
import { faq } from '../data/faq'
import { library } from '../data/library'
import { procedures } from '../data/procedures'
import { guidanceTopics } from '../data/guidance'
import { mawhibaOpportunities, mawhibaPrograms } from '../data/mawhiba'
import { orgStructure, parentMessage, school } from '../data/school'
import { services, whatToDo } from '../data/services'
import { schoolValues, valuesConfig } from '../data/values'
import { initiatives, volunteerAchievements, volunteerConditions, volunteerOpportunities } from '../data/volunteer'
import type { Announcement, Contact, SchoolEvent, SchoolValue } from '../types/content'
import { daysBetween, parseDate, startOfToday } from '../lib/dates'
import { API_URL, DATA_SOURCE } from './config'

/**
 * طبقة المحتوى — نقطة الوصول الوحيدة للبيانات من الواجهات.
 * في المرحلة الثانية تُستبدل أجسام هذه الدوال باستدعاءات API (انظري fromApi)
 * دون أي تعديل في الصفحات والمكونات.
 */

async function fromApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`تعذّر تحميل البيانات (${res.status})`)
  return res.json() as Promise<T>
}

function source<T>(local: T, apiPath: string): Promise<T> {
  return DATA_SOURCE === 'api' ? fromApi<T>(apiPath) : Promise.resolve(local)
}

export const content = {
  school: () => source(school, '/school'),
  orgStructure: () => source(orgStructure, '/school/structure'),
  parentMessage: () => source(parentMessage, '/school/parent-message'),
  services: () => source(services, '/services'),
  whatToDo: () => source(whatToDo, '/services/what-to-do'),
  guidance: () => source(guidanceTopics, '/guidance'),
  mawhibaPrograms: () => source(mawhibaPrograms, '/mawhiba/programs'),
  mawhibaOpportunities: () => source(mawhibaOpportunities, '/mawhiba/opportunities'),
  initiatives: () => source(initiatives, '/volunteer/initiatives'),
  volunteerConditions: () => source(volunteerConditions, '/volunteer/conditions'),
  volunteerOpportunities: () => source(volunteerOpportunities, '/volunteer/opportunities'),
  volunteerAchievements: () => source(volunteerAchievements, '/volunteer/achievements'),
  events: () => source(events, '/events'),
  announcements: () => source(announcements, '/announcements'),
  contacts: () => source(localContacts(), '/contacts'),
  channels: () => source(schoolChannels, '/contacts/channels'),
  values: () => source(schoolValues, '/values'),
  faq: () => source(faq, '/faq'),
  library: () => source(library, '/library'),
  procedures: () => source(procedures, '/procedures'),
}

/**
 * دليل التواصل محليًا: البطاقات الفعّالة مرتبة، مع دمج الأرقام المسموح بها فقط.
 * في المرحلة الثانية يعيد الخادم الأرقام المعتمدة فقط بالشكل نفسه.
 */
function localContacts(): Contact[] {
  const phones = availablePhones()
  return contacts
    .filter((c) => c.active)
    .sort((a, b) => a.order - b.order)
    .map((c) => {
      const p = phones[c.id]
      return p ? { ...c, phone: p.phone, whatsapp: p.whatsapp, phoneUnpublished: !p.publishable } : c
    })
}

/* ——— منطق العرض المشترك (يبقى في الواجهة حتى بعد ربط الخادم) ——— */

/** الإعلانات السارية: منشورة وغير منتهية، المثبّت أولًا ثم الأحدث */
export function activeAnnouncements(list: Announcement[], today = startOfToday()): Announcement[] {
  return list
    .filter((a) => parseDate(a.date) <= today && (!a.expires || parseDate(a.expires) >= today))
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.date.localeCompare(a.date))
}

export type EventState = 'current' | 'upcoming' | 'past'

export function eventState(ev: SchoolEvent, today = startOfToday()): EventState {
  const start = parseDate(ev.start)
  const end = parseDate(ev.end ?? ev.start)
  if (end < today) return 'past'
  if (start <= today) return 'current'
  return 'upcoming'
}

export function upcomingEvents(list: SchoolEvent[], limit?: number, today = startOfToday()) {
  const items = list
    .filter((e) => eventState(e, today) !== 'past')
    .sort((a, b) => a.start.localeCompare(b.start))
  return limit ? items.slice(0, limit) : items
}

export function archivedEvents(list: SchoolEvent[], today = startOfToday()) {
  return list.filter((e) => eventState(e, today) === 'past').sort((a, b) => b.start.localeCompare(a.start))
}

export function eventsOnDay(list: SchoolEvent[], day: Date) {
  return list.filter((e) => {
    const s = parseDate(e.start)
    const en = parseDate(e.end ?? e.start)
    return day >= s && day <= en
  })
}

/** قيمة الأسبوع: المثبتة يدويًا، أو الدورية حسب رقم الأسبوع */
export function valueOfTheWeek(values: SchoolValue[], today = startOfToday()): SchoolValue | undefined {
  if (!values.length) return undefined
  const fixed = values.find((v) => v.id === valuesConfig.featuredValueId)
  if (fixed) return fixed
  const weeks = Math.floor(daysBetween(parseDate(valuesConfig.rotationStart), today) / 7)
  return values[((weeks % values.length) + values.length) % values.length]
}

/** أرشيف قيم الأسابيع السابقة (الأحدث أولًا) مع تاريخ بداية كل أسبوع */
export function valueArchive(values: SchoolValue[], today = startOfToday(), limit = 12): { value: SchoolValue; weekStart: Date }[] {
  if (!values.length || valuesConfig.featuredValueId) return []
  const start = parseDate(valuesConfig.rotationStart)
  const weeks = Math.floor(daysBetween(start, today) / 7)
  const out: { value: SchoolValue; weekStart: Date }[] = []
  for (let w = weeks - 1; w >= 0 && out.length < limit; w--) {
    const d = new Date(start)
    d.setDate(d.getDate() + w * 7)
    out.push({ value: values[w % values.length], weekStart: d })
  }
  return out
}
