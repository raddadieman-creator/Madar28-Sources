import { BookOpenText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { findDoc } from '../data/library'
import type { SourceRef } from '../types/content'

/** نص المرجع المختصر: «قواعد السلوك والمواظبة 1447هـ – المادة 5، ص 17» */
export function sourceLabel(s: SourceRef): string {
  const d = findDoc(s.docId)
  if (!d) return ''
  const year = d.year.split('–')[0].trim()
  return [`${d.title} ${year}`, s.section, s.page ? `ص ${s.page}` : ''].filter(Boolean).join(' — ')
}

export function sourcePath(s: SourceRef): string {
  return `/library/${s.docId}${s.page ? `?p=${s.page}` : ''}`
}

/** إحالة قابلة للنقر تفتح الدليل داخل المنصة عند الموضع المذكور */
export function SourceLink({ source, onNavigate, className = '' }: { source: SourceRef; onNavigate?: () => void; className?: string }) {
  const label = sourceLabel(source)
  if (!label) return null
  return (
    <Link
      to={sourcePath(source)}
      onClick={onNavigate}
      className={`inline-flex items-start gap-1.5 text-xs leading-5 text-sage-700 underline-offset-4 hover:underline ${className}`}
    >
      <BookOpenText className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        <span className="font-semibold">المصدر:</span> {label}
      </span>
    </Link>
  )
}
