import { BarChart3, BookOpenText, Calculator, ExternalLink, FlaskConical, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/primitives'
import { useTitle } from '../hooks/useTitle'

/**
 * اختبارات «نافس» الوطنية.
 * المصدر: الموقع الرسمي للاختبارات الوطنية nafs.etec.gov.sa (تم الاطلاع في 12 أكتوبر 2026)،
 * وخبر واس عن منصة «مستقبلهم» (24 شعبان 1445هـ).
 */
const NAFS = 'https://nafs.etec.gov.sa/'
const MUSTAQBALHUM = 'https://mustaqbalhum.etec.gov.sa/'
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

const SUBJECTS = [
  { name: 'القراءة', icon: BookOpenText },
  { name: 'الرياضيات', icon: Calculator },
  { name: 'العلوم', icon: FlaskConical },
]

export default function Nafs() {
  useTitle('اختبارات نافس')
  return (
    <>
      <PageHeader title="اختبارات نافس" intro="الاختبارات الوطنية لطالبات الصف الثالث المتوسط." icon={<Target className="h-6 w-6" />} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <section aria-labelledby="what" className="rounded-3xl bg-white p-6 ring-1 ring-lav-100">
            <h2 id="what" className="text-lg font-bold">
              ما «نافس»؟
            </h2>
            <p className="mt-2 text-[15px] leading-8 text-ink-700">
              اختبارات وطنية تنفذها وزارة التعليم بالتعاون مع هيئة تقويم التعليم والتدريب، لقياس التحصيل التعليمي وتحسينه، وتحفيز التميز والتنافس الإيجابي بين المدارس.
            </p>
          </section>

          <section aria-labelledby="who" className="rounded-3xl bg-white p-6 ring-1 ring-lav-100">
            <h2 id="who" className="text-lg font-bold">
              من تشمل في مدرستنا؟
            </h2>
            <p className="mt-2 text-[15px] leading-8 text-ink-700">جميع فصول الصف الثالث المتوسط، في المواد الثلاث:</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {SUBJECTS.map((s) => (
                <li key={s.name} className="flex items-center gap-3 rounded-2xl bg-lav-50 px-4 py-3 font-bold text-ink-900">
                  <s.icon className="h-5 w-5 text-lav-600" aria-hidden="true" />
                  {s.name}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="prep" className="rounded-3xl bg-white p-6 ring-1 ring-lav-100">
            <h2 id="prep" className="text-lg font-bold">
              الاستعداد والمتابعة
            </h2>
            <ul className="prose-ar mt-2 text-[15px] text-ink-700">
              <li>
                منصة «مستقبلهم» من هيئة تقويم التعليم والتدريب تتيح لولي الأمر الاطلاع على نتائج الاختبارات الرسمية وتقارير الأداء، وتدريب الأبناء على المقاييس.
              </li>
              <li>أدلة الاختبارات، ومنها دليل أولياء الأمور ودليل الطالب، منشورة في الموقع الرسمي لنافس.</li>
              <li>ويُبلَّغ ولي الأمر برسالة نصية عند طرح استبانة ولي الأمر عبر منصة الهيئة.</li>
            </ul>
            <p className="mt-4 text-sm leading-7 text-ink-600">
              ولتثبيت المهارات خلال العام:{' '}
              <Link to="/guidance/exams" className="font-semibold text-lav-700 underline underline-offset-4">
                الاستعداد للاختبارات
              </Link>
              .
            </p>
          </section>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <a href={NAFS} {...ext} className="flex items-center gap-3 rounded-2xl bg-lav-600 p-4 text-white shadow-glow hover:bg-lav-700">
            <Target className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-bold">موقع نافس الرسمي</span>
              <span className="block text-xs text-white/80">الأدلة والمعلومات المعتمدة</span>
            </span>
            <ExternalLink className="h-4 w-4 opacity-70" aria-hidden="true" />
          </a>
          <a href={MUSTAQBALHUM} {...ext} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-lav-100 hover:ring-lav-300">
            <BarChart3 className="h-6 w-6 shrink-0 text-lav-600" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-bold text-ink-900">منصة مستقبلهم</span>
              <span className="block text-xs text-ink-500">النتائج وتقارير الأداء والتدريب</span>
            </span>
            <ExternalLink className="h-4 w-4 text-ink-400" aria-hidden="true" />
          </a>
          <p className="px-1 text-xs leading-6 text-ink-500">المصدر: الموقع الرسمي للاختبارات الوطنية «نافس» — هيئة تقويم التعليم والتدريب.</p>
        </aside>
      </div>
    </>
  )
}
