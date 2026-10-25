import { BookOpenText, ChevronLeft, Download, ExternalLink, FileText, ListTree, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { EmptyState, Skeleton } from '../components/ui/primitives'
import { docFileUrl } from '../data/library'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { content } from '../services/contentService'

/**
 * قارئ الدليل داخل المنصة.
 * - إن رُفعت نسخة محلية من الملف: تُعرض في عارض المتصفح مع الانتقال إلى الصفحة.
 * - وإلا: يُعرض الملف الرسمي عبر عارض Google للمستندات (يعمل على الجوال)،
 *   مع رابط مباشر دائم الظهور إلى الملف على موقع الجهة المصدرة.
 */
export default function GuideReader() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { data: docs } = useContent(content.library)
  const doc = docs?.find((d) => d.id === id)
  useTitle(doc?.title ?? 'قراءة الدليل')
  const requested = Number(params.get('p')) || undefined
  const [page, setPage] = useState<number | undefined>(requested)

  if (!docs) return <Skeleton className="h-[70vh]" />
  if (!doc)
    return (
      <EmptyState title="لم نجد هذا الدليل">
        <Link to="/library" className="text-lav-700 underline">
          العودة إلى الأدلة والأنظمة
        </Link>
      </EmptyState>
    )

  const local = Boolean(doc.localFile)
  const fileUrl = docFileUrl(doc)!
  const viewerSrc = local
    ? docFileUrl(doc, page)
    : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(doc.officialUrl!)}`

  function goTo(p?: number) {
    if (!p) return
    if (local) setPage(p)
    else window.open(docFileUrl(doc!, p), '_blank', 'noopener')
  }

  return (
    <div>
      <nav aria-label="مسار التنقل" className="mb-4 text-sm text-ink-500">
        <Link to="/library" className="hover:text-lav-700">
          الأدلة والأنظمة
        </Link>
        <ChevronLeft className="mx-1 inline h-4 w-4" aria-hidden="true" />
        <span className="text-ink-700">{doc.title}</span>
      </nav>

      <header className="mb-5 flex flex-col gap-4 rounded-3xl bg-gradient-to-l from-lav-100 via-lav-50 to-sage-50 p-5 ring-1 ring-lav-100 md:flex-row md:items-center md:p-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lav-500 to-lav-700 text-white shadow-glow">
          <FileText className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-extrabold leading-snug md:text-2xl">{doc.title}</h1>
          <p className="mt-1 text-sm text-ink-600">
            {doc.issuer} · {doc.year}
            {doc.edition ? ` · ${doc.edition}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn-soft px-4 py-2 text-sm">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            فتح في نافذة مستقلة
          </a>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" download className="btn-primary px-4 py-2 text-sm">
            <Download className="h-4 w-4" aria-hidden="true" />
            تنزيل
          </a>
        </div>
      </header>

      {requested && (
        <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-sage-50 px-4 py-3 text-sm text-sage-800 ring-1 ring-sage-100 sm:flex-row sm:items-center">
          <BookOpenText className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">الموضع المشار إليه: الصفحة {requested} تقريبًا.</span>
          {!local && (
            <button type="button" onClick={() => goTo(requested)} className="font-semibold underline underline-offset-4">
              فتح الملف عند هذه الصفحة
            </button>
          )}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-label="عارض الدليل" className="self-start overflow-hidden rounded-3xl bg-white ring-1 ring-lav-100">
          <iframe
            key={viewerSrc}
            src={viewerSrc}
            title={`قراءة: ${doc.title}`}
            className="block h-[72vh] w-full bg-lav-25 md:h-[80vh]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-lav-100 bg-lav-25 px-4 py-2.5 text-xs text-ink-600">
            لا يظهر الملف؟
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-lav-700 underline underline-offset-4">
              افتحي الملف مباشرة من {local ? 'المنصة' : `موقع ${doc.issuer.split('—')[0].trim()}`}
            </a>
          </p>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {doc.toc.length > 0 && (
          <section aria-labelledby="toc-title" className="rounded-3xl bg-white p-4 ring-1 ring-lav-100">
            <h2 id="toc-title" className="mb-2 flex items-center gap-2 text-sm font-bold">
              <ListTree className="h-4 w-4 text-lav-600" aria-hidden="true" />
              فهرس الدليل
            </h2>
            <ol className="space-y-0.5">
              {doc.toc.map((t) => (
                <li key={t.title}>
                  <button
                    type="button"
                    onClick={() => goTo(t.page)}
                    className={`flex w-full items-start gap-2 rounded-xl px-2 py-2 text-start text-[13px] leading-5 hover:bg-lav-50 ${
                      page && t.page === page ? 'bg-lav-50 font-semibold text-lav-800' : 'text-ink-700'
                    }`}
                  >
                    <span className="flex-1">{t.title}</span>
                    {t.page && <span className="shrink-0 text-ink-400">ص {t.page}</span>}
                  </button>
                </li>
              ))}
            </ol>
            {!local && <p className="mt-2 text-[11px] leading-5 text-ink-400">اختيار عنصر يفتح الملف الرسمي عند صفحته في نافذة مستقلة.</p>}
          </section>
          )}

          {doc.highlights?.length ? (
            <section aria-labelledby="hl-title" className="rounded-3xl bg-sage-50 p-4 ring-1 ring-sage-100">
              <h2 id="hl-title" className="mb-2 text-sm font-bold text-sage-800">
                أبرز ما في الدليل
              </h2>
              <ul className="space-y-3">
                {doc.highlights.map((h) => (
                  <li key={h.text} className="text-[13px] leading-6 text-ink-700">
                    {h.text}
                    {h.page && (
                      <button type="button" onClick={() => goTo(h.page)} className="ms-1 text-xs font-semibold text-sage-700 underline underline-offset-4">
                        {h.section ? `${h.section}، ` : ''}ص {h.page}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="flex gap-2 px-1 text-[11px] leading-5 text-ink-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-sage-600" aria-hidden="true" />
            <span>
              الملف من مصدره الرسمي، وتم التحقق من الرابط بتاريخ {doc.verifiedOn}. {doc.note}
            </span>
          </p>
        </aside>
      </div>
    </div>
  )
}
