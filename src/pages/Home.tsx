import { BookCheck, ChevronLeft, ExternalLink, MessageCircleHeart, Phone, ShieldCheck, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnnouncementItem } from '../components/AnnouncementItem'
import { EventRow } from '../components/EventRow'
import { RushdBot } from '../components/rushd/RushdBot'
import { useRushd } from '../components/rushd/RushdContext'
import { SearchBox } from '../components/SearchBox'
import { Icon } from '../components/ui/Icon'
import { DraftBadge, EmptyState, SectionTitle, Skeleton } from '../components/ui/primitives'
import { ValueCard } from '../components/ValueCard'
import { useContent } from '../hooks/useContent'
import { useTitle } from '../hooks/useTitle'
import { formatGregorian, formatHijri, startOfToday } from '../lib/dates'
import { activeAnnouncements, content, upcomingEvents, valueOfTheWeek } from '../services/contentService'
import schoolLogo from '../assets/logo.webp'

const SEARCH_HINTS = ['النقل المدرسي', 'الغياب بعذر', 'منصة مدرستي', 'موهبة', 'الاختبارات']

export default function Home() {
  useTitle()
  const { open } = useRushd()
  const { data: school } = useContent(content.school)
  const { data: services } = useContent(content.services)
  const { data: anns } = useContent(content.announcements)
  const { data: events } = useContent(content.events)
  const { data: values } = useContent(content.values)
  const { data: msg } = useContent(content.parentMessage)
  const { data: contacts } = useContent(content.contacts)

  const today = startOfToday()
  const quick = services?.filter((s) => s.quick) ?? []
  const announcements = anns ? activeAnnouncements(anns).slice(0, 4) : []
  const upcoming = events ? upcomingEvents(events, 4) : []
  const value = values ? valueOfTheWeek(values) : undefined
  const shortcuts = contacts?.filter((c) => ['counselor', 'attendance', 'madrasati', 'transport'].includes(c.id)) ?? []

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
              كيف نساعدك اليوم؟
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

      {/* الوصول السريع */}
      <section aria-labelledby="quick-title">
        <SectionTitle id="quick-title" title="الخدمات الأكثر استخدامًا" />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {quick.map((s, i) => {
            const tone = i % 2 === 0 ? 'bg-lav-100 text-lav-700 group-hover:bg-lav-600' : 'bg-sage-100 text-sage-700 group-hover:bg-sage-500'
            const inner = (
              <>
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors group-hover:text-white ${tone}`}>
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <span className="mt-4 flex items-center gap-1 text-base font-extrabold text-ink-900">
                  {s.title}
                  {s.url && <ExternalLink className="h-3.5 w-3.5 text-ink-400" aria-label="رابط خارجي" />}
                </span>
                <span className="mt-1 line-clamp-2 text-xs leading-5 text-ink-500">{s.summary}</span>
              </>
            )
            const cls =
              'group flex h-full flex-col rounded-3xl bg-white p-4 shadow-soft ring-1 ring-lav-100 transition-all hover:-translate-y-0.5 hover:shadow-lift md:p-5'
            return (
              <li key={s.id}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link to={s.to ?? '/services'} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {/* رُشد */}
      <section
        aria-labelledby="rushd-title-home"
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-lav-100 via-lav-50 to-sage-50 ring-1 ring-lav-100"
      >
        <div className="grid items-center gap-2 md:grid-cols-[minmax(0,1fr)_17rem] lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="order-2 p-6 pt-0 md:order-1 md:p-10">
            <h2 id="rushd-title-home" className="text-2xl font-semibold md:text-[1.75rem]">
              رُشد، مساعدكم في مدار 28
            </h2>
            <p className="mt-2 max-w-xl text-[15px] leading-8 text-ink-600">
              اسألوه بالكتابة أو بالصوت عن الغياب والنقل ومنصة مدرستي والاختبارات، فيجيبكم من أدلة المدرسة المعتمدة ويدلّكم على المسؤولة المختصة.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-ink-700 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, t: 'لا يطلب بيانات شخصية' },
                { icon: BookCheck, t: 'يجيب من المحتوى المعتمد' },
                { icon: Volume2, t: 'يقرأ الإجابة بصوت عربي' },
              ].map((f) => (
                <li key={f.t} className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-white">
                  <f.icon className="h-4 w-4 shrink-0 text-sage-600" aria-hidden="true" />
                  {f.t}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {['كيف أستأذن لابنتي؟', 'متى الاختبارات؟', 'نسيت كلمة مرور مدرستي'].map((q) => (
                <button key={q} type="button" className="chip bg-white/80" onClick={() => open(q)}>
                  {q}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => open()} className="btn-primary mt-6 px-6 py-3 text-base">
              تحدّثوا مع رُشد
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
                أهلًا! اسألوني
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

      {/* القيمة، والرسالة التربوية، والتواصل */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[0.9fr_1.1fr_1fr]">
        {value && <ValueCard value={value} />}

        {msg && (
          <section aria-labelledby="msg-title" className="flex flex-col rounded-3xl bg-sage-50 p-6 ring-1 ring-sage-100">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5 text-sage-600" aria-hidden="true" />
              <h2 id="msg-title" className="text-lg font-semibold">
                {msg.title}
              </h2>
              <DraftBadge status={msg.status} />
            </div>
            <p className="mt-4 text-[17px] leading-9 text-ink-800">{msg.body}</p>
            <Link to="/guidance/family" className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-sage-700 hover:text-sage-600">
              المزيد في الإرشاد الأسري
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        )}

        <section aria-labelledby="contact-title" className="rounded-3xl bg-white p-6 ring-1 ring-lav-100 md:col-span-2 xl:col-span-1">
          <h2 id="contact-title" className="text-lg font-semibold">
            لمن أتوجه؟
          </h2>
          <ul className="mt-4 divide-y divide-lav-50">
            {shortcuts.map((c) => (
              <li key={c.id}>
                <Link to={`/contact#${c.id}`} className="flex items-center gap-3 py-3 hover:text-lav-800">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lav-50 text-lav-700">
                    <Icon name={c.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{c.role}</span>
                    <span className="block truncate text-xs text-ink-500">{c.name ?? c.topics.slice(0, 3).join('، ')}</span>
                  </span>
                  <ChevronLeft className="h-4 w-4 text-ink-300" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn-soft mt-4 w-full">
            <Phone className="h-4 w-4" aria-hidden="true" />
            دليل التواصل كاملًا
          </Link>
        </section>
      </div>

    </div>
  )
}
