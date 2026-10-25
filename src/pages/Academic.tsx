import { BookOpenCheck, ChevronLeft, ExternalLink, FileText, Headset, MessageCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/primitives'
import { ORG_GUIDE_URL, academicAudiences, academicServices, staffGuide, teacherGuide, type AcademicAudience, type GuideSection } from '../data/academic'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { content } from '../services/contentService'

/** الشؤون التعليمية — خدمة المستفيد للطالبة وولي الأمر والمعلمة والإدارية */
export default function Academic() {
  useTitle('الشؤون التعليمية')
  const [params, setParams] = useSearchParams()
  const { data: contacts } = useContent(content.contacts)
  const view = (['service', 'teacher', 'staff'].includes(params.get('view') ?? '') ? params.get('view') : 'service') as 'service' | 'teacher' | 'staff'
  const tab = (academicAudiences.find((a) => a.id === params.get('for'))?.id ?? 'student') as AcademicAudience
  const audience = academicAudiences.find((a) => a.id === tab)!
  const vice = contacts?.find((c) => c.id === 'vice')

  const requestLink = (topic: string, to = 'vice') =>
    `/contact?kind=inquiry&to=${encodeURIComponent(to)}&topic=${encodeURIComponent(topic)}&from=${encodeURIComponent(audience.sender)}`

  return (
    <>
      <PageHeader
        title="الشؤون التعليمية"
        intro="خدمة المستفيد: مرجع واحد لطلبات الشؤون التعليمية، للطالبة وولي أمرها، وللمعلمة، وللإدارية."
        icon={<BookOpenCheck className="h-6 w-6" />}
      />

      <nav aria-label="أقسام الشؤون التعليمية" className="mb-6 grid grid-cols-3 gap-2 rounded-2xl bg-white p-1.5 ring-1 ring-lav-100">
        {[
          { id: 'service', label: 'خدمة المستفيد' },
          { id: 'teacher', label: 'دليل المعلمة' },
          { id: 'staff', label: 'دليل الإدارية' },
        ].map((v) => (
          <button
            key={v.id}
            type="button"
            aria-current={view === v.id ? 'page' : undefined}
            onClick={() => setParams({ view: v.id }, { replace: true })}
            className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${view === v.id ? 'bg-lav-600 text-white shadow-soft' : 'text-ink-700 hover:bg-lav-50'}`}
          >
            {v.label}
          </button>
        ))}
      </nav>

      {view === 'teacher' && <GuideView sections={teacherGuide} requestFor="teacher" />}
      {view === 'staff' && <GuideView sections={staffGuide} requestFor="staff" />}
      {view === 'service' && (
      <>

      <div role="tablist" aria-label="المستفيد" className="mb-5 flex flex-wrap gap-2">
        {academicAudiences.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={tab === a.id}
            onClick={() => setParams({ view: 'service', for: a.id }, { replace: true })}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
              tab === a.id ? 'bg-lav-600 text-white ring-lav-600' : 'bg-white text-ink-700 ring-lav-100 hover:ring-lav-300'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section aria-label={`خدمات ${audience.label}`}>
          <p className="mb-3 text-sm text-ink-600">{audience.intro}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {academicServices[tab].map((s) => (
              <li key={s.id} className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-lav-100">
                <h2 className="font-bold text-ink-900">{s.title}</h2>
                <p className="mt-1 flex-1 text-sm leading-7 text-ink-600">{s.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <Link to={requestLink(s.title, s.contactTo)} className="inline-flex items-center gap-1 rounded-full bg-lav-50 px-3 py-1.5 font-semibold text-lav-700 ring-1 ring-lav-100 hover:bg-lav-100">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    تقديم طلب
                  </Link>
                  {s.procedure && (
                    <Link to={`/procedures#${s.procedure}`} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-medium text-ink-700 ring-1 ring-lav-100 hover:ring-lav-300">
                      الإجراء
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                  {s.system && (
                    <a href={s.system.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-medium text-ink-700 ring-1 ring-lav-100 hover:ring-lav-300">
                      {s.system.label}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-gradient-to-bl from-lav-100 to-white p-5 ring-1 ring-lav-100">
            <p className="flex items-center gap-2 font-bold text-ink-900">
              <Headset className="h-5 w-5 text-lav-600" aria-hidden="true" />
              خدمة المستفيد
            </p>
            <p className="mt-2 text-sm leading-7 text-ink-600">
              الجهة المختصة: {vice?.role ?? 'وكيلة المدرسة'} (الشؤون التعليمية). يصلها الطلب مكتوبًا عبر «مركز التواصل»، والرد يكون منها.
            </p>
            <Link to={requestLink('طلب للشؤون التعليمية')} className="btn-primary mt-4 w-full justify-center">
              تقديم طلب عام
            </Link>
          </div>
          <p className="px-1 text-xs leading-6 text-ink-500">لا تُكتب في الطلب أرقام هوية أو بيانات صحية.</p>
        </aside>
      </div>
      </>
      )}
    </>
  )
}

/** عرض دليل (المعلمة أو الإدارية) مع أرقام صفحات الدليل التنظيمي */
function GuideView({ sections, requestFor }: { sections: GuideSection[]; requestFor: AcademicAudience }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="space-y-3">
        {sections.map((sec) => (
          <section key={sec.title} className="rounded-2xl bg-white p-5 ring-1 ring-lav-100">
            <h2 className="text-lg font-bold text-ink-900">{sec.title}</h2>
            <ul className="mt-2 space-y-2">
              {sec.points.map((pt) => (
                <li key={pt.text} className="flex gap-2 text-[15px] leading-7 text-ink-700">
                  <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-lav-500" aria-hidden="true" />
                  <span>
                    {pt.text}
                    {pt.page && <span className="ms-1 whitespace-nowrap text-xs text-ink-500">(ص {pt.page})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
        <a href={ORG_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-lav-100 hover:ring-lav-300">
          <FileText className="h-6 w-6 shrink-0 text-lav-600" aria-hidden="true" />
          <span className="flex-1">
            <span className="block font-bold text-ink-900">الدليل التنظيمي لمدارس التعليم العام</span>
            <span className="block text-xs text-ink-500">وزارة التعليم، 1442هـ</span>
          </span>
          <ExternalLink className="h-4 w-4 text-ink-400" aria-hidden="true" />
        </a>
        <Link to={`/academic?view=service&for=${requestFor}`} className="btn-primary w-full justify-center">
          خدمة المستفيد: تقديم طلب
        </Link>
      </aside>
    </div>
  )
}
