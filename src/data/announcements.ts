import type { Announcement } from '../types/content'
import winterPoster from '../assets/winter-schedule-1448.webp'

/**
 * الإعلانات.
 * - pinned: true يثبت الإعلان أعلى القائمة في الصفحة الرئيسية.
 * - expires: بعد هذا التاريخ يختفي الإعلان من العرض تلقائيًا.
 * - الإعلانات الحالية أمثلة تجريبية (draft) تُستبدل بإعلانات المدرسة.
 */
export const announcements: Announcement[] = [
  {
    id: 'winter-schedule-1448',
    title: 'مواعيد الدوام الشتوي',
    body: 'تُعلن المدرسة مواعيد الدوام الشتوي لجميع أيام الأسبوع:',
    schedule: [
      { label: 'الحضور', time: '7:00 صباحًا' },
      { label: 'الاصطفاف الصباحي', time: '7:15 صباحًا' },
      { label: 'بداية الحصة الأولى', time: '7:30 صباحًا' },
      { label: 'الانصراف', time: '1:15 ظهرًا' },
    ],
    footer: 'نأمل الالتزام بمواعيد الحضور والانصراف، مع الشكر على التعاون. مديرة المدرسة: أ. بدري عبدالله الحارثي.',
    image: { src: winterPoster, alt: 'إعلان مواعيد الدوام الشتوي — المتوسطة الثامنة والعشرون' },
    date: '2026-10-25',
    expires: '2027-02-07',
    audience: 'الجميع',
    pinned: true,
    featured: true,
    status: 'approved',
  },
  {
    id: 'portal-launch',
    title: 'إطلاق «مدار 28» في نسخته التجريبية',
    body: 'يسعدنا أن نشاركك النسخة الأولى من المنصة، ونرحب بملاحظاتك عبر «مركز التواصل» لتطويرها قبل الإطلاق الرسمي.',
    date: '2026-10-11',
    audience: 'الجميع',
    pinned: true,
    status: 'draft',
  },
  {
    id: 'update-contacts',
    title: 'تحديث أرقام التواصل في نظام نور',
    body: 'نأمل من أولياء الأمور التأكد من صحة رقم الجوال المسجّل في نظام نور، لضمان وصول الرسائل المهمة في وقتها.',
    date: '2026-10-08',
    expires: '2026-11-30',
    audience: 'أولياء الأمور',
    link: { label: 'نظام نور', url: 'https://noor.moe.gov.sa' },
    status: 'draft',
  },
  {
    id: 'wellbeing-week',
    title: 'أسبوع الصحة النفسية المدرسي',
    body: 'تنفذ الموجهة الطلابية هذا الأسبوع أنشطة قصيرة عن إدارة المشاعر وطلب المساعدة داخل الفصول.',
    date: '2026-10-10',
    expires: '2026-10-15',
    audience: 'الطالبات',
    status: 'draft',
  },
  {
    id: 'mawhiba-reminder',
    title: 'إعلانات موهبة',
    body: 'للطالبات الراغبات في برامج موهبة: الإعلانات تصدر عبر الموقع الرسمي لموهبة، ومنسقة موهبة في المدرسة تساعد في التسجيل.',
    date: '2026-10-04',
    audience: 'الطالبات',
    link: { label: 'موقع موهبة', url: 'https://www.mawhiba.sa' },
    status: 'draft',
  },
  {
    id: 'expired-sample',
    title: 'إعلان منتهٍ (مثال)',
    body: 'هذا الإعلان انتهت مدة عرضه، فلا يظهر في القوائم — مثال على الإخفاء التلقائي.',
    date: '2026-09-01',
    expires: '2026-09-15',
    audience: 'الجميع',
    status: 'draft',
  },
]
