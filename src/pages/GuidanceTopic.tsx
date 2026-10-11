import { BookOpenText, ChevronLeft, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { SourceLink } from '../components/SourceLink'
import { EmptyState, ExternalButton, Skeleton } from '../components/ui/primitives'
import { findDoc } from '../data/library'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { content } from '../services/contentService'

export default function GuidanceTopic() {
  const { id } = useParams()
  const { data: topics } = useContent(content.guidance)
  const topic = topics?.find((t) => t.id === id)
  useTitle(topic?.title ?? 'التوجيه الطلابي')

  if (!topics) return <Skeleton className="h-96" />
  if (!topic)
    return (
      <EmptyState title="لم نجد هذا الموضوع">
        <Link to="/guidance" className="text-lav-700 underline">العودة إلى التوجيه الطلابي</Link>
      </EmptyState>
    )

  const others = topics.filter((t) => t.id !== topic.id)
  const doc = topic.docId ? findDoc(topic.docId) : undefined

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_17rem]">
      <article>
        <nav aria-label="مسار التنقل" className="mb-4 text-sm text-ink-500">
          <Link to="/guidance" className="hover:text-lav-700">التوجيه الطلابي</Link>
          <ChevronLeft className="mx-1 inline h-4 w-4" aria-hidden="true" />
          <span className="text-ink-700">{topic.title}</span>
        </nav>
        <header className="flex items-start gap-4">
          <span className="arch-top flex h-16 w-14 shrink-0 items-end justify-center bg-gradient-to-b from-sage-100 to-lav-50 pb-3 text-sage-700">
            <Icon name={topic.icon} className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">{topic.title}</h1>
            <p className="mt-2 max-w-prose text-ink-600">{topic.summary}</p>
          </div>
        </header>

        <div className="mt-8 space-y-6">
          {topic.sections.map((s) => (
            <section key={s.heading} className="rounded-2xl bg-white p-6 ring-1 ring-lav-100">
              <h2 className="text-lg font-semibold">{s.heading}</h2>
              <ul className="prose-ar max-w-prose text-[15px] text-ink-700">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {s.source && <SourceLink source={s.source} className="mt-3" />}
            </section>
          ))}
        </div>

        {(doc || topic.links?.length) && (
          <section className="mt-8">
            <h2 className="mb-3 text-base font-semibold">مصادر وروابط</h2>
            <div className="flex flex-wrap gap-2">
              {doc && (
                <Link to={`/library/${doc.id}`} className="btn-primary">
                  <BookOpenText className="h-4 w-4" aria-hidden="true" />
                  قراءة الدليل: {doc.title} {doc.year.split('–')[0].trim()}
                </Link>
              )}
              {topic.links?.map((l) => (
                <ExternalButton key={l.url} link={l} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-lav-50 p-5 sm:flex-row sm:items-center">
          <UserRound className="h-6 w-6 shrink-0 text-lav-600" aria-hidden="true" />
          <p className="flex-1 text-sm text-ink-700">هل تحتاج إلى مساعدة في موقف محدد؟ الموجهة الطلابية تتعامل مع ما تشاركه بسرية.</p>
          <Link to="/contact#counselor" className="btn-primary">
            التواصل مع الموجهة
          </Link>
        </div>
      </article>

      <aside aria-label="موضوعات أخرى" className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="mb-3 text-sm font-semibold text-ink-500">موضوعات أخرى</h2>
        <ul className="space-y-1">
          {others.map((t) => (
            <li key={t.id}>
              <Link to={`/guidance/${t.id}`} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink-700 hover:bg-white hover:text-lav-800">
                <Icon name={t.icon} className="h-4 w-4 text-sage-600" />
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
