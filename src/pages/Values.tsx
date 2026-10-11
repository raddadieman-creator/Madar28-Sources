import { Gem, HeartHandshake, School, Target, UserRoundCheck } from 'lucide-react'
import { SourceLink } from '../components/SourceLink'
import { Icon } from '../components/ui/Icon'
import { PageHeader, Skeleton } from '../components/ui/primitives'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { formatGregorian, formatHijri } from '../lib/dates'
import { content, valueArchive, valueOfTheWeek } from '../services/contentService'

export default function Values() {
  useTitle('قيمة الأسبوع')
  const { data: values } = useContent(content.values)
  if (!values) return <Skeleton className="h-96" />
  const v = valueOfTheWeek(values)
  const archive = valueArchive(values)
  if (!v) return null

  const blocks = [
    { icon: UserRoundCheck, title: 'سلوك الطالبة', body: <ul className="space-y-1.5">{v.practices.map((p) => <li key={p}>• {p}</li>)}</ul> },
    { icon: Target, title: 'تحدي الأسبوع', body: <p>{v.challenge}</p> },
    { icon: HeartHandshake, title: 'رسالة للأسرة', body: <p>{v.family}</p> },
    { icon: School, title: 'نشاط مدرسي مقترح', body: <p>{v.activity}</p> },
  ]

  return (
    <>
      <PageHeader title="قيمة الأسبوع" intro="قيمة واحدة كل أسبوع، تُعاش في الفصل والبيت." icon={<Gem className="h-6 w-6" />} />

      <article className="overflow-hidden rounded-[2rem] bg-gradient-to-bl from-gold-100 via-cream to-white ring-1 ring-gold-100">
        <header className="px-6 pb-4 pt-8 text-center md:px-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-gold-700 shadow-soft">
            <Icon name={v.icon} className="h-7 w-7" />
          </span>
          <h2 className="mt-3 text-4xl font-extrabold">{v.name}</h2>
          {v.quote && (
            <figure className="mx-auto mt-4 max-w-xl">
              <blockquote className="text-xl leading-10 text-ink-800">﴿{v.quote.text}﴾</blockquote>
              <figcaption className="text-xs text-gold-700">[{v.quote.ref}]</figcaption>
            </figure>
          )}
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-8 text-ink-600">{v.meaning}</p>
          {v.officialSource && (
            <div className="mt-3 flex justify-center">
              <SourceLink source={v.officialSource} />
            </div>
          )}
        </header>
        <div className="grid gap-3 p-4 sm:grid-cols-2 md:p-6">
          {blocks.map((b) => (
            <section key={b.title} className="rounded-2xl bg-white/85 p-5 text-[15px] leading-7 text-ink-700 ring-1 ring-gold-100">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-900">
                <b.icon className="h-4 w-4 text-gold-700" aria-hidden="true" />
                {b.title}
              </h3>
              {b.body}
            </section>
          ))}
        </div>
      </article>

      {archive.length > 0 && (
        <section aria-labelledby="archive-title" className="mt-10">
          <h2 id="archive-title" className="mb-3 text-lg font-extrabold">
            الأسابيع السابقة
          </h2>
          <ul className="divide-y divide-lav-50 overflow-hidden rounded-2xl bg-white ring-1 ring-lav-100">
            {archive.map(({ value, weekStart }) => (
              <li key={weekStart.toISOString()} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                  <Icon name={value.icon} className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{value.name}</span>
                  <span className="block truncate text-xs text-ink-500">{value.challenge}</span>
                </span>
                <time dateTime={weekStart.toISOString()} className="shrink-0 text-end text-xs text-ink-500">
                  {formatHijri(weekStart)}
                  <span className="block text-ink-400">{formatGregorian(weekStart)}</span>
                </time>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
