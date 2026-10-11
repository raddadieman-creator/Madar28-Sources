import type { Initiative, Opportunity } from '../types/content'

/**
 * العمل التطوعي.
 * المبادرات المعلَّمة draft أمثلة مقترحة للتوضيح، تُستبدل بمبادرات المدرسة الفعلية.
 */
const NVG = 'https://www.nvg.gov.sa'

export const initiatives: Initiative[] = [
  {
    id: 'green-school',
    title: 'مدرستي خضراء',
    summary: 'العناية بالنباتات والمساحات الخضراء في المدرسة، وفرز المواد القابلة لإعادة التدوير.',
    icon: 'leaf',
    audience: ['الطالبات'],
    status: 'draft',
    tags: ['بيئة', 'زراعة', 'تدوير'],
  },
  {
    id: 'peer-tutoring',
    title: 'زميلتي أساعدك',
    summary: 'طالبات متفوقات يساعدن زميلاتهن في مراجعة الدروس بإشراف معلمة.',
    icon: 'handshake',
    audience: ['الطالبات'],
    status: 'draft',
    tags: ['تعليم', 'مساعدة', 'أقران'],
  },
  {
    id: 'reading-corner',
    title: 'ركن القراءة',
    summary: 'تنظيم مكتبة الفصل، وجمع الكتب المستعملة الصالحة وإتاحتها للجميع.',
    icon: 'book',
    audience: ['الطالبات', 'أولياء الأمور'],
    status: 'draft',
    tags: ['قراءة', 'كتب', 'مكتبة'],
  },
  {
    id: 'family-volunteers',
    title: 'أسر متطوعة',
    summary: 'مشاركة أولياء الأمور بخبراتهم في لقاءات مهنية وتوعوية للطالبات.',
    icon: 'users',
    audience: ['أولياء الأمور'],
    status: 'draft',
    tags: ['أسرة', 'مهن', 'خبرات'],
  },
]

export const volunteerConditions: string[] = [
  'موافقة ولي الأمر على مشاركة الطالبة.',
  'ألا تتعارض المشاركة مع الحصص الدراسية إلا بإذن المدرسة.',
  'الالتزام بتعليمات المشرفة وقواعد السلامة.',
  'تُوثَّق الساعات التطوعية وفق الآلية المعتمدة في المنصة الوطنية للعمل التطوعي.',
]

export const volunteerOpportunities: Opportunity[] = [
  {
    id: 'nvg',
    title: 'المنصة الوطنية للعمل التطوعي',
    summary: 'المنصة الرسمية لاستعراض الفرص التطوعية والتسجيل فيها وتوثيق الساعات.',
    timing: 'متاحة طوال العام',
    link: { label: 'المنصة الوطنية للعمل التطوعي', url: NVG },
    status: 'approved',
    tags: ['تسجيل', 'ساعات', 'شهادة'],
  },
  {
    id: 'school-day',
    title: 'يوم التطوع المدرسي',
    summary: 'يوم مفتوح لتنفيذ مبادرات قصيرة داخل المدرسة بمشاركة الطالبات والأسر.',
    timing: 'موعد مقترح — يُحدَّد من المدرسة',
    status: 'draft',
    tags: ['يوم مفتوح', 'مبادرات'],
  },
]

/** الإنجازات التطوعية — تبقى فارغة حتى تُضاف إنجازات موثقة */
export const volunteerAchievements: { title: string; detail: string; date: string }[] = []
