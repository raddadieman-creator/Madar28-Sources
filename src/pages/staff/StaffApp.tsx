import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, LogOut, Megaphone, Pin, Globe, Trash2, Pencil, Phone, MessageCircle, RefreshCw, Plus, X, CircleCheck } from '../../components/ui/hand'
import { MadarIcon, MadarName } from '../../components/brand/Madar'
import { RushdBot, type RushdMood } from '../../components/rushd/RushdBot'
import schoolLogo from '../../assets/logo.webp'
import {
  DESK, KIND, STATUS, addAnnouncement, announcements, editAnnouncement, me, messages, removeAnnouncement, session, signIn, signOut,
  updateMessage, type Announcement, type Desk, type Me, type Message, type Status,
} from '../../services/staffApi'

/**
 * «لوحة المدرسة» على /#/staff: بديلة تطبيق الفلاتر (2026-10-22) بنفس هوية مدار.
 * المشاركات (رسائل الموقع، كل منسوبة ترى مكتبها) والإعلانات (تُنشر في الموقع عند اختيار «تظهر في الموقع»).
 */
export default function StaffApp() {
  const [s, setS] = useState(session())
  const [who, setWho] = useState<Me | null>(null)
  const [tab, setTab] = useState<'inbox' | 'news'>('inbox')
  const [err, setErr] = useState('')
  // رُشد يلوّح عند فتح اللوحة أو تبديل القسم ثم يهدأ
  const [hello, setHello] = useState<RushdMood>('wave')
  useEffect(() => { setHello('wave'); const t = window.setTimeout(() => setHello('idle'), 3200); return () => window.clearTimeout(t) }, [tab])
  useEffect(() => {
    if (s) me().then(setWho).catch((e) => { setErr(e.message); signOut(); setS(null) })
  }, [s])
  if (!s) return <Login onDone={() => setS(session())} />
  return (
    <div dir="rtl" className="min-h-screen bg-cream text-ink-900">
      <header className="sticky top-0 z-30 border-b border-lav-100/70 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2"><MadarIcon size={34} /><MadarName size="sm" /></Link>
          <span className="rounded-full bg-lav-50 px-3 py-1 text-xs font-bold text-lav-700 ring-1 ring-lav-100">لوحة المدرسة</span>
          <button onClick={() => { signOut(); setS(null) }} className="ms-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-600 transition hover:bg-white hover:text-lav-700">
            <LogOut className="h-4 w-4" />خروج
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 pt-5">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-bl from-lav-800 via-lav-600 to-lav-500 px-6 py-6 text-white shadow-glow md:px-8">
          <div className="pointer-events-none absolute -start-20 -top-24 h-64 w-64 rounded-full bg-sage-300/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 end-24 h-64 w-64 rounded-full bg-lav-300/40 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white/75">{greeting()}</p>
              <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">{who?.name || 'أهلًا بكِ'}</h1>
              <p className="mt-2 text-sm leading-7 text-white/85">{tab === 'inbox' ? 'مشاركات الأهالي والطالبات من موقع مدار، كلٌّ في مكتبها.' : 'إعلانات المدرسة، وما تختارينه منها يظهر في موقع مدار.'}</p>
            </div>
            <div className="-mb-6 hidden shrink-0 sm:block"><RushdBot size={96} body mood={hello} /></div>
          </div>
          <nav className="relative mt-5 flex gap-2">
            <TabBtn on={tab === 'inbox'} onClick={() => setTab('inbox')} icon={<Inbox className="h-4 w-4" />}>المشاركات</TabBtn>
            <TabBtn on={tab === 'news'} onClick={() => setTab('news')} icon={<Megaphone className="h-4 w-4" />}>الإعلانات</TabBtn>
          </nav>
        </section>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-6">
        {err && <p className="mb-4 rounded-xl2 bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">{err}</p>}
        {tab === 'inbox' ? <InboxView /> : who && <NewsView school={who.schoolId} />}
      </main>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'صباح الخير' : h < 17 ? 'نهارك سعيد' : 'مساء الخير'
}

function TabBtn({ on, onClick, icon, children }: { on: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${on ? 'bg-white text-lav-800 shadow-lift' : 'bg-white/15 text-white ring-1 ring-white/25 hover:bg-white/25'}`}>
      {icon}{children}
    </button>
  )
}

// ------------------------------------------------------------ الدخول
function Login({ onDone }: { onDone: () => void }) {
  const [u, setU] = useState(''), [p, setP] = useState(''), [busy, setBusy] = useState(false), [err, setErr] = useState(''), [focus, setFocus] = useState(false)
  async function go(e: FormEvent) {
    e.preventDefault()
    setBusy(true); setErr('')
    try { await signIn(u, p); onDone() } catch (x) { setErr(x instanceof Error ? x.message : 'تعذّر الدخول') } finally { setBusy(false) }
  }
  const face: RushdMood = busy ? 'think' : err ? 'sorry' : focus ? 'happy' : 'wave'
  return (
    <div dir="rtl" className="min-h-screen bg-cream lg:grid lg:grid-cols-2">
      <section className="relative overflow-hidden bg-gradient-to-bl from-lav-800 via-lav-600 to-lav-500 px-6 pb-24 pt-10 text-white lg:flex lg:flex-col lg:items-center lg:justify-center lg:pb-10">
        <div className="pointer-events-none absolute -start-24 -top-24 h-72 w-72 rounded-full bg-sage-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 end-10 h-80 w-80 rounded-full bg-lav-300/40 blur-3xl" />
        <svg viewBox="0 0 400 400" className="pointer-events-none absolute -end-24 -top-20 h-[26rem] w-[26rem] opacity-25" aria-hidden="true">
          <circle cx="200" cy="200" r="150" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 10" />
          <circle cx="200" cy="200" r="110" fill="none" stroke="#fff" strokeWidth="1" />
        </svg>
        <div className="relative mx-auto flex max-w-sm flex-col items-center text-center">
          <div className="arch-top w-32 overflow-hidden bg-cream p-3 shadow-lift ring-4 ring-white/25 lg:w-44">
            <img src={schoolLogo} alt="شعار المدرسة" width={512} height={512} className="aspect-square w-full object-contain" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-white lg:text-4xl">لوحة المدرسة</h1>
          <p className="mt-3 text-[15px] leading-8 text-white/85">مشاركات الأهالي وإعلانات المدرسة في مكان واحد.</p>
        </div>
      </section>
      <div className="relative -mt-14 px-4 pb-10 lg:mt-0 lg:flex lg:items-center lg:justify-center">
        <form onSubmit={go} className="relative mx-auto w-full max-w-sm rounded-[2rem] bg-white p-7 pt-20 shadow-xl ring-1 ring-lav-100 lg:pt-7">
          <div className="absolute -top-14 start-1/2 translate-x-1/2 lg:static lg:mb-2 lg:flex lg:translate-x-0 lg:justify-center"><RushdBot size={92} body mood={face} /></div>
          <div className="mb-5 text-center">
            <h2 className="text-xl font-extrabold text-ink-900">أهلًا بكِ</h2>
            <p className="mt-1 text-sm text-ink-500">ادخلي باسم المستخدم وكلمة المرور نفسها</p>
          </div>
          <label className="mb-3 block text-sm font-bold text-ink-700">اسم المستخدم
            <input value={u} onChange={(e) => setU(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} autoComplete="username" required dir="ltr"
              className="mt-1.5 w-full rounded-xl2 border-0 bg-lav-25 px-4 py-3 text-ink-900 ring-1 ring-lav-100 transition focus:bg-white focus:ring-2 focus:ring-lav-400" />
          </label>
          <label className="mb-5 block text-sm font-bold text-ink-700">كلمة المرور
            <input type="password" value={p} onChange={(e) => setP(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} autoComplete="current-password" required dir="ltr"
              className="mt-1.5 w-full rounded-xl2 border-0 bg-lav-25 px-4 py-3 text-ink-900 ring-1 ring-lav-100 transition focus:bg-white focus:ring-2 focus:ring-lav-400" />
          </label>
          {err && <p className="bubble-in mb-4 rounded-xl2 bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200">{err}</p>}
          <button disabled={busy} className="w-full rounded-full bg-gradient-to-l from-lav-700 to-lav-500 py-3 font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60">
            {busy ? 'جارٍ الدخول…' : 'دخول'}
          </button>
          <Link to="/" className="mt-4 block text-center text-sm text-ink-500 hover:text-lav-700">العودة للموقع</Link>
        </form>
      </div>
    </div>
  )
}

// ------------------------------------------------------------ المشاركات
const STATUS_TONE: Record<Status, string> = { pending: 'bg-lav-100 text-lav-800', in_progress: 'bg-gold-100 text-gold-700', resolved: 'bg-sage-100 text-sage-700' }
const dateAr = (iso: string) => new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

function InboxView() {
  const [rows, setRows] = useState<Message[] | null>(null), [err, setErr] = useState('')
  const [st, setSt] = useState<Status | 'all'>('pending'), [desk, setDesk] = useState<Desk | 'all'>('all'), [open, setOpen] = useState<Message | null>(null)
  const load = () => { setErr(''); messages().then(setRows).catch((e) => setErr(e.message)) }
  useEffect(load, [])
  const shown = useMemo(() => (rows ?? []).filter((m) => (st === 'all' || m.status === st) && (desk === 'all' || m.desk === desk)), [rows, st, desk])
  const desks = useMemo(() => [...new Set((rows ?? []).map((m) => m.desk))], [rows])
  const count = (s: Status) => (rows ?? []).filter((m) => m.status === s).length
  return (
    <section>
      {/* بطاقات الأرقام: تُظهر العدد وتعمل فلترًا */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {(['pending', 'in_progress', 'resolved'] as const).map((k) => {
          const Ic = k === 'pending' ? Inbox : k === 'in_progress' ? RefreshCw : CircleCheck
          return (
            <button key={k} onClick={() => setSt(st === k ? 'all' : k)}
              className={`lift rounded-xl2 p-3 text-start ring-1 transition sm:p-4 ${st === k ? 'bg-white shadow-lift ring-lav-300' : 'bg-white/70 ring-lav-100 hover:bg-white'}`}>
              <span className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${STATUS_TONE[k]}`}><Ic className="h-5 w-5" /></span>
              <span className="block text-2xl font-extrabold text-ink-900">{rows ? count(k) : '…'}</span>
              <span className="block text-xs font-bold text-ink-500">{STATUS[k]}</span>
            </button>
          )
        })}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setSt('all')} className={`rounded-full px-3 py-1.5 text-sm font-bold ${st === 'all' ? 'bg-lav-600 text-white' : 'bg-white text-ink-700 ring-1 ring-lav-100'}`}>الكل</button>
        {desks.length > 1 && (
          <select value={desk} onChange={(e) => setDesk(e.target.value as Desk | 'all')} className="rounded-full border-0 bg-white px-3 py-1.5 text-sm ring-1 ring-ink-200">
            <option value="all">كل المكاتب</option>
            {desks.map((d) => <option key={d} value={d}>{DESK[d]}</option>)}
          </select>
        )}
        <button onClick={load} className="ms-auto flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-ink-600 hover:bg-white" aria-label="تحديث"><RefreshCw className="h-4 w-4" />تحديث</button>
      </div>
      {err && <p className="rounded-xl2 bg-rose-50 p-3 text-sm text-rose-700">{err}</p>}
      {!rows && !err && <div className="space-y-3">{[0, 1, 2].map((k) => <div key={k} className="h-24 animate-pulse rounded-xl2 bg-white/70" />)}</div>}
      {rows && shown.length === 0 && <div className="flex flex-col items-center rounded-[2rem] bg-white p-8 text-center ring-1 ring-lav-100"><RushdBot size={84} body mood="happy" /><p className="mt-3 font-bold text-ink-800">لا توجد مشاركات هنا</p><p className="text-sm text-ink-500">كل شيء مُنجز، أحسنتِ</p></div>}
      <ul className="space-y-3">
        {shown.map((m) => (
          <li key={m.id}>
            <button onClick={() => setOpen(m)} className="w-full rounded-xl2 bg-white p-4 text-start shadow-sm ring-1 ring-ink-200/60 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                <span className={`rounded-full px-2.5 py-0.5 font-medium ${STATUS_TONE[m.status]}`}>{STATUS[m.status]}</span>
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-ink-600">{KIND[m.kind] ?? m.kind}</span>
                <span className="text-ink-500">{DESK[m.desk]}</span>
                <span className="ms-auto text-ink-400">#{m.ref_no} · {dateAr(m.created_at)}</span>
              </div>
              <p className="font-bold text-ink-900">{m.topic}</p>
              {m.details && <p className="mt-1 line-clamp-2 text-sm text-ink-600">{m.details}</p>}
            </button>
          </li>
        ))}
      </ul>
      {open && <MessageSheet m={open} onClose={() => setOpen(null)} onSaved={(n) => { setRows((r) => r?.map((x) => (x.id === n.id ? n : x)) ?? null); setOpen(n) }} />}
    </section>
  )
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div dir="rtl" onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem]">
        <div className="mb-4 flex items-start gap-3"><h2 className="text-lg font-bold text-ink-900">{title}</h2>
          <button onClick={onClose} className="ms-auto rounded-full p-1.5 text-ink-500 hover:bg-cream" aria-label="إغلاق"><X className="h-5 w-5" /></button></div>
        {children}
      </div>
    </div>
  )
}

