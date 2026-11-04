import { toISODate } from '../lib/dates'
import type { Announcement } from '../types/content'

/**
 * الاتصال بتطبيق المدرسة دون حساب أو تسجيل دخول:
 * - إرسال المشاركات إلى صفحة «المشاركات» (الزائر يرسل فقط ولا يقرأ أي رسالة).
 * - قراءة الإعلانات التي اختارت المدرسة إظهارها في الموقع.
 * المفتاح عام (publishable) ومخصّص للمتصفح؛ الحماية في قاعدة البيانات نفسها.
 */
const SUPABASE_URL = 'https://noibixxxvuxcprpryxux.supabase.co'
const KEY = 'sb_publishable_ybXNmG69dCLbh5as51zz5Q_LTbzcPYW'
const SCHOOL_SLUG = 'm28-madinah'

export type InboxKind = 'idea' | 'note' | 'initiative' | 'inquiry' | 'complaint' | 'suggestion' | 'appointment' | 'callback'

export interface InboxMessage {
  p_source: 'voice' | 'contact'
  p_kind: InboxKind
  p_topic: string
  p_details?: string
  p_desk?: string
  p_sender_type?: string
  p_grade?: string
  p_preferred_days?: string
  p_preferred_time?: string
  p_contact_method?: string
  p_contact_name?: string
  p_contact_phone?: string
}

export type SendResult = { ok: true; refNo: number } | { ok: false; message: string }

const ERRORS: Record<string, string> = {
  busy: 'وصلت المدرسة رسائل كثيرة في هذه اللحظة؛ حاول مرة أخرى بعد دقائق.',
  phone_required: 'اكتب رقم الجوال لتتواصل معك المسؤولة.',
  invalid_desk: 'طلب الموعد يكون مع المديرة أو الوكيلة أو الموجهة فقط.',
}

export async function sendToSchool(msg: InboxMessage): Promise<SendResult> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_public_message`, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_school_slug: SCHOOL_SLUG, ...msg }),
    })
    const body = await res.json().catch(() => null)
    if (res.ok && typeof body === 'number') return { ok: true, refNo: body }
    const reason = typeof body?.message === 'string' ? body.message : ''
    return { ok: false, message: ERRORS[reason] ?? 'تعذّر الإرسال الآن. تأكد من الاتصال وحاول مرة أخرى.' }
  } catch {
    return { ok: false, message: 'تعذّر الإرسال الآن. تأكد من الاتصال وحاول مرة أخرى.' }
  }
}

interface WebsiteAnnouncement {
  id: string
  title: string
  body: string
  is_pinned: boolean
  created_at: string
}

/**
 * إعلانات المدرسة المختارة للموقع، الأحدث أولًا؛ تُنشر من «لوحة المدرسة».
 * تُحفظ في الجلسة 10 دقائق: الزائر يتنقّل بين الصفحات دون طلب جديد، فتبقى الخطة المجانية لـ Supabase كافية.
 */
const ANN_KEY = 'madar-announcements'
const ANN_TTL = 10 * 60 * 1000
export async function websiteAnnouncements(): Promise<Announcement[]> {
  try {
    const c = JSON.parse(sessionStorage.getItem(ANN_KEY) ?? 'null') as { at: number; rows: Announcement[] } | null
    if (c && Date.now() - c.at < ANN_TTL) return c.rows
  } catch { /* التخزين غير متاح: نطلبها مباشرة */ }
  const rows = await fetchAnnouncements()
  try { sessionStorage.setItem(ANN_KEY, JSON.stringify({ at: Date.now(), rows })) } catch { /* لا شيء */ }
  return rows
}

async function fetchAnnouncements(): Promise<Announcement[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/website_announcements`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_school_slug: SCHOOL_SLUG }),
  })
  if (!res.ok) throw new Error(`تعذّر تحميل الإعلانات (${res.status})`)
  const rows = (await res.json()) as WebsiteAnnouncement[]
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    date: toISODate(new Date(r.created_at)),
    audience: 'الجميع',
    pinned: r.is_pinned,
    status: 'approved',
  }))
}
