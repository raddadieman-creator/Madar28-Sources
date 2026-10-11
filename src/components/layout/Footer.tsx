import { Link } from 'react-router-dom'
import { school } from '../../data/school'
import { MadarIcon, MadarName } from '../brand/Madar'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-lav-100 px-4 py-8 text-sm text-ink-500 md:px-8 lg:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}logo-mark.webp`} alt="" width={36} height={36} className="h-9 w-9 rounded-lg bg-cream" loading="lazy" />
          <p>
            {school.fullName}
            <span className="block text-xs text-ink-400">إدارة التعليم بالمدينة المنورة</span>
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li><Link to="/about" className="hover:text-lav-700">عن المدرسة</Link></li>
          <li><Link to="/voice" className="hover:text-lav-700">صوتك مسموع</Link></li>
          <li><Link to="/contact" className="hover:text-lav-700">تواصل معنا</Link></li>
          <li><Link to="/privacy" className="hover:text-lav-700">الخصوصية</Link></li>
        </ul>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-lav-100 pt-5">
        <MadarIcon size={28} />
        <MadarName size="sm" />
        <span className="text-xs text-ink-400">{school.tagline} — نسخة تجريبية، والمحتوى المعلَّم «تجريبي» بانتظار اعتماد المدرسة.</span>
      </div>
    </footer>
  )
}
