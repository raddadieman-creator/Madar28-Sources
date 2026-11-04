import { SideContactTab } from '../SideContactTab'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { House } from '../ui/hand'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { RushdPanel } from '../rushd/RushdPanel'
import { useRushd } from '../rushd/RushdContext'
import { RushdAvatar } from '../rushd/RushdAvatar'
import { RushdIntro } from '../rushd/RushdIntro'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { SearchOverlay } from './SearchOverlay'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

/** التمرير إلى أعلى الصفحة أو إلى القسم المحدد في الرابط (#) */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const t = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          if (el instanceof HTMLDetailsElement) el.open = true
        }
      }, 80)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

/**
 * ظهور ناعم عند التمرير: أقسام الصفحة وبطاقاتها تصعد قليلًا وتظهر حين تدخل الشاشة، متتابعة داخل كل مجموعة.
 * بلا IntersectionObserver (متصفح قديم) يظهر كل شيء فورًا.
 */
function RevealManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    // shown to everyone, «تقليل الحركة» included (Abood, 2026-10-22); only a browser without IntersectionObserver skips it
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target) }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    const t = window.setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>('#main section > *, #main ul > li, #main ol > li')
      els.forEach((el) => {
        if (el.classList.contains('rv') || el.closest('[data-no-reveal]')) return
        const i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0
        el.style.setProperty('--rv-delay', `${Math.min(i, 8) * 55}ms`)
        el.classList.add('rv')
        io.observe(el)
      })
    }, 60)
    return () => { window.clearTimeout(t); io.disconnect() }
  }, [pathname])
  return null
}

export function AppLayout() {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const { isOpen, open, close } = useRushd()
  const { pathname } = useLocation()

  // على الجوال تغطي نافذة رُشد الشاشة؛ نغلقها عند الانتقال لصفحة أخرى (ومنها زر الرجوع)
  useEffect(() => {
    if (window.innerWidth < 768) close()
    setMenu(false)
  }, [pathname, close])
  const closeMenu = useCallback(() => setMenu(false), [])
  const closeSearch = useCallback(() => setSearch(false), [])
  const [hint, setHint] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem('rushd-hint') === '1'
      sessionStorage.setItem('rushd-hint', '1')
    } catch {
      /* التخزين غير متاح؛ نعرض التحية مرة واحدة فقط في هذه الزيارة */
    }
    if (seen) return
    const show = setTimeout(() => setHint(true), 1400)
    const hide = setTimeout(() => setHint(false), 8000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  return (
    <div className="flex min-h-screen">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }} className="sr-only z-50 rounded-xl bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
        تخطَّ إلى المحتوى
      </a>
      <ScrollManager />
      <RevealManager />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setMenu(true)} onSearch={() => setSearch(true)} />
        <main id="main" tabIndex={-1} className="flex-1 px-4 pb-28 pt-6 outline-none md:px-8 lg:px-10 lg:pb-12 lg:pt-8">
          <div key={pathname} className="page-enter mx-auto w-full max-w-6xl">
            {pathname !== '/' && (
              <Link
                to="/"
                className="group mb-5 inline-flex items-center gap-2 rounded-full bg-white py-1.5 pe-4 ps-2 text-sm font-medium text-ink-700 shadow-soft ring-1 ring-lav-100 transition-colors hover:text-lav-800 hover:ring-lav-300"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lav-50 text-lav-700 transition-colors group-hover:bg-lav-600 group-hover:text-white">
                  <House className="h-4 w-4" aria-hidden="true" />
                </span>
                العودة إلى الرئيسية
              </Link>
            )}
            <Suspense fallback={<div className="h-64" aria-busy="true" />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>

      <BottomNav onMore={() => setMenu(true)} />
      <MobileMenu open={menu} onClose={closeMenu} />
      <SearchOverlay open={search} onClose={closeSearch} />
      <SideContactTab />

      {/* تحية رُشد مرة واحدة في الزيارة: يطلّ ويمشي ويلوّح ويقول «مرحبا» */}
      {!isOpen && <RushdIntro show={hint} onOpen={() => { setHint(false); open() }} />}
      {/* زر رُشد العائم للشاشات الكبيرة */}
      {!isOpen && (
        <div className="fixed bottom-6 end-6 z-30 hidden flex-col items-end gap-2 lg:flex">
          <button
            type="button"
            onClick={() => {
              setHint(false)
              open()
            }}
            className="flex items-center gap-2 rounded-full bg-white py-1.5 pe-5 ps-1.5 text-sm font-semibold text-ink-800 shadow-lift ring-1 ring-lav-100 transition-transform hover:-translate-y-0.5"
          >
            <span className="rounded-full bg-lav-50 p-0.5">
              <RushdAvatar size={42} />
            </span>
            اسأل رُشد
          </button>
        </div>
      )}
      <RushdPanel />
    </div>
  )
}
