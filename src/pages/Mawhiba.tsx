import { CalendarClock, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { DraftBadge, ExternalButton, Notice, PageHeader, SectionTitle, Skeleton } from '../components/ui/primitives'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { content } from '../services/contentService'

export default function Mawhiba() {
  useTitle('موهبة والإبداع')
  const { data: programs } = useContent(content.mawhibaPrograms)
  const { data: ops } = useContent(content.mawhibaOpportunities)
  if (!programs) return <Skeleton className="h-96" />
  const [about, ...rest] = programs

  return (
    <>
      <PageHeader
        title="موهبة والإبداع"
        intro="تعرّفوا على برامج موهبة ومسابقاتها، وكيف تبدأ الطالبة مشروعها البحثي."
        icon={<Lightbulb className="h-6 w-6" />}
      />

      <section id={about.id} aria-labelledby="mawhiba-about" className="scroll-mt-28 rounded-3xl bg-gradient-to-l from-lav-50 to-white p-6 ring-1 ring-lav-100 md:p-8">
        <h2 id="mawhiba-about" className="text-xl font-semibold">
          {about.title}
        </h2>
        <p className="mt-2 max-w-prose text-ink-700">{about.summary}</p>
        <ul className="prose-ar mt-2 max-w-prose text-sm text-ink-600">
          {about.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        {about.link && (
          <div className="mt-5">
            <ExternalButton link={about.link} variant="primary" />
          </div>
        )}
      </section>

      <section aria-labelledby="programs" className="mt-12">
        <SectionTitle id="programs" title="البرامج والمسابقات" />
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((p) => (
            <article key={p.id} id={p.id} className="surface flex scroll-mt-28 flex-col p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lav-50 text-lav-700">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-ink-500">{p.kind}</p>
                  <h3 className="font-semibold">{p.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-700">{p.summary}</p>
              <ul className="prose-ar text-sm text-ink-600">
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              {p.link && (
                <div className="mt-auto pt-4">
                  <ExternalButton link={p.link} />
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="ops" className="mt-12">
        <SectionTitle id="ops" title="الفرص والمواعيد المهمة" />
        <div className="mb-4">
          <Notice>المواعيد الرسمية تُعلنها مؤسسة موهبة؛ لا نضيف تاريخًا هنا إلا بعد صدوره رسميًا.</Notice>
        </div>
        <ul className="space-y-3">
          {ops?.map((o) => (
            <li key={o.id} className="flex flex-col gap-3 rounded-2xl bg-white p-5 ring-1 ring-lav-100 sm:flex-row sm:items-center">
              <CalendarClock className="h-6 w-6 shrink-0 text-lav-500" aria-hidden="true" />
              <div className="flex-1">
                <h3 className="flex flex-wrap items-center gap-2 font-semibold">
                  {o.title} <DraftBadge status={o.status} />
                </h3>
                <p className="text-sm text-ink-600">{o.summary}</p>
                <p className="mt-1 text-xs text-ink-400">{o.timing}</p>
              </div>
              {o.link && <ExternalButton link={o.link} />}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-600">
          للترشيح والمتابعة داخل المدرسة:{' '}
          <Link to="/contact" className="font-medium text-lav-700 underline underline-offset-4">
            دليل التواصل
          </Link>
        </p>
      </section>
    </>
  )
}
