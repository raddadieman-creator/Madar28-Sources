import { Check, Copy, ExternalLink, Lock, MessageCircle, Phone, UserRoundPlus } from 'lucide-react'
import { downloadVCard } from '../lib/vcard'
import { useState } from 'react'
import { formatLocal, telHref, whatsappHref } from '../lib/phone'
import type { Contact } from '../types/content'
import { Icon } from './ui/Icon'

/**
 * بطاقة مسؤولة في دليل التواصل.
 * ثلاث حالات: رقم منشور (اتصال + واتساب + نسخ)، رقم بانتظار الاعتماد، خانة تُضاف لاحقًا.
 * لا صور شخصية، ولا أوقات تواصل إلا إذا أُضيفت معتمدة في البيانات.
 */
export function ContactCard({ c, highlight }: { c: Contact; highlight?: string }) {
  const [copied, setCopied] = useState(false)
  const pendingSlot = !c.name

  async function copy() {
    if (!c.phone) return
    try {
      await navigator.clipboard.writeText(c.phone)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* المتصفح لم يسمح بالنسخ؛ الرقم ظاهر ويمكن تحديده يدويًا */
    }
  }

  return (
    <article
      id={c.id}
      aria-labelledby={`${c.id}-name`}
      className={`flex scroll-mt-28 flex-col rounded-2xl p-5 ${
        pendingSlot ? 'border border-dashed border-lav-200 bg-white/60' : 'bg-white shadow-soft ring-1 ring-lav-100'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            pendingSlot ? 'bg-lav-25 text-lav-400' : 'bg-lav-50 text-lav-700'
          }`}
        >
          <Icon name={c.icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-medium text-lav-700">{c.role}</p>
          <h3 id={`${c.id}-name`} className="mt-0.5 text-lg font-semibold leading-snug text-ink-900">
            {pendingSlot ? <span className="text-base font-medium text-ink-400">تُضاف بيانات المسؤولة لاحقًا</span> : <Mark text={c.name!} q={highlight} />}
          </h3>
        </div>
      </div>

      <p className="mt-3 text-sm leading-7 text-ink-600">{c.responsibility}</p>
      {c.hours && <p className="mt-1 text-xs text-ink-500">أوقات التواصل: {c.hours}</p>}

      <div className="mt-auto pt-4">
        {c.phone ? (
          <>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-lav-25 px-3 py-2">
              <span className="font-medium tabular-nums tracking-wide text-ink-900" dir="ltr">
                {formatLocal(c.phone)}
              </span>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-ink-500 hover:bg-white hover:text-lav-700"
                aria-label={`نسخ رقم ${c.role}`}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-sage-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'نُسخ' : 'نسخ'}
              </button>
            </div>
            {c.phoneUnpublished && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-700">
                <Lock className="h-3 w-3" aria-hidden="true" />
                معاينة داخلية: هذا الرقم لا يظهر في النسخة المنشورة
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={telHref(c.phone)} className="btn-primary" aria-label={`اتصال بـ${c.role} ${c.name ?? ''}`}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                اتصال
              </a>
              {c.whatsapp !== false ? (
                <a
                  href={whatsappHref(c.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-sage-50 text-sage-700 ring-1 ring-sage-200 hover:bg-sage-100"
                  aria-label={`مراسلة ${c.role} عبر واتساب (يفتح في نافذة جديدة)`}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  واتساب
                </a>
              ) : (
                <span className="btn cursor-default bg-lav-25 text-xs text-ink-400">لا يتوفر واتساب</span>
              )}
            </div>
            {c.name && (
              <button
                type="button"
                onClick={() => downloadVCard([c], `${c.id}.vcf`)}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium text-lav-700 hover:bg-lav-25"
              >
                <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
                حفظ في جهات الاتصال
              </button>
            )}
          </>
        ) : pendingSlot ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-400">
              <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
              خانة جاهزة للإضافة
            </span>
            {c.link && (
              <a href={c.link.url} target="_blank" rel="noopener noreferrer" className="btn-soft ms-auto px-3 py-2 text-xs">
                {c.link.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        ) : (
          <p className="flex items-center gap-2 rounded-xl border border-dashed border-ink-200 px-3 py-2.5 text-xs text-ink-500">
            <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            يُعرض الرقم بعد اعتماده من إدارة المدرسة
          </p>
        )}
      </div>
    </article>
  )
}

/** تمييز نص البحث داخل الاسم */
function Mark({ text, q }: { text: string; q?: string }) {
  const term = q?.trim()
  if (!term || term.length < 2) return <>{text}</>
  const i = text.indexOf(term)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-sage-100 px-0.5 text-ink-900">{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  )
}
