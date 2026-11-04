import { ExternalLink, Pin } from './ui/hand'
import type { Announcement } from '../types/content'
import { formatGregorian, formatHijri, parseDate } from '../lib/dates'
import { DraftBadge } from './ui/primitives'

const URL_RE = /(https?:\/\/[^\s]+)/g

/** نص الإعلان مع جعل الروابط (مثل روابط الاستبانات) قابلة للضغط */
function BodyText({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_RE).map((part, i) =>
        i % 2 ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" dir="ltr" className="break-all font-medium text-lav-700 underline underline-offset-4 hover:text-lav-800">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  )
}

export function AnnouncementItem({ a }: { a: Announcement }) {
  const d = parseDate(a.date)
  return (
    <article className={`relative rounded-2xl px-5 py-4 ${a.pinned ? 'border border-lav-200 bg-lav-50/70' : 'border border-transparent bg-white'}`}>
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-ink-500">
        {a.pinned && (
          <span className="inline-flex items-center gap-1 font-medium text-lav-700">
            <Pin className="h-3.5 w-3.5" aria-hidden="true" />
            مثبّت
          </span>
        )}
        <time dateTime={a.date} title={formatGregorian(d)}>
          {formatHijri(d)}
        </time>
        <span className="rounded-full bg-sage-50 px-2 py-0.5 text-sage-700">{a.audience}</span>
        <DraftBadge status={a.status} />
      </div>
      <h3 className="text-[15px] font-semibold">{a.title}</h3>
      <p className="mt-1 whitespace-pre-line text-sm text-ink-600">
        <BodyText text={a.body} />
      </p>
      {a.link && (
        <a
          href={a.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-lav-700 hover:text-lav-800"
        >
          {a.link.label}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </article>
  )
}
