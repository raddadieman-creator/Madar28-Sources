import { Menu, Phone, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatGregorian, formatHijri, startOfToday } from '../../lib/dates'
import { SearchBox } from '../SearchBox'
import { Brand } from './Brand'

export function TopBar({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) {
  const today = startOfToday()
  return (
    <header className="sticky top-0 z-30 border-b border-lav-100/80 bg-lav-25/85 backdrop-blur-md">
      {/* الجوال والتابلت */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 lg:hidden">
        <Brand compact />
        <div className="flex items-center gap-1">
          <button type="button" onClick={onSearch} className="rounded-xl p-2.5 text-ink-700 hover:bg-lav-50" aria-label="بحث">
            <Search className="h-5 w-5" />
          </button>
          <button type="button" onClick={onMenu} className="rounded-xl p-2.5 text-ink-700 hover:bg-lav-50" aria-label="القائمة">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* الشاشات الكبيرة */}
      <div className="hidden items-center gap-6 px-8 py-3 lg:flex">
        <div className="w-full max-w-md">
          <SearchBox />
        </div>
        <p className="ms-auto whitespace-nowrap text-sm text-ink-500">
          <time dateTime={today.toISOString()}>
            {formatHijri(today, true)} <span className="text-ink-300">|</span> {formatGregorian(today)}
          </time>
        </p>
        <Link to="/contact" className="btn-soft whitespace-nowrap">
          <Phone className="h-4 w-4" aria-hidden="true" />
          مركز التواصل
        </Link>
      </div>
    </header>
  )
}
