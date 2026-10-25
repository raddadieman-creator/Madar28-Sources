import { Phone } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

/** زر «تواصل معنا» ثابت على جانب الشاشة */
export function SideContactTab() {
  const { pathname } = useLocation()
  if (pathname === '/contact') return null
  return (
    <Link
      to="/contact"
      className="fixed end-0 top-1/2 z-30 hidden -translate-y-1/2 md:flex flex-col items-center gap-2 rounded-s-2xl bg-lav-600 px-2 py-4 text-white shadow-glow transition hover:bg-lav-700 md:px-2.5 md:py-5"
      aria-label="تواصل معنا"
    >
      <Phone className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
      <span className="text-xs font-bold md:text-sm" style={{ writingMode: 'vertical-rl' }}>
        تواصل معنا
      </span>
    </Link>
  )
}
