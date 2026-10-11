import { ExternalLink, Search } from 'lucide-react'
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
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const { data: index } = useContent(getSearchIndex)
  const { open } = useRushd()
  const results = index && q ? searchItems(q, index, 30) : []

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
      ) : results.length ? (
        <>
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
                    <span className="block text-xs text-ink-500">{item.section}</span>
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
