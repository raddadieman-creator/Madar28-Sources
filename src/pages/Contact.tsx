import { Check, Copy, ExternalLink, Lock, MessageCircle, Phone, Search, Send, UsersRound, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ContactCard } from '../components/ContactCard'
import { ContactComposer } from '../components/ContactComposer'
import { officialLinks, telegramGroup, whatsappGroups } from '../data/links'
import { Notice, PageHeader, Skeleton } from '../components/ui/primitives'
import { NUMBERS_APPROVED } from '../data/contact-phones'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { normalizeArabic, tokenize, tokensMatch } from '../lib/arabic'
import { content } from '../services/contentService'
import type { Contact as ContactT } from '../types/content'
import { directoryText, downloadVCard } from '../lib/vcard'

const QUICK_TOPICS = ['غياب', 'نقل', 'مدرستي', 'تنمر', 'استئذان', 'اختبارات']

/** يطابق الاسم والمسمى والاختصاص وكلمات الموضوع، مع توحيد الهمزات والتاء المربوطة */
function matches(c: ContactT, q: string): boolean {
  const query = normalizeArabic(q)
  if (!query) return true
  const hay = normalizeArabic(`${c.name ?? ''} ${c.role} ${c.responsibility} ${c.topics.join(' ')}`)
  if (hay.includes(query)) return true
  const qt = tokenize(q)
  if (!qt.length) return false
  const ht = tokenize(`${c.name ?? ''} ${c.role} ${c.responsibility} ${c.topics.join(' ')}`)
  return qt.every((t) => ht.some((h) => tokensMatch(t, h) > 0))
}

