/**
 * الشؤون التعليمية — خدمة المستفيد.
 * مرجع واحد لما يُطلب من الشؤون التعليمية في المدرسة، مقسّم بحسب المستفيد.
 * الجهة المختصة: وكيلة المدرسة (الشؤون التعليمية). التفاصيل والمواعيد تُعتمد منها.
 * - procedure: رابط إجراء في «دليلك المدرسي» إن وُجد.
 * - system: نظام رسمي مرتبط (نور، مدرستي).
 * - contactTo: المسؤولة التي يصلها الطلب في «مركز التواصل».
 */

export type AcademicAudience = 'student' | 'teacher' | 'staff'

export interface AcademicService {
  id: string
  title: string
  description: string
  procedure?: string
  system?: { label: string; url: string }
  contactTo?: string
}

const NOOR = { label: 'نظام نور', url: 'https://noor.moe.gov.sa' }
const MADRASATI = { label: 'منصة مدرستي', url: 'https://schools.madrasati.sa' }

export const academicAudiences: { id: AcademicAudience; label: string; sender: string; intro: string }[] = [
  { id: 'student', label: 'الطالبة وولي الأمر', sender: 'ولي أمر', intro: 'الجداول والاختبارات والنتائج، والاستئذان، ومقابلة المعلمات.' },
  { id: 'teacher', label: 'المعلمة', sender: 'معلمة', intro: 'الجدول وحصص الانتظار، ورصد الدرجات، والاختبارات والخطط الدراسية.' },
  { id: 'staff', label: 'الإدارية', sender: 'إدارية', intro: 'بيانات الطالبات، وترتيبات الاختبارات، والتقارير التعليمية.' },
]

export const academicServices: Record<AcademicAudience, AcademicService[]> = {
  student: [
    { id: 'timetable', title: 'الجدول المدرسي', description: 'الاستفسار عن جدول حصص الفصل وأي تعديل يطرأ عليه.', contactTo: 'vice' },
    { id: 'exams', title: 'الاختبارات ومواعيدها', description: 'مواعيد الاختبارات، والاستفسار عن الدرجات بعد رصدها.', contactTo: 'vice' },
    { id: 'results', title: 'النتائج والشهادات', description: 'الاطلاع على النتائج والشهادات من حساب ولي الأمر في نظام نور.', system: NOOR, contactTo: 'noor' },
    { id: 'leave', title: 'الاستئذان أثناء الدوام', description: 'خروج الطالبة قبل نهاية اليوم الدراسي بحضور ولي أمرها.', procedure: 'leave', contactTo: 'vice' },
    { id: 'teacher-meeting', title: 'مقابلة معلمة', description: 'طلب موعد لمناقشة مستوى الطالبة مع معلمة المادة.', procedure: 'visit', contactTo: 'vice' },
    { id: 'update-data', title: 'تحديث بيانات التواصل', description: 'تحديث رقم ولي الأمر في نظام نور، وإبلاغ المدرسة بالتغيير.', system: NOOR, contactTo: 'vice' },
  ],
  teacher: [
    { id: 'teacher-timetable', title: 'الجدول وحصص الانتظار', description: 'الجدول الدراسي، وتوزيع حصص الانتظار، وتبادل الحصص.', contactTo: 'vice' },
    { id: 'grades', title: 'رصد الدرجات', description: 'رصد درجات الطالبات في نظام نور في المواعيد التي تحددها المدرسة.', system: NOOR, contactTo: 'vice' },
    { id: 'exam-committees', title: 'الاختبارات ولجانها', description: 'جداول الاختبارات، ولجان المراقبة والتصحيح.', contactTo: 'vice' },
    { id: 'plans', title: 'الخطط الدراسية وتوزيع المنهج', description: 'تسليم الخطط الفصلية ومتابعة توزيع المنهج.', contactTo: 'vice' },
    { id: 'madrasati-support', title: 'الدعم الفني لمنصة مدرستي', description: 'الدخول إلى المنصة وإدارة الدروس والواجبات.', system: MADRASATI, contactTo: 'madrasati' },
  ],
  staff: [
    { id: 'students-data', title: 'بيانات الطالبات في نور', description: 'التسجيل والنقل وتحديث بيانات الطالبات في نظام نور.', system: NOOR, contactTo: 'noor' },
    { id: 'exam-arrangements', title: 'ترتيبات الاختبارات', description: 'كشوف اللجان، وتوزيع القاعات، وتجهيز أوراق الاختبارات.', contactTo: 'vice' },
    { id: 'reports', title: 'التقارير والإحصاءات التعليمية', description: 'تقارير الحضور والنتائج التي تطلبها الإدارة أو إدارة التعليم.', contactTo: 'vice' },
    { id: 'assignments', title: 'التكليفات الإدارية', description: 'المهام المرتبطة بالجدول والإشراف اليومي والمناوبة.', contactTo: 'vice' },
  ],
}

