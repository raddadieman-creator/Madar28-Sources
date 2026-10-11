/**
 * هوية المنصة «مدار 28» — مستقلة عن شعار المدرسة الرسمي.
 * الأيقونة: نواة (الطالبة) في حلقة داخلية (المدرسة)، يحيط بهما مدار مفتوح (الأسرة والمجتمع)
 * ونقطة عند طرف المدار ترمز إلى الحركة والترابط المستمر.
 */
export function MadarIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="14" fill="#F5F2FB" />
      <circle cx="24" cy="24" r="15" fill="none" stroke="#7059AA" strokeWidth="3" strokeLinecap="round" strokeDasharray="76 18.2" transform="rotate(-62 24 24)" />
      <circle cx="24" cy="24" r="8.2" fill="none" stroke="#A9C6A3" strokeWidth="2.2" />
      <circle cx="24" cy="24" r="3.4" fill="#1A4C50" />
      <circle cx="36.9" cy="16.3" r="3.3" fill="#86AD7F" stroke="#F5F2FB" strokeWidth="1.5" />
    </svg>
  )
}

/** المعالجة الطباعية لاسم «مدار 28»: الرقم داخل مدار بيضاوي مائل */
export function MadarName({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const text = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-lg' : 'text-base'
  const num = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-[15px]' : 'text-sm'
  return (
    <span className={`inline-flex items-baseline gap-1.5 font-semibold leading-none text-ink-900 ${text}`} aria-label="مدار 28">
      <span aria-hidden="true">مدار</span>
      <span aria-hidden="true" className={`relative inline-block px-1.5 font-semibold tracking-tight text-lav-700 ${num}`} dir="ltr">
        <svg viewBox="0 0 40 24" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-1 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+0.5rem)] overflow-visible">
          <ellipse cx="20" cy="12" rx="18.5" ry="9" transform="rotate(-14 20 12)" fill="none" stroke="#A9C6A3" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          <circle cx="36.6" cy="6.4" r="2.1" fill="#679060" />
        </svg>
        <span className="relative">28</span>
      </span>
    </span>
  )
}
