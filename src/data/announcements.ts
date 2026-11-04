import type { Announcement } from '../types/content'
import winterPoster from '../assets/winter-schedule-1448.webp'

/**
 * إعلانات ثابتة في الموقع، تُضاف إلى الإعلانات التي تُنشر من «لوحة المدرسة».
 * - featured: true يظهر أعلى الرئيسية تحت العلم (للإعلانات المهمة جدًا مثل مواعيد الدوام).
 * - expires: بعد هذا التاريخ يختفي الإعلان تلقائيًا.
 */
export const staticAnnouncements: Announcement[] = [
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
    footer: 'نأمل الالتزام بمواعيد الحضور والانصراف، مع الشكر على التعاون. مديرة المدرسة: أ. بدرية الحارثي.',
    image: { src: winterPoster, alt: 'إعلان مواعيد الدوام الشتوي — المتوسطة الثامنة والعشرون' },
    date: '2026-10-25',
    expires: '2027-02-07',
    audience: 'الجميع',
    pinned: true,
    featured: true,
    status: 'approved',
  },
]

/**
 * إعلانات من «لوحة المدرسة» انتهت ولا تُعرض في الموقع، إلى أن يُلغى تثبيتها من اللوحة.
 * إجازة الأحد 14 جمادى الأولى 1448هـ انتهت.
 */
export const hiddenAnnouncementIds = ['79653870-2b92-498e-9884-ed03b2f207a3']
