import { Copy, Lightbulb, MessageCircleHeart, NotebookPen, Rocket, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Notice, PageHeader } from '../components/ui/primitives'
import { useTitle } from '../hooks/useTitle'
import { detectSensitive, sensitiveLabel } from '../lib/privacy'
import { SUGGESTIONS_ENABLED } from '../services/config'
import { submitSuggestion, type SubmitResult, type SuggestionCategory, type SuggestionInput } from '../services/suggestionsService'

const CATS: { id: SuggestionCategory; icon: typeof Lightbulb; hint: string }[] = [
  { id: 'فكرة', icon: Lightbulb, hint: 'اقتراح لتطوير خدمة أو نشاط' },
  { id: 'ملاحظة', icon: NotebookPen, hint: 'شيء لاحظتموه ويحتاج اهتمامًا' },
  { id: 'مبادرة', icon: Rocket, hint: 'مبادرة تودون المشاركة فيها' },
]

const TITLE_MAX = 80
const DETAILS_MAX = 800

export default function Voice() {
  useTitle('صوتك مسموع')
  const [form, setForm] = useState<SuggestionInput>({ category: 'فكرة', title: '', details: '', senderType: '' })
  const [errors, setErrors] = useState<Partial<Record<'title' | 'details', string>>>({})
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  const sensitive = detectSensitive(`${form.title} ${form.details}`)

  function validate() {
    const e: typeof errors = {}
    if (form.title.trim().length < 4) e.title = 'العنوان قصير؛ المطلوب 4 أحرف على الأقل.'
    if (form.details.trim().length < 15) e.details = 'التفاصيل قصيرة؛ المطلوب 15 حرفًا على الأقل.'
    setErrors(e)
    return !Object.keys(e).length
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || sensitive.length) return
    setBusy(true)
    setResult(await submitSuggestion(form))
    setBusy(false)
  }

  async function copyText() {
    const text = `${form.category}: ${form.title}\n\n${form.details}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* المتصفح لا يسمح بالنسخ */
    }
  }

  return (
    <>
      <PageHeader
        title="صوتك مسموع"
        intro="أفكاركم وملاحظاتكم تساعدنا على التطوير. شاركونا بما ترونه مفيدًا للطالبات والمدرسة."
        icon={<MessageCircleHeart className="h-6 w-6" />}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-white p-6 ring-1 ring-lav-100 md:p-8">
          {!SUGGESTIONS_ENABLED && (
            <div className="mb-6">
              <Notice>
                هذا نموذج أولي: يمكنكم تجربته، لكن الإرسال الفعلي سيُفعَّل بعد ربط المنصة بقاعدة بيانات آمنة. لن يُحفظ ما تكتبونه الآن.
              </Notice>
            </div>
          )}

          <fieldset>
            <legend className="mb-3 font-medium text-ink-900">نوع المشاركة</legend>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {CATS.map((c) => {
                const active = form.category === c.id
                return (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer flex-col items-center rounded-2xl p-3 text-center ring-1 sm:items-start sm:p-4 sm:text-start transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-lav-200 ${
                      active ? 'bg-lav-50 ring-lav-400' : 'bg-white ring-lav-100 hover:ring-lav-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={c.id}
                      checked={active}
                      onChange={() => setForm({ ...form, category: c.id })}
                      className="sr-only"
                    />
                    <c.icon className={`h-5 w-5 ${active ? 'text-lav-700' : 'text-ink-400'}`} aria-hidden="true" />
                    <span className="mt-2 font-medium text-ink-900">{c.id}</span>
                    <span className="hidden text-xs text-ink-500 sm:block">{c.hint}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6">
            <label htmlFor="title" className="mb-1.5 block font-medium text-ink-900">
              العنوان
            </label>
            <input
              id="title"
              className="field"
              value={form.title}
              maxLength={TITLE_MAX}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-err' : undefined}
              placeholder="مثال: ركن هادئ للقراءة في الفسحة"
            />
            {errors.title && <p id="title-err" className="mt-1.5 text-sm text-red-700">{errors.title}</p>}
          </div>

          <div className="mt-5">
            <label htmlFor="details" className="mb-1.5 block font-medium text-ink-900">
              التفاصيل
            </label>
            <textarea
              id="details"
              rows={6}
              className="field resize-y"
              value={form.details}
              maxLength={DETAILS_MAX}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              aria-invalid={Boolean(errors.details)}
              aria-describedby={`details-count${errors.details ? ' details-err' : ''}`}
              placeholder="ما الاقتراح؟ ولماذا ترونه مفيدًا؟"
            />
            <div className="mt-1.5 flex justify-between text-xs">
              <span>{errors.details && <span id="details-err" className="text-sm text-red-700">{errors.details}</span>}</span>
              <span id="details-count" className="text-ink-400">
                {form.details.length} / {DETAILS_MAX}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="sender" className="mb-1.5 block font-medium text-ink-900">
              صفتكم <span className="text-sm font-normal text-ink-400">(اختياري)</span>
            </label>
            <select
              id="sender"
              className="field"
              value={form.senderType}
              onChange={(e) => setForm({ ...form, senderType: e.target.value as SuggestionInput['senderType'] })}
            >
              <option value="">أفضّل عدم التحديد</option>
              <option value="ولي أمر">ولي أمر</option>
              <option value="طالبة">طالبة</option>
              <option value="منسوبة">منسوبة</option>
            </select>
          </div>

          {sensitive.length > 0 && (
            <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              يبدو أن النص يتضمن {sensitive.map((k) => sensitiveLabel[k]).join(' و')}. احذفوه قبل المتابعة؛ النموذج لا يحتاج بيانات شخصية.
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary px-6" disabled={busy || sensitive.length > 0}>
              {busy ? 'جارٍ الإرسال…' : 'إرسال الاقتراح'}
            </button>
            <p className="flex items-center gap-1.5 text-xs text-ink-500">
              <ShieldCheck className="h-4 w-4 text-sage-600" aria-hidden="true" />
              لا نطلب اسمًا ولا رقمًا ولا هوية.
            </p>
          </div>

          {result && (
            <div
              role="status"
              className={`mt-6 rounded-2xl p-5 ${result.ok ? 'bg-sage-50 ring-1 ring-sage-200' : 'bg-lav-50 ring-1 ring-lav-200'}`}
            >
              {result.ok ? (
                <>
                  <p className="font-semibold text-sage-700">وصل اقتراحكم.</p>
                  <p className="mt-1 text-sm text-ink-700">
                    رقم المتابعة: <span className="font-mono font-semibold" dir="ltr">{result.trackingCode}</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-ink-900">{result.message}</p>
                  {result.reason === 'not-enabled' && (
                    <>
                      <p className="mt-1 text-sm text-ink-600">إن أردتم الاحتفاظ بنص اقتراحكم، انسخوه وأرسلوه عبر قنوات المدرسة المعتادة.</p>
                      <button type="button" onClick={copyText} className="btn-soft mt-3">
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        {copied ? 'نُسخ النص' : 'نسخ نص الاقتراح'}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </form>

        <aside className="space-y-4">
          <section className="rounded-3xl bg-sage-50 p-6 ring-1 ring-sage-100">
            <h2 className="text-base font-semibold">لماذا نسمعكم؟</h2>
            <p className="mt-2 text-sm leading-7 text-ink-700">
              الأسرة شريك أساسي في نجاح الطالبة. مقترحاتكم تصل إلى الإدارة، وتُدرس وتُصنَّف، ويُعلن عمّا يُنفَّذ منها.
            </p>
          </section>
          <section className="rounded-3xl bg-white p-6 ring-1 ring-lav-100">
            <h2 className="text-base font-semibold">بعد تفعيل الإرسال</h2>
            <ul className="prose-ar text-sm text-ink-600">
              <li>تحصلون على رقم متابعة لكل اقتراح.</li>
              <li>تطّلع عليه المسؤولات المخولات فقط.</li>
              <li>تتابعون حالته برقم المتابعة دون تسجيل دخول.</li>
            </ul>
          </section>
          <p className="px-2 text-xs text-ink-500">
            للشكاوى العاجلة أو المواقف التي تخص طالبة بعينها، تواصلوا مباشرة عبر{' '}
            <Link to="/contact" className="text-lav-700 underline underline-offset-4">دليل التواصل</Link>.
          </p>
        </aside>
      </div>
    </>
  )
}
