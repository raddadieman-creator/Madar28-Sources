/**
 * لوحة المدرسة (بديلة تطبيق الفلاتر، 2026-10-22): دخول المنسوبات بنفس حساباتهن، وقراءة «المشاركات» والإعلانات.
 * الحماية كلها في قاعدة البيانات (RLS): كل منسوبة ترى رسائل مكتبها فقط والمديرة ترى الجميع؛ هذه الصفحة لا تقرّر شيئًا.
 * الجلسة في sessionStorage فقط: تُمسح عند إغلاق المتصفح (أجهزة المدرسة مشتركة).
 */
const SUPABASE_URL = 'https://noibixxxvuxcprpryxux.supabase.co'
const KEY = 'sb_publishable_ybXNmG69dCLbh5as51zz5Q_LTbzcPYW'
const LOGIN_DOMAIN = 'users.deemaschool.invalid' // اسم المستخدم ← <username>@هذا النطاق (كما في التطبيق)
const STORE = 'madar-staff-session'

export interface Session { token: string; refresh: string; expires: number; userId: string }

function save(s: Session | null) {
  try {
    if (s) sessionStorage.setItem(STORE, JSON.stringify(s))
    else sessionStorage.removeItem(STORE)
  } catch { /* التخزين غير متاح: تبقى الجلسة في الذاكرة فقط */ }
}
let current: Session | null = (() => {
  try { return JSON.parse(sessionStorage.getItem(STORE) ?? 'null') as Session | null } catch { return null }
})()

async function auth(grant: 'password' | 'refresh_token', body: object): Promise<Session> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=${grant}`, {
    method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(grant === 'password' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'انتهت الجلسة، سجّلي الدخول من جديد')
  const j = await res.json()
  const s = { token: j.access_token, refresh: j.refresh_token, expires: Date.now() + (j.expires_in ?? 3600) * 1000, userId: j.user?.id }
  save(s)
  current = s
  return s
}

export const signIn = (username: string, password: string) =>
  auth('password', { email: `${username.trim().toLowerCase()}@${LOGIN_DOMAIN}`, password })

export function signOut() {
  if (current) fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${current.token}` } }).catch(() => {})
  current = null
  save(null)
}

export const session = () => current

async function token(): Promise<string> {
  if (!current) throw new Error('سجّلي الدخول أولًا')
  if (Date.now() > current.expires - 60_000) await auth('refresh_token', { refresh_token: current.refresh })
  return current.token
}

async function rest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: KEY, Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(init.headers ?? {}) },
  })
  if (res.status === 401 || res.status === 403) throw new Error('لا تملكين صلاحية هذا الإجراء')
  if (!res.ok) throw new Error(`تعذّر تنفيذ الطلب (${res.status})`)
  return res.status === 204 ? (undefined as T) : res.json()
}

// ------------------------------------------------------------ من أنا
export interface Me { name: string; schoolId: string; roles: string[] }
export async function me(): Promise<Me> {
  const uid = current?.userId
  const [p] = await rest<{ full_name: string }[]>(`profiles?select=full_name&id=eq.${uid}`)
  const m = await rest<{ school_id: string; role: string }[]>(`school_members?select=school_id,role&user_id=eq.${uid}&is_active=eq.true`)
  return { name: p?.full_name ?? '', schoolId: m[0]?.school_id ?? '', roles: m.map((x) => x.role) }
}

// ------------------------------------------------------------ المشاركات
export type Status = 'pending' | 'in_progress' | 'resolved'
export type Desk = 'principal' | 'vice' | 'counselor' | 'attendance' | 'transport' | 'madrasati' | 'noor'
export interface Message {
  id: string; ref_no: number; source: 'voice' | 'contact'; kind: string; desk: Desk; topic: string; details: string | null
  sender_type: string | null; grade: string | null; preferred_days: string | null; preferred_time: string | null
  contact_method: string | null; contact_name: string | null; contact_phone: string | null
  status: Status; staff_note: string | null; created_at: string; updated_at: string
}
export const STATUS: Record<Status, string> = { pending: 'جديدة', in_progress: 'قيد المتابعة', resolved: 'تمّت' }
export const DESK: Record<Desk, string> = {
  principal: 'المديرة', vice: 'الوكيلة', counselor: 'الموجهة الطلابية', attendance: 'شؤون الحضور', transport: 'النقل',
  madrasati: 'منصة مدرستي', noor: 'نظام نور',
}
export const KIND: Record<string, string> = {
  idea: 'فكرة', note: 'ملاحظة', initiative: 'مبادرة', inquiry: 'استفسار', complaint: 'شكوى', suggestion: 'اقتراح',
  appointment: 'طلب موعد', callback: 'طلب اتصال', consultation: 'استشارة',
}
// only the columns the board shows, newest 150: one light request when the board opens or on «تحديث» (no polling, no realtime)
const MSG_COLS = 'id,ref_no,source,kind,desk,topic,details,sender_type,grade,preferred_days,preferred_time,contact_method,contact_name,contact_phone,status,staff_note,created_at,updated_at'
export const messages = () => rest<Message[]>(`public_messages?select=${MSG_COLS}&order=created_at.desc&limit=150`)
export const updateMessage = (id: string, patch: Partial<Pick<Message, 'status' | 'staff_note' | 'desk'>>) =>
  rest<Message[]>(`public_messages?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(patch) })

// ------------------------------------------------------------ الإعلانات
export interface Announcement { id: string; title: string; body: string; is_pinned: boolean; on_website: boolean; audience: string[] | null; created_at: string }
export const announcements = (school: string) =>
  rest<Announcement[]>(`announcements?select=id,title,body,is_pinned,on_website,audience,created_at&school_id=eq.${school}&order=is_pinned.desc,created_at.desc&limit=100`)
export const addAnnouncement = (school: string, a: Pick<Announcement, 'title' | 'body' | 'is_pinned' | 'on_website'>) =>
  rest<Announcement[]>('announcements', { method: 'POST', body: JSON.stringify({ ...a, school_id: school, audience: null, author_id: current?.userId }) })
export const editAnnouncement = (id: string, a: Partial<Pick<Announcement, 'title' | 'body' | 'is_pinned' | 'on_website'>>) =>
  rest<Announcement[]>(`announcements?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(a) })
export const removeAnnouncement = (id: string) => rest<void>(`announcements?id=eq.${id}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } })
