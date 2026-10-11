import { CircleCheck, Handshake } from 'lucide-react'
import { Icon } from '../components/ui/Icon'
import { DraftBadge, EmptyState, ExternalButton, PageHeader, SectionTitle, Skeleton } from '../components/ui/primitives'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { content } from '../services/contentService'

export default function Volunteer() {
  useTitle('العمل التطوعي')
  const { data: initiatives } = useContent(content.initiatives)
  const { data: conditions } = useContent(content.volunteerConditions)
  const { data: ops } = useContent(content.volunteerOpportunities)
  const { data: achievements } = useContent(content.volunteerAchievements)

  return (
    <>
      <PageHeader
        title="العمل التطوعي"
        intro="مبادرات تبني المسؤولية والانتماء، وفرص رسمية لتوثيق الساعات التطوعية."
        icon={<Handshake className="h-6 w-6" />}
      />

      <section aria-labelledby="initiatives">
        <SectionTitle id="initiatives" title="مبادرات المدرسة" />
        {!initiatives ? (
          <Skeleton className="h-60" />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {initiatives.map((i) => (
              <li key={i.id} id={i.id} className="scroll-mt-28 rounded-2xl bg-white p-5 ring-1 ring-lav-100">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-50 text-sage-600">
                    <Icon name={i.icon} className="h-5 w-5" />
                  </span>
                  <DraftBadge status={i.status} />
                </div>
                <h3 className="mt-3 font-semibold">{i.title}</h3>
                <p className="mt-1 text-sm text-ink-600">{i.summary}</p>
                <p className="mt-3 text-xs text-ink-400">{i.audience.join(' و')}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="conditions" className="rounded-3xl bg-sage-50 p-6 ring-1 ring-sage-100">
          <h2 id="conditions" className="text-lg font-semibold">
            شروط المشاركة
          </h2>
          <ul className="mt-4 space-y-3">
            {conditions?.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-ink-700">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage-500" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="vol-ops">
          <h2 id="vol-ops" className="mb-4 text-lg font-semibold">
            الفرص المتاحة وروابط التسجيل
          </h2>
          <ul className="space-y-3">
            {ops?.map((o) => (
              <li key={o.id} className="rounded-2xl bg-white p-5 ring-1 ring-lav-100">
                <h3 className="flex flex-wrap items-center gap-2 font-semibold">
                  {o.title} <DraftBadge status={o.status} />
                </h3>
                <p className="mt-1 text-sm text-ink-600">{o.summary}</p>
                <p className="mt-1 text-xs text-ink-400">{o.timing}</p>
                {o.link && (
                  <div className="mt-3">
                    <ExternalButton link={o.link} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="achievements" className="mt-12">
        <SectionTitle id="achievements" title="الإنجازات التطوعية" />
        {achievements && achievements.length ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {achievements.map((a) => (
              <li key={a.title} className="surface p-5">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-ink-600">{a.detail}</p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="تُعرض هنا الإنجازات الموثقة">
            تُضاف الإنجازات بعد توثيقها من إدارة المدرسة.
          </EmptyState>
        )}
      </section>
    </>
  )
}
