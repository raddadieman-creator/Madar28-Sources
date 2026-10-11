import { ChevronDown, ExternalLink, LayoutGrid, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { ExternalButton, PageHeader, SectionTitle, Skeleton } from '../components/ui/primitives'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { content } from '../services/contentService'

export default function Services() {
  useTitle('الخدمات المدرسية')
  const { data: services } = useContent(content.services)
  const { data: wtd } = useContent(content.whatToDo)
  const { data: contacts } = useContent(content.contacts)

  const official = services?.filter((s) => s.official) ?? []

  return (
    <>
      <PageHeader
        title="الخدمات المدرسية"
        intro="روابط الأنظمة الرسمية، وخطوات مختصرة لاستخدامها، ودليل عملي للمواقف اليومية."
        icon={<LayoutGrid className="h-6 w-6" />}
      />

      <section aria-labelledby="official">
        <SectionTitle id="official" title="الأنظمة والمنصات الرسمية" intro="جميع الروابط تفتح المواقع الحكومية الرسمية في نافذة جديدة." />
        {!services ? (
          <Skeleton className="h-72" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {official.map((s) => (
              <article key={s.id} id={s.id} className="surface flex scroll-mt-28 flex-col p-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lav-50 text-lav-700">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-0.5 text-sm text-ink-600">{s.summary}</p>
                  </div>
                </div>
                {s.steps && (
                  <ol className="mt-4 space-y-2 border-s-2 border-lav-100 ps-4 text-sm text-ink-700">
                    {s.steps.map((st, i) => (
                      <li key={st} className="flex gap-2">
                        <span className="font-semibold text-lav-600">{i + 1}.</span>
                        {st}
                      </li>
                    ))}
                  </ol>
                )}
                {s.url && (
                  <div className="mt-auto pt-5">
                    <ExternalButton link={{ label: `الدخول إلى ${s.title}`, url: s.url }} />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="what-to-do" className="mt-14">
        <SectionTitle id="what-to-do" title="ماذا أفعل إذا؟" intro="إرشادات عامة للمواقف المتكررة. المرجع النهائي أنظمة وزارة التعليم وتوجيه المدرسة." />
        <div className="space-y-2.5">
          {wtd?.map((w) => {
            const contact = contacts?.find((c) => c.id === w.contactId)
            return (
              <details key={w.id} id={`wtd-${w.id}`} className="group scroll-mt-28 rounded-2xl bg-white ring-1 ring-lav-100 open:ring-lav-300">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 font-medium text-ink-900">{w.question}</span>
                  <ChevronDown className="h-5 w-5 text-ink-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="border-t border-lav-50 px-5 pb-5 pt-4">
                  <ol className="space-y-2 text-sm text-ink-700">
                    {w.steps.map((st, i) => (
                      <li key={st} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-50 text-xs font-semibold text-sage-700">
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{st}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {contact && (
                      <Link to={`/contact#${contact.id}`} className="btn-soft">
                        <UserRound className="h-4 w-4" aria-hidden="true" />
                        المسؤولة: {contact.role}
                      </Link>
                    )}
                    {w.link && (
                      <a href={w.link.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                        {w.link.label}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="contact-guide" className="mt-14 flex flex-col items-start justify-between gap-4 rounded-3xl bg-sage-50 p-6 ring-1 ring-sage-100 md:flex-row md:items-center">
        <div>
          <h2 id="contact-guide" className="text-lg font-semibold">
            دليل التواصل مع المسؤولات
          </h2>
          <p className="mt-1 text-sm text-ink-600">لكل موضوع مسؤولة مختصة؛ التوجه إليها مباشرة يختصر الوقت.</p>
        </div>
        <Link to="/contact" className="btn-primary">
          فتح دليل التواصل
        </Link>
      </section>
    </>
  )
}
