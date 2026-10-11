import { X } from 'lucide-react'
import { useEffect } from 'react'
import { SearchBox } from '../SearchBox'

/** بحث ملء الشاشة للجوال */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-lav-25/95 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true" aria-label="بحث">
      <div className="sheet-enter flex items-start gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <SearchBox autoFocus onDone={onClose} />
        <button type="button" onClick={onClose} className="mt-1 rounded-xl p-2 text-ink-600 hover:bg-white" aria-label="إغلاق البحث">
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="px-5 pt-4 text-sm text-ink-500">أمثلة: النقل المدرسي، الغياب، موهبة، الاختبارات</p>
    </div>
  )
}
