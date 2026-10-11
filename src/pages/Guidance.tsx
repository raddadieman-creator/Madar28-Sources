import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { PageHeader, Skeleton } from '../components/ui/primitives'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { content } from '../services/contentService'

export default function Guidance() {
  useTitle('التوجيه الطلابي')
  const { data: topics } = useContent(content.guidance)

  return (
    <>
      <PageHeader
        title="التوجيه الطلابي"
        intro="أدلة وبرامج تدعم الطالبة دراسيًا ونفسيًا واجتماعيًا، وتساعد الأسرة على المساندة في البيت."
        icon={<Heart className="h-6 w-6" />}
      />
      {!topics ? (
        <Skeleton className="h-96" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {topics.map((t) => (
            <li key={t.id}>
              <Link
                to={`/guidance/${t.id}`}
                className="group flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-lav-100 transition-shadow hover:shadow-soft hover:ring-sage-200"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-50 text-sage-600 transition-colors group-hover:bg-sage-500 group-hover:text-white">
                  <Icon name={t.icon} className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-lg font-semibold">{t.title}</h2>
                <p className="mt-1 text-sm text-ink-600">{t.summary}</p>
                <p className="mt-auto pt-4 text-xs text-ink-400">{t.audience.join(' و')}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