function MessageSheet({ m, onClose, onSaved }: { m: Message; onClose: () => void; onSaved: (m: Message) => void }) {
  const [note, setNote] = useState(m.staff_note ?? ''), [busy, setBusy] = useState(false), [err, setErr] = useState('')
  async function save(patch: Parameters<typeof updateMessage>[1]) {
    setBusy(true); setErr('')
    try { const [n] = await updateMessage(m.id, patch); if (n) onSaved(n); else onClose() } catch (e) { setErr(e instanceof Error ? e.message : 'تعذّر الحفظ') } finally { setBusy(false) }
  }
  const rows: [string, string | null][] = [
    ['النوع', KIND[m.kind] ?? m.kind], ['المرسِل', m.sender_type], ['الصف', m.grade], ['الأيام المناسبة', m.preferred_days], ['الوقت المفضل', m.preferred_time],
    ['الاسم', m.contact_name], ['طريقة التواصل', m.contact_method],
  ]
  const wa = m.contact_phone ? `https://wa.me/${m.contact_phone.replace(/^0/, '966').replace(/^\+/, '')}` : ''
  return (
    <Sheet title={m.topic} onClose={onClose}>
      <p className="mb-3 text-xs text-ink-400">#{m.ref_no} · {dateAr(m.created_at)} · {DESK[m.desk]}</p>
      {m.details && <p className="mb-4 whitespace-pre-wrap rounded-xl2 bg-cream p-4 leading-8 text-ink-800">{m.details}</p>}
      <dl className="mb-4 grid grid-cols-2 gap-2 text-sm">
        {rows.filter(([, v]) => v).map(([k, v]) => <div key={k} className="rounded-xl bg-lav-25 p-2.5 ring-1 ring-lav-100"><dt className="text-xs text-ink-500">{k}</dt><dd className="font-medium">{v}</dd></div>)}
      </dl>
      {m.contact_phone && (
        <div className="mb-4 flex gap-2">
          <a href={`tel:${m.contact_phone}`} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-800 py-2.5 text-sm font-bold text-white"><Phone className="h-4 w-4" />اتصال</a>
          <a href={wa} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sage-600 py-2.5 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" />واتساب</a>
        </div>
      )}
      <p className="mb-2 text-sm font-medium text-ink-700">الحالة</p>
      <div className="mb-4 flex gap-2">
        {(Object.keys(STATUS) as Status[]).map((k) => (
          <button key={k} disabled={busy} onClick={() => save({ status: k })} className={`flex-1 rounded-full py-2 text-sm font-medium ${m.status === k ? STATUS_TONE[k] + ' ring-2 ring-current' : 'bg-white ring-1 ring-ink-200'}`}>{STATUS[k]}</button>
        ))}
      </div>
      <label className="mb-4 block text-sm font-medium text-ink-700">ملاحظة داخلية
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={2000} className="mt-1 w-full rounded-xl2 border-0 bg-cream p-3 ring-1 ring-ink-200 focus:ring-2 focus:ring-lav-400" />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button disabled={busy || note === (m.staff_note ?? '')} onClick={() => save({ staff_note: note })} className="rounded-full bg-lav-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">حفظ الملاحظة</button>
        <select disabled={busy} value="" onChange={(e) => e.target.value && save({ desk: e.target.value as Desk })} className="ms-auto rounded-full border-0 bg-white px-3 py-2 text-sm ring-1 ring-ink-200">
          <option value="">تحويل إلى…</option>
          {(Object.keys(DESK) as Desk[]).filter((d) => d !== m.desk).map((d) => <option key={d} value={d}>{DESK[d]}</option>)}
        </select>
      </div>
      {err && <p className="mt-3 rounded-xl2 bg-rose-50 p-3 text-sm text-rose-700">{err}</p>}
    </Sheet>
  )
}

