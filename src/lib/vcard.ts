import type { Contact } from '../types/content'
import { toInternational } from './phone'

/** بطاقات vCard لحفظ أرقام المسؤولات في جهات اتصال الجوال */
const ORG = 'المتوسطة الثامنة والعشرون بالمدينة المنورة'

function one(c: Contact): string {
  const esc = (s: string) => s.replace(/[,;\\]/g, (m) => '\\' + m)
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(`${c.name} — ${c.role}`)}`,
    `N:${esc(c.name ?? '')};;;;`,
    `ORG:${esc(ORG)}`,
    `TITLE:${esc(c.role)}`,
    `TEL;TYPE=CELL:+${toInternational(c.phone!)}`,
    'END:VCARD',
  ].join('\r\n')
}

export function downloadVCard(list: Contact[], filename: string) {
  const withPhone = list.filter((c) => c.phone && c.name)
  if (!withPhone.length) return
  const blob = new Blob([withPhone.map(one).join('\r\n')], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** نص الدليل للمشاركة عبر واتساب أو النسخ */
export function directoryText(list: Contact[], siteUrl: string): string {
  const lines = list.filter((c) => c.phone && c.name).map((c) => `• ${c.role}: ${c.name} — ${c.phone}`)
  return [`دليل التواصل — ${ORG}`, '', ...lines, '', `منصة «مدار 28»: ${siteUrl}`].join('\n')
}
