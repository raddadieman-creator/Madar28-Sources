import { ExternalLink, Search } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useRushd } from '../components/rushd/RushdContext'
import { SearchBox } from '../components/SearchBox'
import { Icon } from '../components/ui/Icon'
import { EmptyState, PageHeader, Skeleton } from '../components/ui/primitives'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { getSearchIndex, searchItems } from '../services/searchService'

export default function SearchPage() {
  useTitle('نتائج البحث')
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const type = params.get('type') ?? ''
  const year = params.get('year') ?? ''
  const issuer = params.get('issuer') ?? ''
  const { data: index } = useContent(getSearchIndex)
  const { open } = useRushd()
  const all = useMemo(() => (index && q ? searchItems(q, index, 60) : []), [index, q])
  const types = [...new Set(all.map((r) => r.item.type).filter(Boolean))] as string[]
  const years = [...new Set(all.map((r) => r.item.year).filter(Boolean))] as string[]
  const issuers = [...new Set(all.map((r) => r.item.issuer).filter(Boolean))] as string[]
  const results = all
    .filter((r) => (!type || r.item.type === type) && (!year || r.item.year === year) && (!issuer || r.item.issuer === issuer))
    .slice(0, 30)

  function setFilter(key: string, v: string) {
    const p = new URLSearchParams(params)
    if (v) p.set(key, v)
    else p.delete(key)
    setParams(p, { replace: true })
  }

  return (
    <>
      <PageHeader title="البحث في المنصة" icon={<Search className="h-6 w-6" />}>
        <div className="mt-5 max-w-2xl">
          <SearchBox initial={q} />
        </div>
      </PageHeader>

      {!index ? (
        <Skeleton className="h-64" />
      ) : !q ? (
        <EmptyState title="البحث في المنصة">مثل: النقل المدرسي، الغياب، موهبة، الاختبارات.</EmptyState>
      ) : all.length ? (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="تصفية النتائج">
            <button type="button" aria-pressed={!type} onClick={() => setFilter('type', '')} className={`chip ${!type ? 'border-lav-500 bg-lav-50 font-medium text-lav-800' : ''}`}>
              الكل
            </button>
            {types.map((t) => (
              <button key={t} type="button" aria-pressed={type === t} onClick={() => setFilter('type', type === t ? '' : t)} className={`chip ${type === t ? 'border-lav-500 bg-lav-50 font-medium text-lav-800' : ''}`}>
                {t === 'دليل' ? 'أدلة' : t === 'إجراء' ? 'إجراءات' : t === 'سؤال' ? 'أسئلة' : t === 'خدمة' ? 'خدمات' : t === 'موضوع' ? 'موضوعات' : t === 'فعالية' ? 'فعاليات' : t}
              </button>
            ))}
            {years.length > 0 && (
              <select aria-label="سنة الإصدار" value={year} onChange={(e) => setFilter('year', e.target.value)} className="field w-auto py-1.5 text-sm">
                <option value="">كل السنوات</option>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            )}
            {issuers.length > 0 && (
              <select aria-label="الجهة المصدرة" value={issuer} onChange={(e) => setFilter('issuer', e.target.value)} className="field w-auto py-1.5 text-sm">
                <option value="">كل الجهات</option>
                {issuers.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            )}
          </div>
          <p className="mb-4 text-sm text-ink-500" role="status">
            {results.length} نتيجة عن «{q}»
          </p>
          <ul className="space-y-2">
            {results.map(({ item }) => (
              <li key={item.id}>
                <Link to={item.path} className="flex items-start gap-4 rounded-2xl bg-white p-4 ring-1 ring-lav-100 transition-colors hover:ring-lav-300">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lav-50 text-lav-700">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-ink-500">
                      {item.section}
                      {item.year ? ` · ${item.issuer} · ${item.year}` : ''}
                    </span>
                    <span className="block font-medium text-ink-900">{item.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-sm text-ink-600">{item.description}</span>
                  </span>
                  {item.external && <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-ink-300" aria-label="له رابط رسمي" />}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyState title={`لم نجد نتائج عن «${q}»`}>
          <p>كلمة أقصر أو مرادف آخر قد يفيد، ورُشد جاهز للمساعدة.</p>
          <button type="button" className="btn-soft mt-4" onClick={() => open(q)}>
            اسألوا رُشد
          </button>
        </EmptyState>
      )}
    </>
  )
}