/**
 * دليل المعلمة ودليل الإدارية — من «الدليل التنظيمي لمدارس التعليم العام (دليل الأهداف والمهام)»
 * وزارة التعليم، إصدار 1442هـ. أرقام الصفحات من متن الدليل.
 */
export const ORG_GUIDE_URL =
  'https://www.moe.gov.sa/ar/aboutus/aboutministry/RPRLibrary/%D8%A7%D9%84%D8%AF%D9%84%D9%8A%D9%84%20%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%85%D9%8A%20%D9%84%D9%84%D9%85%D8%AF%D8%A7%D8%B1%D8%B3.pdf'

export interface GuideSection {
  title: string
  points: { text: string; page?: string }[]
}

export const teacherGuide: GuideSection[] = [
  {
    title: 'الإشراف والمناوبة',
    points: [{ text: 'تشارك المعلمات في الإشراف اليومي بين الحصص وفي المناوبة وفق جدول تصدره المديرة، وتُقدَّم صاحبة النصاب الأقل.', page: '11' }],
  },
  {
    title: 'النصاب التدريسي',
    points: [
      { text: 'المعلمة الممارسة: 24 حصة أسبوعيًا.', page: '11' },
      { text: 'المعلمة المتقدمة: 22 حصة أسبوعيًا.', page: '11' },
      { text: 'المعلمة الخبيرة: 18 حصة أسبوعيًا.', page: '11' },
      { text: 'من لم يكتمل نصابها تُكلَّف بالإرشاد أو بمهام تعليمية مساندة بحسب ما تراه المديرة.', page: '11' },
    ],
  },
  {
    title: 'اللجان المدرسية',
    points: [
      { text: 'تُكلَّف المعلمات بعضوية لجان المدرسة، ومنها: اللجنة الإدارية، ولجنة التحصيل الدراسي، ولجنة التميز، وفريق الأمن والسلامة، وفريق التربية الخاصة.', page: '17–30' },
      { text: 'يجوز لمعلمة الصف أو المادة حضور جلسات لجنة التوجيه والإرشاد، دون حق التصويت.', page: '19–20' },
    ],
  },
  {
    title: 'الأنظمة المستخدمة',
    points: [
      { text: 'نظام نور: رصد الدرجات في المواعيد التي تحددها المدرسة.' },
      { text: 'منصة مدرستي: الدروس والواجبات والاختبارات القصيرة.' },
    ],
  },
]

export const staffGuide: GuideSection[] = [
  {
    title: 'المساعدة الإدارية',
    points: [
      { text: 'يشمل المسمى كل وظيفة إدارية في المدرسة، كالسكرتارية والكتابة.', page: '11' },
      { text: 'إذا لم توجد مسجلة معلومات تتولى إحدى المساعدات الإداريات مهامها.', page: '11' },
      { text: 'عضوة في اللجنة الإدارية وفي فريق الصندوق المدرسي.', page: '17، 25' },
    ],
  },
  {
    title: 'الوكيلات',
    points: [
      { text: 'وكيلة الشؤون التعليمية: عضوة في لجنة التوجيه والإرشاد، وتشارك في دراسة الحصص الإضافية، وعضوة في لجنة التحصيل وتشارك في تنظيم الاختبارات ومتابعة نتائجها.', page: '19–22' },
      { text: 'وكيلة شؤون الطالبات: عضوة في لجنة التوجيه والإرشاد وتتابع تطبيق قواعد السلوك والمواظبة، وعضوة في لجنة التحصيل وفريق التربية الخاصة.', page: '19–21، 29' },
      { text: 'وكيلة الشؤون المدرسية: عضوة في فريق الصندوق المدرسي وفريق الأمن والسلامة.', page: '25، 27' },
      { text: 'إذا لم توجد مساعدة إدارية تتولى الوكيلات مهامها، كلٌّ فيما يخصها.', page: '11' },
    ],
  },
  {
    title: 'الإشراف والمناوبة',
    points: [{ text: 'تشارك الإداريات في الإشراف اليومي والمناوبة وفق الجدول الذي تصدره المديرة.', page: '11' }],
  },
  {
    title: 'رضا المستفيدين',
    points: [
      { text: 'لجنة التميز تُعدّ استطلاعات لرأي المستفيدين من خدمات المدرسة، وتحلل نتائجها وتقترح التحسين.', page: '23' },
      { text: 'لجنة التحصيل الدراسي تقيس رضا أولياء الأمور عن تحصيل بناتهم، وتُشركهم في معالجة الضعف.', page: '22' },
    ],
  },
]
