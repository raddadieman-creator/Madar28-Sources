import { ChevronLeft, Compass, ExternalLink, Library, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnnouncementItem } from '../components/AnnouncementItem'
import { EventRow } from '../components/EventRow'
import { RushdBot } from '../components/rushd/RushdBot'
import { useRushd } from '../components/rushd/RushdContext'
import { SearchBox } from '../components/SearchBox'
import { EmptyState, SectionTitle, Skeleton } from '../components/ui/primitives'
import { officialLinks, telegramGroup } from '../data/links'
import { ValueCard } from '../components/ValueCard'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { formatGregorian, formatHijri, startOfToday } from '../lib/dates'
import { activeAnnouncements, content, upcomingEvents, valueOfTheWeek } from '../services/contentService'
import schoolLogo from '../assets/logo.webp'

const SEARCH_HINTS = ['قواعد السلوك', 'الغياب', 'درجات السلوك', 'التنمر', 'منصة مدرستي']

type PanelLink = { label: string; to?: string; href?: string }
const PANELS: { title: string; hint: string; to: string; cta: string; icon: typeof Library; tone: string; links: PanelLink[] }[] = [
  {
    title: 'الأدلة والأنظمة',
    hint: 'تُقرأ داخل المنصة',
    to: '/library',
    cta: 'كل الأدلة',
    icon: Library,
    tone: 'bg-lav-100 text-lav-700',
    links: [
      { label: 'قواعد السلوك والمواظبة 1447هـ', to: '/library/behavior-1447' },
      { label: 'السلوك المتميز', to: '/guidance/excellent-behavior' },
      { label: 'معًا ضد التنمر', to: '/guidance/bullying' },
      { label: 'افهمي ابنتك', to: '/guidance/growth' },
    ],
  },
  {
    title: 'دليلك المدرسي',
    hint: 'الإجراءات خطوة بخطوة',
    to: '/procedures',
    cta: 'كل الإجراءات',
    icon: Compass,
    tone: 'bg-sage-100 text-sage-700',
    links: [
      { label: 'التأخر الصباحي', to: '/procedures#late' },
      { label: 'الغياب', to: '/procedures#absence' },
      { label: 'تعويض درجات السلوك', to: '/procedures#behavior-points' },
      { label: 'اختبارات نافس', to: '/nafs' },
    ],
  },
  {
    title: 'مركز التواصل',
    hint: 'المسؤولة المختصة مباشرة',
    to: '/contact',
    cta: 'دليل المسؤولات',
    icon: Phone,
    tone: 'bg-lav-100 text-lav-700',
    links: [
      { label: 'إرسال استفسار', to: '/contact?kind=inquiry' },
      { label: 'طلب موعد', to: '/contact?kind=appointment' },
      { label: 'ملاحظة أو اقتراح', to: '/contact?kind=suggestion' },
      { label: telegramGroup.action + ': التوجيه الطلابي', href: telegramGroup.url },
    ],
  },
]

