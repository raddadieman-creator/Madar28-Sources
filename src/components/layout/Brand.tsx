import { Link } from 'react-router-dom'
import { school } from '../../data/school'
import { MadarIcon, MadarName } from '../brand/Madar'

/** هوية المنصة في الشريط العلوي والقائمة الجانبية (شعار المدرسة الرسمي يظهر منفصلًا في الرئيسية والتذييل) */
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3 rounded-xl" aria-label={`${school.portalName} — الصفحة الرئيسية`}>
      <MadarIcon size={compact ? 40 : 46} className="shrink-0" />
      <span className="min-w-0 leading-tight">
        <MadarName size={compact ? 'sm' : 'md'} />
        <span className={`mt-1.5 block text-[11px] leading-snug text-ink-500 sm:text-xs ${compact ? 'truncate' : ''}`}>{school.tagline}</span>
      </span>
    </Link>
  )
}
