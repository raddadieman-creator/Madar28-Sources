import { ExternalLink as ExternalIcon, FileText, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ContentStatus, ExternalLink } from '../../types/content'

/** شارة توضح أن المحتوى تجريبي ويحتاج اعتماد المدرسة */
export function DraftBadge({ status, className = '' }: { status?: ContentStatus; className?: string }) {
  if (status !== 'draft') return null
  return (
    <span
      className={`inline-flex items-center rounded-full border border-dashed border-lav-300 bg-lav-25 px-2 py-0.5 text-[11px] font-medium text-lav-700 ${className}`}
      title="محتوى تجريبي بانتظار اعتماد المدرسة"
    >
      تجريبي
    </span>
  )
}

export function PageHeader({
  title,
  intro,
  icon,
  children,
}: {
  title: string
  intro?: string
  icon?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="relative mb-8 overflow-hidden rounded-[1.75rem] bg-gradient-to-l from-lav-100 via-lav-50 to-sage-50 px-5 py-6 ring-1 ring-lav-100 md:mb-10 md:px-8 md:py-8">
      <div className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-lav-200/50 blur-2xl" aria-hidden="true" />
      <div className="relative flex items-center gap-4">
        {icon && (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lav-500 to-lav-700 text-white shadow-glow md:h-16 md:w-16">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold md:text-[2.1rem]">{title}</h1>
          {intro && <p className="mt-1.5 max-w-prose text-[15px] leading-7 text-ink-600">{intro}</p>}
        </div>
      </div>
      {children && <div className="relative">{children}</div>}
    </header>
  )
}

export function SectionTitle({ id, title, action, intro }: { id?: string; title: string; action?: ReactNode; intro?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="scroll-mt-28 text-lg font-extrabold md:text-[1.35rem]">
          {title}
        </h2>
        {intro && <p className="mt-1 text-sm text-ink-500">{intro}</p>}
      </div>
      {action}
    </div>
  )
}

export function ExternalButton({ link, variant = 'soft' }: { link: ExternalLink; variant?: 'soft' | 'primary' }) {
  const isTel = link.url.startsWith('tel:')
  return (
    <a
      href={link.url}
      {...(isTel ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      className={variant === 'primary' ? 'btn-primary' : 'btn-soft'}
    >
      {link.label}
      {!isTel && <ExternalIcon className="h-4 w-4" aria-hidden="true" />}
      {!isTel && <span className="sr-only">(يفتح في نافذة جديدة)</span>}
    </a>
  )
}

export function Notice({ children, tone = 'lav' }: { children: ReactNode; tone?: 'lav' | 'sage' }) {
  const cls = tone === 'sage' ? 'border-sage-200 bg-sage-50 text-sage-700' : 'border-lav-200 bg-lav-50 text-lav-800'
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${cls}`} role="note">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

export function PdfSlot({ label, url }: { label: string; url?: string }) {
  const base = import.meta.env.BASE_URL
  return url ? (
    <a href={url.startsWith('http') ? url : base + url} target="_blank" rel="noopener noreferrer" className="btn-soft">
      <FileText className="h-4 w-4" aria-hidden="true" />
      {label} (PDF)
    </a>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-ink-200 px-4 py-2.5 text-sm text-ink-500">
      <FileText className="h-4 w-4" aria-hidden="true" />
      {label} — يُرفع الملف بعد اعتماده
    </span>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-lav-200 bg-white/60 px-6 py-10 text-center">
      <p className="font-medium text-ink-800">{title}</p>
      {children && <div className="mt-2 text-sm text-ink-500">{children}</div>}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-lav-50 ${className}`} aria-hidden="true" />
}