// ------------------------------------------------------------ الإعلانات
function NewsView({ school }: { school: string }) {
  const [rows, setRows] = useState<Announcement[] | null>(null), [err, setErr] = useState(''), [edit, setEdit] = useState<Announcement | 'new' | null>(null)
  const load = () => { setErr(''); announcements(school).then(setRows).catch((e) => setErr(e.message)) }
  useEffect(load, [school])
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <p className="text-sm text-ink-600">الإعلانات المختارة لـ«الموقع» تظهر في الصفحة الرئيسية لموقع مدار.</p>
        <button onClick={() => setEdit('new')} className="ms-auto flex items-center gap-1 rounded-full bg-lav-600 px-4 py-2 text-sm font-bold text-white shadow-sm"><Plus className="h-4 w-4" />إعلان جديد</button>
      </div>
      {err && <p className="rounded-xl2 bg-rose-50 p-3 text-sm text-rose-700">{err}</p>}
      {!rows && !err && <div className="space-y-3">{[0, 1].map((k) => <div key={k} className="h-20 animate-pulse rounded-xl2 bg-white/70" />)}</div>}
      <ul className="space-y-3">
        {rows?.map((a) => (
          <li key={a.id} className="rounded-xl2 bg-white p-4 shadow-sm ring-1 ring-ink-200/60">
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
              {a.is_pinned && <span className="flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-0.5 text-gold-700"><Pin className="h-3 w-3" />مثبّت</span>}
              {a.on_website && <span className="flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-0.5 text-sage-700"><Globe className="h-3 w-3" />في الموقع</span>}
              {a.audience && <span className="rounded-full bg-cream px-2.5 py-0.5 text-ink-500">لفئة محددة</span>}
              <span className="ms-auto text-ink-400">{dateAr(a.created_at)}</span>
            </div>
            <p className="font-bold">{a.title}</p>
            {a.body && <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-ink-600">{a.body}</p>}
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEdit(a)} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-ink-700 ring-1 ring-ink-200 hover:bg-cream"><Pencil className="h-3.5 w-3.5" />تعديل</button>
              <button onClick={async () => { if (confirm('حذف هذا الإعلان؟')) { try { await removeAnnouncement(a.id); load() } catch (e) { setErr(e instanceof Error ? e.message : 'تعذّر الحذف') } } }}
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" />حذف</button>
            </div>
          </li>
        ))}
      </ul>
      {edit && <NewsSheet a={edit === 'new' ? null : edit} school={school} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load() }} />}
    </section>
  )
}

