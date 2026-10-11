import { ChevronDown, Compass, ExternalLink, Phone } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SourceLink } from '../components/SourceLink'
import { Icon } from '../components/ui/Icon'
import { PageHeader, Skeleton } from '../components/ui/primitives'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { content } from '../services/contentService'

export default function Procedures() {
  useTitle('دليلك المدرسي')
  const { data: items } = useContent(content.procedures)
  const { data: contacts } = useContent(content.contacts)
  const { hash } = useLocation()

  // فتح الإجراء المشار إليه في الرابط (#late مثلًا)
  useEffect(() => {
    if (!items || !hash) return
    const el = document.getElementById(hash.slice(1))
    if (el instanceof HTMLDetailsElement) {
      el.open = true
      el.scrollIntoView({ block: 'start' })
    }
  }, [items, hash])

  return (
    <>
      <PageHeader
        title="دليلك المدرسي"
        intro="الإجراءات اليومية خطوة بخطوة: متى، وماذا يُفعل، والمسؤولة، والمرجع."
        icon={<Compass className="h-6 w-6" />}
      />

      <div className="mb-5 flex flex-wrap gap-3 text-xs text-ink-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sage-500" aria-hidden="true" />
          منصوص عليه في الدليل الرسمي
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-lav-400" aria-hidden="true" />
          تنظيم مدرسي
        </span>
      </div>

      {!items ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="space-y-3">
          {items.map((p) => {
            const c = contacts?.find((x) => x.id === p.contactId)
            return (
              <details key={p.id} id={p.id} className="group scroll-mt-24 rounded-2xl bg-white ring-1 ring-lav-100 open:shadow-soft">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 md:p-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lav-50 text-lav-700">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-bold text-ink-900">
                      {p.title}
                      {p.proposed && (
                        <span className="rounded-full border border-dashed border-lav-300 px-2 py-0.5 text-[11px] font-medium text-lav-700" title="إجراء مقترح بانتظار اعتماد إدارة المدرسة">
                          مقترح
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-500">{p.when}</span>
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-ink-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>

                <div className="border-t border-lav-50 px-4 pb-5 pt-4 md:px-5">
                  <h3 className="mb-2 text-sm font-semibold text-ink-500">الخطوات</h3>
                  <ol className="space-y-2">
                    {p.steps.map((s, i) => (
                      <li key={s.text} className="flex gap-3 text-[15px] leading-7 text-ink-800">
                        <span
                          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${s.basis === 'rule' ? 'bg-sage-500' : 'bg-lav-400'}`}
                          title={s.basis === 'rule' ? 'منصوص عليه في الدليل الرسمي' : 'تنظيم مدرسي'}
                        >
                          {i + 1}
                        </span>
                        <span>{s.text}</span>
                      </li>
                    ))}
                  </ol>

                  {p.requirements?.length ? (
                    <p className="mt-4 text-sm text-ink-700">
                      <span className="font-semibold">المتطلبات: </span>
                      {p.requirements.join('، ')}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-col gap-3 rounded-xl bg-lav-25 p-3 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      {c && (
                        <p className="text-sm text-ink-700">
                          <span className="font-semibold">المسؤولة: </span>
                          {c.role}
                          {c.name ? ` — ${c.name}` : ''}
                        </p>
                      )}
                      {p.source ? (
                        <SourceLink source={p.source} />
                      ) : (
                        <p className="text-xs text-ink-500">المرجع: تنظيم داخلي للمدرسة{p.proposed ? '، بانتظار اعتماد الإدارة' : ''}.</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.link && (
                        <a href={p.link.url} {...(p.link.url.startsWith('tel:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })} className="btn-ghost px-3 py-2 text-sm">
                          {p.link.label}
                          {!p.link.url.startsWith('tel:') && <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
                        </a>
                      )}
                      {c && (
                        <Link to={`/contact?to=${c.id}&topic=${encodeURIComponent(p.title)}`} className="btn-primary px-4 py-2 text-sm">
                          <Phone className="h-4 w-4" aria-hidden="true" />
                          التواصل
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      )}
    </>
  )
}
