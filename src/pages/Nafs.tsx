import {
  BarChart3,
  BookOpenText,
  Calculator,
  ClipboardCheck,
  ExternalLink,
  FileText,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  MonitorPlay,
  Target,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/primitives'
import { useTitle } from '../hooks/useTitle'

/**
 * اختبارات «نافس» الوطنية.
 * جميع الروابط رسمية، وتم التحقق منها في 12 أكتوبر 2026:
 * - صفحة البرنامج في هيئة تقويم التعليم والتدريب: etec.gov.sa/ar/programs/nafs
 *   (منها نماذج التهيئة والأدلة ووثيقة نواتج التعلم، على media.etec.gov.sa)
 * - منصة عين ومنصة مدرستي: منصتا وزارة التعليم.
 * لا تُضاف هنا مواقع تجارية أو غير رسمية.
 */
const ETEC_NAFS = 'https://etec.gov.sa/ar/programs/nafs'
const NAFS = 'https://nafs.etec.gov.sa/'
const MUSTAQBALHUM = 'https://mustaqbalhum.etec.gov.sa/'
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

const SUBJECTS = [
  { name: 'القراءة', icon: BookOpenText },
  { name: 'الرياضيات', icon: Calculator },
  { name: 'العلوم', icon: FlaskConical },
]

const FORMS = [
  {
    title: 'نموذج التهيئة (أ)',
    meta: '26 سؤالًا: رياضيات، علوم، قراءة — مع مفتاح الإجابة',
    url: 'https://media.etec.gov.sa/media/zhpbzrhn/preparation-form-a-9thgrade-ar.pdf',
  },
  {
    title: 'نموذج التهيئة (ب)',
    meta: '27 سؤالًا: رياضيات، علوم، قراءة — مع مفتاح الإجابة',
    url: 'https://media.etec.gov.sa/media/yn3l35gc/preparation-form-b-9thgrade-ar.pdf',
  },
]

const GUIDES = [
  {
    title: 'دليل الطالب الإرشادي',
    meta: 'شكل الاختبار وعدد الأسئلة وزمن كل جزء',
    url: 'https://media.etec.gov.sa/media/pkdlx5uz/دليل-الطالب-الإرشادي-لاختبارات-نافس.pdf',
  },
  {
    title: 'الدليل الإرشادي لأولياء الأمور',
    meta: 'دور الأسرة قبل الاختبار وفي يومه وبعد النتائج',
    url: 'https://media.etec.gov.sa/media/e2dhyiyq/دليل-ولي-الأمر-اختبارات-نافس.pdf',
  },
  {
    title: 'وثيقة نواتج التعلم 2026',
    meta: 'المهارات التي يقيسها الاختبار في كل مادة',
    url: 'https://media.etec.gov.sa/media/sszdnh2h/نواتج-التعلم-2026.pdf',
  },
]

const PLATFORMS = [
  {
    title: 'منصة عين',
    meta: 'شروح مجانية لدروس المنهج من وزارة التعليم',
    url: 'https://ien.edu.sa',
    icon: MonitorPlay,
  },
  {
    title: 'منصة مدرستي',
    meta: 'دروس المنهج والواجبات والاختبارات القصيرة',
    url: 'https://schools.madrasati.sa',
    icon: GraduationCap,
  },
]

const TIPS = [
  'مراجعة موضوعات القراءة والرياضيات والعلوم في الكتب المدرسية.',
  'حل نموذجَي التهيئة والتعرّف على شكل كراسة الاختبار.',
  'جميع الأسئلة من نوع الاختيار من متعدد؛ يُقرأ كل سؤال بعناية، ولا يُترك سؤال دون إجابة.',
  'الإصغاء لتعليمات المراقِبة، وعدم التسرع في تسليم الكراسة.',
  'الحرص على الحضور في أيام الاختبار.',
]

function ResourceLink({ title, meta, url, icon: I = FileText }: { title: string; meta: string; url: string; icon?: typeof FileText }) {
  return (
    <a href={url} {...ext} className="group flex items-center gap-3 rounded-2xl bg-lav-50/60 p-4 ring-1 ring-lav-100 transition hover:bg-white hover:ring-lav-300">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lav-600 ring-1 ring-lav-100">
        <I className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-ink-900">{title}</span>
        <span className="block text-xs leading-6 text-ink-500">{meta}</span>
      </span>
      <ExternalLink className="h-4 w-4 shrink-0 text-ink-400 group-hover:text-lav-600" aria-hidden="true" />
    </a>
  )
}

export default function Nafs() {
  useTitle('اختبارات نافس')
  return (
    <>
      <PageHeader title="اختبارات نافس" intro="الاختبارات الوطنية لطالبات الصف الثالث المتوسط، ونماذجها التدريبية الرسمية." icon={<Target className="h-6 w-6" />} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <section aria-labelledby="what" className="rounded-3xl bg-white p-6 ring-1 ring-lav-100">
            <h2 id="what" className="text-lg font-bold">
              ما «نافس»؟
            </h2>
            <p className="mt-2 text-[15px] leading-8 text-ink-700">
              اختبارات وطنية تنفذها وزارة التعليم بالتعاون مع هيئة تقويم التعليم والتدريب، لقياس التحصيل التعليمي وتحسينه، وتحفيز التميز والتنافس الإيجابي بين المدارس.
            </p>
            <p className="mt-3 text-[15px] leading-8 text-ink-700">تشمل في مدرستنا جميع فصول الصف الثالث المتوسط، في المواد الثلاث:</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {SUBJECTS.map((s) => (
                <li key={s.name} className="flex items-center gap-3 rounded-2xl bg-lav-50 px-4 py-3 font-bold text-ink-900">
                  <s.icon className="h-5 w-5 text-lav-600" aria-hidden="true" />
                  {s.name}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="forms" className="rounded-3xl bg-white p-6 ring-1 ring-lav-100">
            <h2 id="forms" className="flex items-center gap-2 text-lg font-bold">
              <ClipboardCheck className="h-5 w-5 text-lav-600" aria-hidden="true" />
              نماذج تدريبية رسمية
            </h2>
            <p className="mt-1 text-sm leading-7 text-ink-600">نموذجان للصف الثالث المتوسط من هيئة تقويم التعليم والتدريب، بصيغة PDF.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {FORMS.map((f) => (
                <ResourceLink key={f.url} {...f} icon={ClipboardCheck} />
              ))}
            </div>
          </section>

          <section aria-labelledby="guides" className="rounded-3xl bg-white p-6 ring-1 ring-lav-100">
            <h2 id="guides" className="flex items-center gap-2 text-lg font-bold">
              <FileText className="h-5 w-5 text-lav-600" aria-hidden="true" />
              الأدلة الرسمية
            </h2>
            <div className="mt-4 grid gap-3">
              {GUIDES.map((g) => (
                <ResourceLink key={g.url} {...g} />
              ))}
            </div>
          </section>

          <section aria-labelledby="platforms" className="rounded-3xl bg-white p-6 ring-1 ring-lav-100">
            <h2 id="platforms" className="flex items-center gap-2 text-lg font-bold">
              <MonitorPlay className="h-5 w-5 text-lav-600" aria-hidden="true" />
              منصات مجانية للشرح والمراجعة
            </h2>
            <p className="mt-1 text-sm leading-7 text-ink-600">منصتان رسميتان من وزارة التعليم.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PLATFORMS.map((p) => (
                <ResourceLink key={p.url} {...p} />
              ))}
            </div>
          </section>

          <section aria-labelledby="tips" className="rounded-3xl bg-white p-6 ring-1 ring-lav-100">
            <h2 id="tips" className="flex items-center gap-2 text-lg font-bold">
              <Lightbulb className="h-5 w-5 text-lav-600" aria-hidden="true" />
              الاستعداد للاختبار
            </h2>
            <ul className="prose-ar mt-2 text-[15px] text-ink-700">
              {TIPS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-500">من دليل الطالب ودليل أولياء الأمور الصادرين عن هيئة تقويم التعليم والتدريب.</p>
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
          <a href={ETEC_NAFS} {...ext} className="flex items-center gap-3 rounded-2xl bg-lav-600 p-4 text-white shadow-glow hover:bg-lav-700">
            <Target className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-bold">صفحة نافس في الهيئة</span>
              <span className="block text-xs text-white/80">النماذج والأدلة والجدول الزمني</span>
            </span>
            <ExternalLink className="h-4 w-4 opacity-70" aria-hidden="true" />
          </a>
          <a href={NAFS} {...ext} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-lav-100 hover:ring-lav-300">
            <BookOpenText className="h-6 w-6 shrink-0 text-lav-600" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-bold text-ink-900">موقع نافس</span>
              <span className="block text-xs text-ink-500">التعريف بالاختبارات والأسئلة الشائعة</span>
            </span>
            <ExternalLink className="h-4 w-4 text-ink-400" aria-hidden="true" />
          </a>
          <a href={MUSTAQBALHUM} {...ext} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-lav-100 hover:ring-lav-300">
            <BarChart3 className="h-6 w-6 shrink-0 text-lav-600" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-bold text-ink-900">منصة مستقبلهم</span>
              <span className="block text-xs text-ink-500">النتائج وتقارير الأداء لولي الأمر</span>
            </span>
            <ExternalLink className="h-4 w-4 text-ink-400" aria-hidden="true" />
          </a>
          <p className="px-1 text-xs leading-6 text-ink-500">جميع الروابط في هذه الصفحة رسمية، من هيئة تقويم التعليم والتدريب ووزارة التعليم.</p>
        </aside>
      </div>
    </>
  )
}
