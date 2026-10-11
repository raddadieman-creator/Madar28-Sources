import phones, { NUMBERS_APPROVED as APPROVED } from 'virtual:contact-phones'

/**
 * أرقام التواصل المتاحة لهذه النسخة من الموقع.
 * المصدر: private/contact-phones.json (ملف خاص لا يُرفع إلى GitHub).
 * التصفية تتم وقت البناء في vite.config.ts، فلا يصل إلى الموقع المنشور
 * إلا رقم اعتمدته الإدارة ووافقت عليه صاحبته. التفاصيل في README.
 */
export interface AvailablePhone {
  phone: string
  whatsapp: boolean
  /** false = رقم ظاهر في نسخة التطوير فقط ولن يُنشر */
  publishable: boolean
}

export const NUMBERS_APPROVED: boolean = APPROVED

export function availablePhones(): Record<string, AvailablePhone> {
  return phones
}
