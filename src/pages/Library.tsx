import { BookOpenText, Download, Library as LibraryIcon, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EmptyState, PageHeader, Skeleton } from '../components/ui/primitives'
import { docFileUrl } from '../data/library'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { normalizeArabic, tokenize, tokensMatch } from '../lib/arabic'
import { content } from '../services/contentService'
import type { GuideDoc } from '../types/content'

function matches(d: GuideDoc, q: string) {
  const text = `${d.title} ${d.issuer} ${d.year} ${d.summary} ${d.tags.join(' ')} ${d.toc.map((t) => t.title).join(' ')}`
  const nq = normalizeArabic(q)
  if (!nq) return true
  if (normalizeArabic(text).includes(nq)) return true
  const qt = tokenize(q)
  const ht = tokenize(text)
  return qt.length > 0 && qt.every((t) => ht.some((h) => tokensMatch(t, h) > 0))
}

export default function Library() {
  useTitle('الأدلة والأنظمة')
  const { data: docs } = useContent(content.library)
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const topic = params.get('topic') ?? ''
  const urlQ = params.get('q') ?? ''
  // مزامنة البحث مع الرابط عند الانتقال من صفحة أخرى أو زر الرجوع
  useEffect(() => {
    setQ((cur) => (cur.trim() === urlQ ? cur : urlQ))
  }, [urlQ])

  const topics = useMemo(() => [...new Set(docs?.flatMap((d) => d.topics) ?? [])], [docs])
  const list = useMemo(() => docs?.filter((d) => matches(d, q) && (!topic || d.topics.includes(topic as never))), [docs, q, topic])

  function setParam(key: string, v: string) {
    const p = new URLSearchParams(params)
    if (v) p.set(key, v)
    else p.delete(key)
    setParams(p, { replace: true })
  }

  return (
    <>
      <PageHeader
        title="الأدلة والأنظمة"
        intro="الأدلة الرسمية التي تعمل بها المدرسة، تُقرأ داخل المنصة أو تُنزَّل من مصدرها."
        icon={<LibraryIcon className="h-6 w-6" />}
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-md">
          <label htmlFor="lib-search" className="sr-only">
            البحث في الأدلة
          </label>
          <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-lav-500" aria-hidden="true" />
          <input
            id="lib-search"
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setParam('q', e.target.value.trim())
            }}
            placeholder="البحث في الأدلة: غياب، تنمر، درجات السلوك…"
            className="field py-3 pe-10 ps-12 shadow-soft [&::-webkit-search-cancel-button]:hidden"
            autoComplete="off"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ('')
                setParam('q', '')
              }}
              className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 hover:text-ink-700"
              aria-label="مسح البحث"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="تصفية حسب الموضوع">
          <button type="button" className={`chip ${!topic ? 'border-lav-500 bg-lav-50 font-medium text-lav-800' : ''}`} aria-pressed={!topic} onClick={() => setParam('topic', '')}>
            الكل
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${topic === t ? 'border-lav-500 bg-lav-50 font-medium text-lav-800' : ''}`}
              aria-pressed={topic === t}
              onClick={() => setParam('topic', topic === t ? '' : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {!list ? (
        <Skeleton className="h-48" />
      ) : list.length ? (
        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-lav-100">
          <div className="hidden grid-cols-[minmax(0,1fr)_11rem_7rem_15rem] gap-4 border-b border-lav-100 bg-lav-25 px-5 py-3 text-xs font-semibold text-ink-500 md:grid">
            <span>الدليل</span>
            <span>الجهة المصدرة</span>
            <span>السنة</span>
            <span className="sr-only">إجراءات</span>
          </div>
          <ul className="divide-y divide-lav-50">
            {list.map((d) => (
              <li key={d.id} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_11rem_7rem_15rem] md:items-center md:gap-4">
                <div className="min-w-0">
                  <Link to={`/library/${d.id}`} className="font-bold text-ink-900 hover:text-lav-800">
                    {d.title}
                  </Link>
                  {d.edition && <span className="ms-2 inline-block whitespace-nowrap rounded-full bg-sage-50 px-2 py-0.5 align-middle text-[11px] text-sage-700 ring-1 ring-sage-100">{d.edition}</span>}
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink-500">{d.summary}</p>
                </div>
                <p className="text-sm text-ink-700">
                  <span className="text-ink-400 md:hidden">الجهة: </span>
                  {d.issuer}
                </p>
                <p className="text-sm text-ink-700">
                  <span className="text-ink-400 md:hidden">السنة: </span>
                  {d.year}
                </p>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Link to={`/library/${d.id}`} className="btn-primary px-4 py-2 text-sm">
                    <BookOpenText className="h-4 w-4" aria-hidden="true" />
                    قراءة الدليل
                  </Link>
                  <a href={docFileUrl(d)} target="_blank" rel="noopener noreferrer" download className="btn-ghost px-3 py-2 text-sm">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    تنزيل
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState title={`لا يوجد دليل يطابق «${q}»`}>جرّبوا كلمة أخرى، أو اسألوا رُشد.</EmptyState>
      )}

      <p className="mt-6 text-xs leading-6 text-ink-500">
        تُضاف الأدلة هنا بعد التحقق من ملفها الرسمي وإصدارها. أي دليل لم يُتحقق من ملفه لا يُعرض.
      </p>
    </>
  )
}
