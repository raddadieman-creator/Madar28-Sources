import { Link } from 'react-router-dom'
import { useTitle } from '../hooks/useTitle'

export default function NotFound() {
  useTitle('الصفحة غير موجودة')
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="arch-top mx-auto flex h-32 w-28 items-end justify-center bg-gradient-to-b from-lav-100 to-sage-50 pb-6 text-4xl font-semibold text-lav-600">
        404
      </div>
      <h1 className="mt-6 text-2xl font-semibold">لم نجد هذه الصفحة</h1>
      <p className="mt-2 text-ink-600">ربما تغيّر الرابط. الرئيسية والبحث يوصلان إلى ما تحتاجه.</p>
      <Link to="/" className="btn-primary mt-6">
        العودة إلى الرئيسية
      </Link>
    </div>
  )
}
