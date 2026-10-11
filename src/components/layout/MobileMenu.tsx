import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { mainNav } from '../../data/navigation'
import { school } from '../../data/school'
import { Icon } from '../ui/Icon'

/** القائمة المنسدلة للجوال: جميع الأقسام مع وصف قصير */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="أقسام المنصة">
      <button type="button" className="absolute inset-0 bg-ink-900/25 backdrop-blur-[2px]" onClick={onClose} aria-label="إغلاق القائمة" tabIndex={-1} />
      <div className="sheet-enter absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-lift">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-lav-100" aria-hidden="true" />
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="font-semibold text-ink-900">أقسام المنصة</p>
          <button ref={closeRef} type="button" onClick={onClose} className="rounded-xl p-2 text-ink-600 hover:bg-lav-50" aria-label="إغلاق">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {mainNav.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-3 py-3 ${isActive ? 'bg-lav-50' : 'hover:bg-lav-25'}`
                  }
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lav-50 text-lav-700">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium text-ink-900">{item.label}</span>
                    {item.hint && <span className="block text-xs text-ink-500">{item.hint}</span>}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 px-1 text-center text-xs text-ink-400">{school.fullName}</p>
      </div>
    </div>
  )
}