export default function Home() {
  useTitle()
  const { open } = useRushd()
  const { data: school } = useContent(content.school)
  const { data: anns } = useContent(content.announcements)
  const { data: events } = useContent(content.events)
  const { data: values } = useContent(content.values)

  const today = startOfToday()
  const announcements = anns ? activeAnnouncements(anns).slice(0, 4) : []
  const upcoming = events ? upcomingEvents(events, 4) : []
  const value = values ? valueOfTheWeek(values) : undefined

  return (
    <div className="space-y-14 md:space-y-16">
      {/* البطل: لوحة خزامى بتدرج هادئ، والبحث في قلبها، وشعار المدرسة في قوس */}
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-bl from-lav-800 via-lav-600 to-lav-500 px-5 pb-8 pt-7 text-white shadow-glow md:px-10 md:pb-12 md:pt-10"
      >
        <div className="pointer-events-none absolute -start-24 -top-24 h-72 w-72 rounded-full bg-sage-300/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 end-10 h-80 w-80 rounded-full bg-lav-300/40 blur-3xl" aria-hidden="true" />
        <svg viewBox="0 0 400 400" className="pointer-events-none absolute -end-24 -top-20 h-[26rem] w-[26rem] opacity-30" aria-hidden="true">
          <circle cx="200" cy="200" r="190" fill="none" stroke="#fff" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="3 8" />
          <circle cx="352" cy="88" r="7" fill="#C5DEC9" />
        </svg>

        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
          <div className="order-2 md:order-1">
            <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs text-white/90 ring-1 ring-white/20 md:text-sm lg:hidden">
              <time dateTime={today.toISOString()}>
                {formatHijri(today, true)} — {formatGregorian(today)}
              </time>
            </p>
            <h1 id="hero-title" className="mt-4 text-[2.1rem] lg:mt-0 font-extrabold leading-tight text-white md:text-[3.25rem] md:leading-[1.2]">
              مرحبًا بك في مدار 28
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-8 text-white/85 md:text-[17px]">{school?.welcome}</p>
            <div className="mt-7 max-w-2xl">
              <SearchBox size="lg" placeholder="البحث في المنصة" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-white/75">الأكثر بحثًا:</span>
              {SEARCH_HINTS.map((h) => (
                <Link
                  key={h}
                  to={`/search?q=${encodeURIComponent(h)}`}
                  className="rounded-full bg-white/15 px-3 py-1.5 text-sm text-white ring-1 ring-white/25 transition-colors hover:bg-white/25"
                >
                  {h}
                </Link>
              ))}
            </div>
            <Link
              to="/contact"
              className="group mt-7 inline-flex items-center gap-3 rounded-2xl bg-sage-100 py-2.5 pe-5 ps-2.5 text-ink-900 shadow-lift transition-colors hover:bg-white"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-500 text-white transition-colors group-hover:bg-sage-600">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-bold">التواصل مع المدرسة</span>
                <span className="block text-xs text-ink-600">المسؤولة المختصة بكل موضوع</span>
              </span>
            </Link>
          </div>
          <div className="order-1 mx-auto md:order-2">
            <div className="arch-top w-40 overflow-hidden bg-cream p-3 shadow-lift ring-4 ring-white/25 md:w-60">
              <img
                src={schoolLogo}
                alt={`شعار ${school?.fullName ?? 'المدرسة'}`}
                width={512}
                height={512}
                className="aspect-square w-full object-contain"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* اللوحات الثلاث: أدلة، إجراءات، تواصل */}
      <section aria-label="أقسام المنصة" className="grid gap-4 md:grid-cols-3">
        {PANELS.map((p) => (
          <article key={p.title} className="flex flex-col rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-lav-100 md:p-6">
            <div className="flex items-center gap-3">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.tone}`}>
                <p.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold">
                  <Link to={p.to} className="hover:text-lav-800">
                    {p.title}
                  </Link>
                </h2>
                <p className="text-xs text-ink-500">{p.hint}</p>
              </div>
            </div>
            <ul className="mt-4 flex-1 divide-y divide-lav-50">
              {p.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2.5 text-[15px] text-ink-800 hover:text-lav-800">
                      <span className="flex-1">{l.label}</span>
                      <ExternalLink className="h-4 w-4 text-ink-300" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link to={l.to!} className="flex items-center gap-2 py-2.5 text-[15px] text-ink-800 hover:text-lav-800">
                      <span className="flex-1">{l.label}</span>
                      <ChevronLeft className="h-4 w-4 text-ink-300" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <Link to={p.to} className="btn-soft mt-4 w-full">
              {p.cta}
            </Link>
          </article>
        ))}
      </section>

      {/* المنصات الرسمية */}
      <section aria-label="المنصات الرسمية" className="-mt-6 flex flex-wrap items-center gap-2 md:-mt-8">
        <span className="text-sm text-ink-500">منصات رسمية:</span>
        {Object.values(officialLinks).map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            title={l.note}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink-800 ring-1 ring-lav-100 hover:ring-lav-300"
          >
            {l.label}
            <ExternalLink className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
          </a>
        ))}
      </section>

      {/* رُشد */}
      <section
        aria-labelledby="rushd-title-home"
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-lav-100 via-lav-50 to-sage-50 ring-1 ring-lav-100"
      >
        <div className="grid items-center gap-2 md:grid-cols-[minmax(0,1fr)_17rem] lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="order-2 p-6 pt-0 md:order-1 md:p-10">
            <h2 id="rushd-title-home" className="text-3xl font-extrabold md:text-4xl">
              رُشد
            </h2>
            <p className="mt-2 text-lg text-ink-600">مساعدك في مدار 28</p>
            <button type="button" onClick={() => open()} className="btn-primary mt-6 px-7 py-3 text-base">
              اسأل رُشد
            </button>
          </div>

          {/* منصة العرض: رُشد في قلب المدار */}
          <div className="relative order-1 flex h-64 items-center justify-center md:order-2 md:h-full md:min-h-[22rem]">
            <svg viewBox="0 0 300 300" className="pointer-events-none absolute h-[19rem] w-[19rem] md:h-[21rem] md:w-[21rem]" aria-hidden="true">
              <circle cx="150" cy="150" r="138" fill="none" stroke="#DBD2F0" strokeWidth="1.2" />
              <circle cx="150" cy="150" r="104" fill="none" stroke="#CADDC6" strokeWidth="1.2" strokeDasharray="4 7" />
              <circle cx="150" cy="150" r="70" fill="#FBFAFE" opacity=".7" />
              <circle cx="262" cy="70" r="6" fill="#A391D2" />
              <circle cx="52" cy="214" r="4.5" fill="#86AD7F" />
            </svg>
            <div className="relative">
              <p className="bubble-in absolute -top-6 end-[72%] whitespace-nowrap rounded-2xl rounded-ee-sm bg-white px-3.5 py-2 text-sm font-medium text-ink-800 shadow-soft ring-1 ring-lav-100">
                أهلًا بك
              </p>
              <div className="rushd-float">
                <RushdBot size={150} body />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الإعلانات والمناسبات */}
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        <section aria-labelledby="ann-title">
          <SectionTitle id="ann-title" title="أحدث الإعلانات" />
          {!anns ? (
            <Skeleton className="h-64" />
          ) : announcements.length ? (
            <div className="space-y-2 rounded-3xl bg-white p-2 ring-1 ring-lav-100">
              {announcements.map((a) => (
                <AnnouncementItem key={a.id} a={a} />
              ))}
            </div>
          ) : (
            <EmptyState title="لا توجد إعلانات حالية" />
          )}
        </section>

        <section aria-labelledby="events-title">
          <SectionTitle
            id="events-title"
            title="المناسبات القادمة"
            action={
              <Link to="/events" className="inline-flex items-center gap-1 text-sm font-medium text-lav-700 hover:text-lav-800">
                التقويم كاملًا
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          {!events ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="space-y-3">
              {upcoming.map((ev) => (
                <EventRow key={ev.id} ev={ev} compact />
              ))}
            </div>
          )}
        </section>
      </div>

      {value && <ValueCard value={value} />}

    </div>
  )
}
