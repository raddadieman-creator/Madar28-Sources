import { AlertTriangle, CalendarClock, Check, Copy, MessageCircle, Send } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { whatsappHref } from '../lib/phone'
import { detectSensitive, sensitiveLabel } from '../lib/privacy'
import type { Contact } from '../types/content'

/**
 * مركز التواصل: تجهيز رسالة واتساب جاهزة بحسب نوع الطلب.
 *
 * - لا يُحفظ شيء ولا يُرسل شيء من المنصة نفسها؛ المنصة تُجهّز النص فقط،
 *   ثم يراجعه المستخدم ويرسله بنفسه من واتساب.
 * - لا رقم متابعة ولا حجز مواعيد: هذا يحتاج قاعدة بيانات وخادمًا، وغير متوفر
 *   على GitHub Pages. «طلب الموعد» طلب يُرسل للمسؤولة، والتأكيد يأتي منها.
 * - يُمنع إدخال أرقام الهوية والجوال والبريد في الرسالة.
 */

type Kind = 'inquiry' | 'note' | 'complaint' | 'suggestion' | 'appointment' | 'callback'

const KINDS: { id: Kind; label: string; hint: string; defaultTo: string; allowed?: string[] }[] = [
  { id: 'inquiry', label: 'استفسار', hint: 'سؤال عن إجراء أو خدمة', defaultTo: 'vice' },
  { id: 'note', label: 'ملاحظة', hint: 'ملاحظة على موقف أو خدمة', defaultTo: 'vice' },
  { id: 'complaint', label: 'شكوى', hint: 'تُوجَّه أولًا للمسؤولة المختصة، ثم للمديرة إن لم تُحل', defaultTo: 'principal' },
  { id: 'suggestion', label: 'اقتراح', hint: 'فكرة لتطوير المدرسة', defaultTo: 'principal' },
  { id: 'appointment', label: 'طلب موعد', hint: 'مع المديرة أو الوكيلة أو الموجهة', defaultTo: 'vice', allowed: ['principal', 'vice', 'counselor'] },
  { id: 'callback', label: 'طلب التواصل', hint: 'أن تتواصل المسؤولة معك', defaultTo: 'vice' },
]

const GRADES = ['', 'الأول المتوسط', 'الثاني المتوسط', 'الثالث المتوسط']
const SENDERS = ['ولي أمر', 'طالبة', 'معلمة', 'إدارية', 'أخرى']
const TIMES = ['', 'بداية الدوام', 'منتصف الدوام', 'نهاية الدوام']

