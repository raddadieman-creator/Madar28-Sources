import { Clock, MapPin, Quote, School } from 'lucide-react'
import { Icon } from '../components/ui/Icon'
import { DraftBadge, PageHeader, SectionTitle, Skeleton } from '../components/ui/primitives'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { content } from '../services/contentService'

export default function About() {
  useTitle('عن المدرسة')
  const { data: s } = useContent(content.school)
  const { data: org } = useContent(content.orgStructure)

  if (!s) return <Skeleton className="h-96" />

  return (
    <>
      <PageHeader title="عن المدرسة" intro={s.fullName} icon={<School className="h-6 w-6" />} />

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="vision" className="arch-top bg-gradient-to-b from-lav-100 to-white px-6 pb-7 pt-14 text-center ring-1 ring-lav-100">
          <h2 id="vision" className="text-lg font-semibold">
            الرؤية
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-[17px] leading-9 text-ink-800">{s.vision}</p>
        </section>
        <section aria-labelledby="mission" className="arch-top bg-gradient-to-b from-sage-100 to-white px-6 pb-7 pt-14 text-center ring-1 ring-sage-100">
          <h2 id="mission" className="text-lg font-semibold">
            الرسالة
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-[17px] leading-9 text-ink-800">{s.mission}</p>
        </section>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="goals">
          <SectionTitle id="goals" title="المحاور" />
          <ul className="space-y-3">
            {s.goals.map((g) => {
              const [head, ...rest] = g.split(':')
              return (
                <li key={g} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-lav-100">
                  <Icon name="check-circle" className="mt-1 h-5 w-5 shrink-0 text-sage-500" />
                  <span className="text-ink-700">
                    {rest.length ? (
                      <>
                        <span className="font-bold text-ink-900">{head}</span>
                        <span className="block text-sm text-ink-600">{rest.join(':').trim()}</span>
                      </>
                    ) : (
                      g
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="values-about">
          <SectionTitle id="values-about" title="القيم" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(s.coreValues ?? []).map((v, i) => (
              <li key={v} className="flex flex-col items-center rounded-2xl bg-white p-4 text-center ring-1 ring-lav-100">
                <Icon name={['users', 'lightbulb', 'book', 'handshake', 'award'][i] ?? 'gem'} className="h-6 w-6 text-lav-600" />
                <span className="mt-2 text-sm font-bold text-ink-900">{v}</span>
              </li>
            ))}
          </ul>
          {s.slogan && <p className="mt-5 rounded-2xl bg-lav-50 px-4 py-3 text-center font-bold text-lav-800">{s.slogan}</p>}
        </section>
      </div>

      <section aria-labelledby="principal" className="mt-12 rounded-3xl bg-white p-6 ring-1 ring-lav-100 md:p-10">
        <div className="flex items-start gap-4">
          <Quote className="h-8 w-8 shrink-0 -scale-x-100 text-lav-300" aria-hidden="true" />
          <div className="max-w-prose">
            <h2 id="principal" className="text-xl font-semibold">
              {s.principalWord.title} <DraftBadge status={s.status} />
            </h2>
            <div className="mt-4 space-y-3 text-[16px] leading-9 text-ink-700">
              {s.principalWord.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-6 font-medium text-ink-900">{s.principalWord.signature}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="structure" className="mt-12">
        <SectionTitle id="structure" title="الهيكل الإداري" intro="الأدوار والمسؤوليات. تُضاف الأسماء بعد اعتمادها." />
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {org?.map((o, i) => (
            <li
              key={o.role}
              className={`rounded-2xl p-5 ring-1 ${i === 0 ? 'bg-lav-600 text-white ring-lav-600 sm:col-span-2 xl:col-span-4' : 'bg-white ring-lav-100'}`}
            >
              <div className="flex items-center gap-3">
                <Icon name={o.icon} className={`h-5 w-5 ${i === 0 ? 'text-lav-100' : 'text-lav-600'}`} />
                <h3 className={`font-semibold ${i === 0 ? 'text-white' : ''}`}>{o.role}</h3>
              </div>
              <p className={`mt-2 text-sm ${i === 0 ? 'text-lav-50' : 'text-ink-600'}`}>{o.description}</p>
              {o.name && <p className="mt-2 text-sm font-medium">{o.name}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="info" className="mt-12">
        <SectionTitle id="info" title="معلومات المدرسة وموقعها" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="surface p-5">
            <p className="text-sm text-ink-500">المرحلة</p>
            <p className="mt-1 font-medium text-ink-900">{s.stage}</p>
          </div>
          {s.workingHours && (
            <div className="surface p-5">
              <p className="flex items-center gap-1.5 text-sm text-ink-500">
                <Clock className="h-4 w-4" aria-hidden="true" /> الدوام
              </p>
              <p className="mt-1 font-medium text-ink-900">{s.workingHours}</p>
            </div>
          )}
          <div className="surface p-5">
            <p className="flex items-center gap-1.5 text-sm text-ink-500">
              <MapPin className="h-4 w-4" aria-hidden="true" /> الموقع
            </p>
            <p className="mt-1 font-medium text-ink-900">{s.address}</p>
            {s.mapUrl ? (
              <a href={s.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-soft mt-3">
                فتح في الخرائط
              </a>
            ) : (
              <p className="mt-2 text-xs text-ink-400">رابط الخريطة يُضاف بعد الاعتماد</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
