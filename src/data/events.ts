import type { SchoolEvent } from '../types/content'

/**
 * الفعاليات والمناسبات.
 * - التواريخ بالميلادي (YYYY-MM-DD)، والتاريخ الهجري يُحسب تلقائيًا بتقويم أم القرى.
 * - المناسبات الوطنية والعالمية بتواريخها الثابتة المعروفة (status: 'approved').
 * - مواعيد الاختبارات والإجازات وأنشطة المدرسة تُضاف بعد اعتمادها (status: 'approved')
 *   تُستبدل بالمواعيد الرسمية من التقويم الدراسي المعتمد.
 * - الفعاليات التي انتهى تاريخها تنتقل تلقائيًا إلى الأرشيف.
 */
export const events: SchoolEvent[] = [
  // ——— مناسبات وطنية ———
  {
    id: 'national-day-96',
    title: 'اليوم الوطني السعودي',
    start: '2026-09-23',
    category: 'وطنية',
    description: 'ذكرى توحيد المملكة العربية السعودية، وتُقام فيه أنشطة تعزز الانتماء والاعتزاز بالوطن.',
    audience: ['الجميع'],
    status: 'approved',
  },
  {
    id: 'founding-day-2027',
    title: 'يوم التأسيس',
    start: '2027-02-22',
    category: 'وطنية',
    description: 'ذكرى تأسيس الدولة السعودية الأولى، مناسبة للتعريف بتاريخ الوطن وجذوره.',
    audience: ['الجميع'],
    status: 'approved',
  },
  {
    id: 'flag-day-2027',
    title: 'يوم العلم',
    start: '2027-03-11',
    category: 'وطنية',
    description: 'مناسبة للتعريف بالعلم الوطني ودلالاته وآداب التعامل معه.',
    audience: ['الجميع'],
    status: 'approved',
  },
  // ——— مناسبات عالمية ———
  {
    id: 'teachers-day',
    title: 'اليوم العالمي للمعلم',
    start: '2026-10-05',
    category: 'عالمية',
    description: 'تقدير دور المعلمات في بناء الأجيال.',
    audience: ['الجميع'],
    status: 'approved',
  },
  {
    id: 'mental-health-day',
    title: 'اليوم العالمي للصحة النفسية',
    start: '2026-10-10',
    category: 'عالمية',
    description: 'توعية بأهمية الصحة النفسية وطلب الدعم عند الحاجة.',
    audience: ['الجميع'],
    status: 'approved',
  },
  {
    id: 'girl-child-day',
    title: 'اليوم الدولي للطفلة',
    start: '2026-10-11',
    category: 'عالمية',
    description: 'مناسبة دولية للاحتفاء بقدرات الفتيات وحقهن في التعليم والتمكين.',
    audience: ['الطالبات'],
    status: 'approved',
  },
  {
    id: 'food-day',
    title: 'يوم الأغذية العالمي',
    start: '2026-10-16',
    category: 'عالمية',
    description: 'توعية بالتغذية الصحية وعدم هدر الطعام.',
    audience: ['الجميع'],
    status: 'approved',
  },
  {
    id: 'science-day',
    title: 'اليوم العالمي للعلوم من أجل السلام والتنمية',
    start: '2026-11-10',
    category: 'عالمية',
    description: 'فرصة لإبراز المشاريع العلمية للطالبات وربط العلم بخدمة المجتمع.',
    audience: ['الطالبات'],
    status: 'approved',
  },
  {
    id: 'tolerance-day',
    title: 'اليوم الدولي للتسامح',
    start: '2026-11-16',
    category: 'عالمية',
    description: 'تعزيز قيم الاحترام وتقبّل الاختلاف.',
    audience: ['الجميع'],
    status: 'approved',
  },
  {
    id: 'children-day',
    title: 'اليوم العالمي للطفل',
    start: '2026-11-20',
    category: 'عالمية',
    description: 'التوعية بحقوق الطفل وحمايته.',
    audience: ['الجميع'],
    status: 'approved',
  },
  {
    id: 'disability-day',
    title: 'اليوم الدولي للأشخاص ذوي الإعاقة',
    start: '2026-12-03',
    category: 'عالمية',
    description: 'تعزيز الدمج والتقدير وإزالة العوائق.',
    audience: ['الجميع'],
    status: 'approved',
  },
  {
    id: 'arabic-day',
    title: 'اليوم العالمي للغة العربية',
    start: '2026-12-18',
    category: 'عالمية',
    description: 'احتفاء بلغتنا العربية وجمالها، بمسابقات إلقاء وخط وكتابة.',
    audience: ['الجميع'],
    status: 'approved',
  },
  // ——— فعاليات المدرسة ———
  {
    id: 'anti-bullying',
    title: 'برنامج «صديقتي آمنة» للوقاية من التنمر',
    start: '2026-10-28',
    end: '2026-10-29',
    category: 'تربوية',
    description: 'ورش قصيرة عن التمييز بين المزاح والتنمر وطرق الإبلاغ، لطالبات الصف الثالث المتوسط والطالبات المنضبطات والمشاركات في البرنامج.',
    audience: ['الطالبات'],
    status: 'approved',
  },
]

export const eventCategoryStyle: Record<
  SchoolEvent['category'],
  { dot: string; chip: string; icon: string }
> = {
  وطنية: { dot: 'bg-sage-500', chip: 'bg-sage-50 text-sage-700 border-sage-200', icon: 'flag' },
  عالمية: { dot: 'bg-lav-400', chip: 'bg-lav-50 text-lav-700 border-lav-200', icon: 'globe' },
  تربوية: { dot: 'bg-ink-600', chip: 'bg-ink-200/40 text-ink-800 border-ink-200', icon: 'heart' },
  اختبارات: { dot: 'bg-gold-500', chip: 'bg-gold-100 text-gold-700 border-gold-100', icon: 'pencil' },
  إجازات: { dot: 'bg-sage-300', chip: 'bg-sage-50 text-sage-600 border-sage-100', icon: 'sun' },
  أنشطة: { dot: 'bg-lav-600', chip: 'bg-lav-100 text-lav-800 border-lav-200', icon: 'sparkles' },
}