export function ContactComposer({
  contacts,
  initialTo,
  initialTopic,
  initialKind,
  initialSender,
}: {
  contacts: Contact[]
  initialTo?: string
  initialTopic?: string
  initialKind?: string
  initialSender?: string
}) {
  const reachable = contacts.filter((c) => c.phone && c.whatsapp)
  const [kind, setKind] = useState<Kind>(KINDS.some((x) => x.id === initialKind) ? (initialKind as Kind) : 'inquiry')
  const k = KINDS.find((x) => x.id === kind)!
  const options = reachable.filter((c) => !k.allowed || k.allowed.includes(c.id))
  const [to, setTo] = useState(initialTo && reachable.some((c) => c.id === initialTo) ? initialTo : k.defaultTo)
  const [sender, setSender] = useState(initialSender && SENDERS.includes(initialSender) ? initialSender : SENDERS[0])
  const [grade, setGrade] = useState('')
  const [topic, setTopic] = useState(initialTopic ?? '')
  const [body, setBody] = useState('')
  const [days, setDays] = useState('')
  const [time, setTime] = useState('')
  const [method, setMethod] = useState('اتصال')
  const [review, setReview] = useState(false)
  const [copied, setCopied] = useState(false)

  // عند تغيير النوع: إن كانت المسؤولة المختارة خارج المسموح، نعود للافتراضي
  useEffect(() => {
    if (k.allowed && !k.allowed.includes(to)) setTo(k.defaultTo)
    setReview(false)
  }, [kind]) // eslint-disable-line react-hooks/exhaustive-deps

  // الوصول من رابط خارجي (مثل «طلب موعد» في الرئيسية) يمرّر إلى النموذج
  useEffect(() => {
    if (initialKind && KINDS.some((x) => x.id === initialKind)) {
      setKind(initialKind as Kind)
      document.getElementById('composer-title')?.scrollIntoView({ block: 'start' })
    }
  }, [initialKind])

  const target = reachable.find((c) => c.id === to)
  const sensitive = useMemo(() => detectSensitive(`${topic} ${body} ${days}`), [topic, body, days])
  const needsBody = kind !== 'appointment' && kind !== 'callback'
  const ready = Boolean(target && topic.trim() && (!needsBody || body.trim()) && !sensitive.length)

  const text = useMemo(() => {
    const lines = [
      'السلام عليكم ورحمة الله وبركاته',
      `${target ? `${target.role}${target.name ? ` أ. ${target.name}` : ''}` : ''}`,
      '',
      `نوع الطلب: ${k.label}`,
      `الموضوع: ${topic.trim()}`,
      `المرسل: ${sender}${grade ? ` — طالبة في الصف ${grade}` : ''}`,
    ]
    if (kind === 'appointment') {
      if (days.trim()) lines.push(`الأيام المناسبة: ${days.trim()}`)
      if (time) lines.push(`الوقت المفضل: ${time}`)
    }
    if (kind === 'callback') {
      lines.push(`طريقة التواصل المفضلة: ${method}`)
      if (time) lines.push(`الوقت المفضل: ${time}`)
    }
    if (body.trim()) lines.push('', body.trim())
    lines.push('', '— أُرسلت عبر منصة مدار 28')
    return lines.filter((l, i) => !(i === 1 && !l)).join('\n')
  }, [target, k, topic, sender, grade, kind, days, time, method, body])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* غير مسموح في هذا المتصفح */
    }
  }

  if (!reachable.length) return null

  return (
    <section aria-labelledby="composer-title" className="scroll-mt-24 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-lav-100 md:p-6">
      <h2 id="composer-title" className="flex items-center gap-2 text-lg font-extrabold">
        <Send className="h-5 w-5 text-lav-600" aria-hidden="true" />
        إرسال طلب للمدرسة
      </h2>
      <p className="mt-1 text-sm text-ink-500">تُجهَّز الرسالة هنا، ثم تُراجع وتُرسل من واتساب إلى المسؤولة مباشرة.</p>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-semibold text-ink-700">نوع الطلب</legend>
        <div className="flex flex-wrap gap-2">
          {KINDS.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setKind(x.id)}
              aria-pressed={kind === x.id}
              className={`chip ${kind === x.id ? 'border-lav-500 bg-lav-50 font-semibold text-lav-800' : ''}`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-500">{k.hint}</p>
      </fieldset>

      {!review ? (
        <form
          className="mt-5 grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (ready) setReview(true)
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-700">إلى</span>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="field py-2.5">
              {options.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.role}
                  {c.name ? ` — ${c.name}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-700">الموضوع</span>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={80} className="field py-2.5" placeholder="مثل: غياب يوم الأحد" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-700">المرسل</span>
            <select value={sender} onChange={(e) => setSender(e.target.value)} className="field py-2.5">
              {SENDERS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-700">الصف (اختياري)</span>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className="field py-2.5">
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g || '—'}
                </option>
              ))}
            </select>
          </label>

          {kind === 'appointment' && (
            <>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-700">الأيام المناسبة</span>
                <input value={days} onChange={(e) => setDays(e.target.value)} maxLength={60} className="field py-2.5" placeholder="مثل: الإثنين أو الأربعاء" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-700">الوقت المفضل</span>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="field py-2.5">
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t || '—'}
                    </option>
                  ))}
                </select>
              </label>
              <p className="flex gap-2 rounded-xl bg-lav-25 px-3 py-2 text-xs leading-5 text-lav-800 md:col-span-2">
                <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
                هذا طلب موعد وليس حجزًا؛ يُعتمد الموعد بعد تأكيده من المسؤولة.
              </p>
            </>
          )}

          {kind === 'callback' && (
            <>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-700">طريقة التواصل المفضلة</span>
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="field py-2.5">
                  <option>اتصال</option>
                  <option>رسالة واتساب</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-700">الوقت المفضل</span>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="field py-2.5">
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t || '—'}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-ink-700">التفاصيل{needsBody ? '' : ' (اختياري)'}</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={600} className="field resize-y py-2.5 leading-7" required={needsBody} />
            <span className="mt-1 block text-xs text-ink-400">بلا أرقام هوية أو جوال أو تفاصيل صحية؛ تُستكمل البيانات مع المسؤولة مباشرة.</span>
          </label>

          {sensitive.length > 0 && (
            <p role="alert" className="flex gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200 md:col-span-2">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              الرسالة تحتوي {sensitive.map((s) => sensitiveLabel[s]).join(' و')}. احذفوه قبل المتابعة.
            </p>
          )}

          <div className="md:col-span-2">
            <button type="submit" disabled={!ready} className="btn-primary px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50">
              مراجعة الرسالة
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-ink-700">مراجعة الرسالة قبل الإرسال</p>
          <pre className="whitespace-pre-wrap rounded-2xl bg-lav-25 p-4 font-sans text-[15px] leading-7 text-ink-800 ring-1 ring-lav-100">{text}</pre>
          <div className="mt-4 flex flex-wrap gap-2">
            {target?.phone && (
              <a href={`${whatsappHref(target.phone)}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className="btn bg-sage-500 text-white hover:bg-sage-600">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                فتح واتساب بالرسالة
              </a>
            )}
            <button type="button" onClick={copy} className="btn-ghost">
              {copied ? <Check className="h-4 w-4 text-sage-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? 'نُسخت' : 'نسخ النص'}
            </button>
            <button type="button" onClick={() => setReview(false)} className="btn-ghost">
              تعديل
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-ink-500">
            الرسالة لا تُحفظ في المنصة ولا يصدر لها رقم متابعة؛ المتابعة تكون في محادثة واتساب نفسها.
          </p>
        </div>
      )}
    </section>
  )
}