function NewsSheet({ a, school, onClose, onSaved }: { a: Announcement | null; school: string; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(a?.title ?? ''), [body, setBody] = useState(a?.body ?? '')
  const [pin, setPin] = useState(a?.is_pinned ?? false), [web, setWeb] = useState(a?.on_website ?? false), [busy, setBusy] = useState(false), [err, setErr] = useState('')
  const webLocked = !!a?.audience // a role-targeted announcement can't go public (database rule)
  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr('')
    const v = { title: title.trim(), body: body.trim(), is_pinned: pin, on_website: web && !webLocked }
    try { if (a) await editAnnouncement(a.id, v); else await addAnnouncement(school, v); onSaved() } catch (x) { setErr(x instanceof Error ? x.message : 'تعذّر الحفظ') } finally { setBusy(false) }
  }
  return (
    <Sheet title={a ? 'تعديل الإعلان' : 'إعلان جديد'} onClose={onClose}>
      <form onSubmit={save}>
        <label className="mb-3 block text-sm font-medium text-ink-700">العنوان
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} className="mt-1 w-full rounded-xl2 border-0 bg-cream px-4 py-3 ring-1 ring-ink-200 focus:ring-2 focus:ring-lav-400" />
        </label>
        <label className="mb-4 block text-sm font-medium text-ink-700">النص
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="mt-1 w-full rounded-xl2 border-0 bg-cream p-3 ring-1 ring-ink-200 focus:ring-2 focus:ring-lav-400" />
        </label>
        <div className="mb-5 space-y-2">
          <Toggle on={pin} set={setPin} label="تثبيت في الأعلى" />
          <Toggle on={web && !webLocked} set={setWeb} label={webLocked ? 'إعلان لفئة محددة: لا يظهر في الموقع' : 'يظهر في موقع مدار'} disabled={webLocked} />
        </div>
        {err && <p className="mb-3 rounded-xl2 bg-rose-50 p-3 text-sm text-rose-700">{err}</p>}
        <button disabled={busy} className="w-full rounded-full bg-lav-600 py-3 font-bold text-white disabled:opacity-60">{busy ? 'جارٍ الحفظ…' : 'حفظ'}</button>
      </form>
    </Sheet>
  )
}

function Toggle({ on, set, label, disabled }: { on: boolean; set: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={() => set(!on)} className="flex w-full items-center justify-between rounded-xl2 bg-cream px-4 py-3 text-sm ring-1 ring-ink-200 disabled:opacity-60">
      <span>{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-sage-500' : 'bg-ink-200'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'start-[1.375rem]' : 'start-0.5'}`} /></span>
    </button>
  )
}