export default function Contact() {
  useTitle('مركز التواصل')
  const { data: contacts } = useContent(content.contacts)
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [copied, setCopied] = useState(false)
  const siteUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''

  const filtered = useMemo(() => contacts?.filter((c) => matches(c, q)), [contacts, q])
  const anyPhone = contacts?.some((c) => c.phone)
  const devPreview = contacts?.some((c) => c.phoneUnpublished)

  function update(v: string) {
    setQ(v)
    const p = new URLSearchParams(params)
    if (v.trim()) p.set('q', v)
    else p.delete('q')
    setParams(p, { replace: true })
  }

  return (
    <>
      <PageHeader title="مركز التواصل" intro="طلب أو استفسار أو موعد يصل إلى المسؤولة المختصة مباشرة." icon={<Phone className="h-6 w-6" />} />

      {contacts && (
        <div className="mb-10">
          <ContactComposer contacts={contacts} initialTo={params.get('to') ?? undefined} initialTopic={params.get('topic') ?? undefined} initialKind={params.get('kind') ?? undefined} />
        </div>
      )}

      <h2 id="directory" className="mb-4 scroll-mt-24 text-lg font-extrabold">
        دليل المسؤولات
      </h2>

      {/* البحث داخل الدليل */}
      <section aria-label="البحث في دليل التواصل" className="mb-8">
        <div className="relative max-w-2xl">
          <label htmlFor="contact-search" className="sr-only">
            البحث بالاسم أو المسمى أو الموضوع
          </label>
          <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-lav-500" aria-hidden="true" />
          <input
            id="contact-search"
            type="search"
            value={q}
            onChange={(e) => update(e.target.value)}
            placeholder="البحث بالاسم أو الموضوع"
            className="field py-3.5 pe-11 ps-12 text-base shadow-soft [&::-webkit-search-cancel-button]:hidden"
            autoComplete="off"
          />
          {q && (
            <button type="button" onClick={() => update('')} className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 hover:text-ink-700" aria-label="مسح البحث">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-500">مواضيع شائعة:</span>
          {QUICK_TOPICS.map((t) => (
            <button key={t} type="button" onClick={() => update(t)} className={`chip ${q === t ? 'border-lav-500 bg-lav-50 font-medium text-lav-800' : ''}`} aria-pressed={q === t}>
              {t}
            </button>
          ))}
        </div>
      </section>

      {anyPhone && contacts && (
        <section aria-label="مشاركة الدليل" className="mb-8 flex flex-col gap-3 rounded-2xl bg-sage-50 p-4 ring-1 ring-sage-100 md:flex-row md:items-center">
          <p className="flex-1 text-sm text-ink-700">
            <span className="block font-semibold text-ink-900">أرقام المدرسة في جوالك</span>
            حفظ جميع الأرقام في جهات الاتصال بخطوة واحدة، أو إرسال الدليل كاملًا عبر واتساب.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => downloadVCard(contacts, 'madar28-contacts.vcf')} className="btn-primary">
              <UsersRound className="h-4 w-4" aria-hidden="true" />
              حفظ جميع الأرقام
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(directoryText(contacts, siteUrl))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-sage-700 ring-1 ring-sage-200 hover:bg-sage-100"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              إرسال عبر واتساب
            </a>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(directoryText(contacts, siteUrl))
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                } catch {
                  /* النسخ غير مسموح في هذا المتصفح */
                }
              }}
              className="btn-ghost"
            >
              {copied ? <Check className="h-4 w-4 text-sage-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? 'نُسخ الدليل' : 'نسخ الدليل'}
            </button>
          </div>
        </section>
      )}

      {devPreview && (
        <div className="mb-6">
          <Notice>
            معاينة داخلية على جهازك: الأرقام ظاهرة لك للمراجعة فقط. النسخة المنشورة تحذفها حتى تُعتمد من الإدارة وتُسجَّل موافقة كل مسؤولة (انظري README).
          </Notice>
        </div>
      )}
      {contacts && !anyPhone && !NUMBERS_APPROVED && (
        <p className="mb-6 flex items-center gap-2 text-sm text-ink-500">
          <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
          أرقام المسؤولات تُعرض بعد اعتمادها من إدارة المدرسة.
        </p>
      )}

      {!filtered ? (
        <Skeleton className="h-96" />
      ) : filtered.length ? (
        <>
          <p className="mb-3 text-sm text-ink-500" role="status">
            {q.trim() ? `${filtered.length} من ${contacts!.length} نتائج عن «${q.trim()}»` : `${contacts!.length} مسؤولات`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <ContactCard key={c.id} c={c} highlight={q} />
            ))}
          </div>
        </>
      ) : (
        <div role="status" className="rounded-2xl border border-dashed border-lav-200 bg-white/60 px-6 py-10 text-center">
          <p className="font-medium text-ink-800">لم نجد مسؤولة مرتبطة بـ«{q.trim()}»</p>
          <p className="mt-1 text-sm text-ink-500">كلمة أخرى قد تفيد، ومديرة المدرسة توجّه إلى المسؤولة المناسبة.</p>
          <button type="button" onClick={() => update('')} className="btn-soft mt-4">
            عرض الدليل كاملًا
          </button>
        </div>
      )}

      <section aria-labelledby="channels" className="mt-12">
        <h2 id="channels" className="mb-4 text-lg font-extrabold">
          القنوات والمنصات الرسمية
        </h2>
        <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-l from-lav-100 to-sage-50 p-5 ring-1 ring-lav-100 md:flex-row md:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#229ED9] text-white">
            <Send className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1">
            <span className="block font-bold text-ink-900">{telegramGroup.name}</span>
            <span className="block text-sm text-ink-600">على تيليجرام: تنبيهات وبرامج التوجيه الطلابي.</span>
          </p>
          <a href={telegramGroup.url} target="_blank" rel="noopener noreferrer" className="btn-primary px-5 py-2.5">
            {telegramGroup.action}
          </a>
        </div>
        <div className="mt-3 rounded-3xl bg-white p-5 ring-1 ring-lav-100">
          <p className="flex items-center gap-2 font-bold text-ink-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366] text-white">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </span>
            مجموعات الصفوف على واتساب
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {whatsappGroups.map((g) => (
              <li key={g.url}>
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl bg-lav-50/60 px-4 py-3 font-semibold text-ink-900 ring-1 ring-lav-100 transition-colors hover:bg-white hover:ring-[#25D366]/50"
                >
                  {g.grade}
                  <ExternalLink className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {Object.values(officialLinks).map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex h-full items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-lav-100 transition-colors hover:ring-lav-300">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-ink-900">{l.label}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-ink-500">{l.note}</span>
                </span>
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-ink-300" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
