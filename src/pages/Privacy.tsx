import { ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/ui/primitives'
import { useTitle } from '../hooks/useTitle'

export default function Privacy() {
  useTitle('الخصوصية')
  return (
    <>
      <PageHeader title="الخصوصية وحماية البيانات" intro="ما الذي تجمعه المنصة في نسختها الحالية، وما الذي لا تجمعه." icon={<ShieldCheck className="h-6 w-6" />} />
      <div className="max-w-prose space-y-6 rounded-3xl bg-white p-6 text-[15px] leading-8 text-ink-700 ring-1 ring-lav-100 md:p-8">
        <section>
          <h2 className="text-lg font-semibold">في النسخة الحالية</h2>
          <ul className="prose-ar">
            <li>المنصة لا تتطلب تسجيل دخول، ولا تجمع أسماء أو أرقام هوية أو بيانات طالبات.</li>
            <li>محادثات «رُشد» تتم داخل متصفحك فقط، ولا تُرسل إلى أي خادم، وتُمحى بإغلاق الصفحة.</li>
            <li>نموذج «صوتك مسموع» لا يحفظ أي نص.</li>
            <li>القراءة الصوتية والإدخال الصوتي يعملان عبر خصائص المتصفح نفسه.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold">عند تفعيل المرحلة الثانية</h2>
          <ul className="prose-ar">
            <li>تُحفظ الاقتراحات في قاعدة بيانات محمية، وتطّلع عليها المسؤولات المخولات فقط.</li>
            <li>نطلب أقل قدر ممكن من البيانات، ولا نرسل بيانات الطالبات إلى خدمات خارجية غير معتمدة.</li>
            <li>تُحدَّث هذه الصفحة بسياسة الخصوصية المعتمدة قبل تفعيل أي جمع للبيانات.</li>
          </ul>
        </section>
        <p className="text-sm text-ink-500">الروابط الخارجية (نور، مدرستي، موهبة…) تخضع لسياسات الجهات المالكة لها.</p>
      </div>
    </>
  )
}
