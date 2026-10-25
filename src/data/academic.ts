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
