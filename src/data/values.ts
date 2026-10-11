import type { SchoolValue } from '../types/content'

/**
 * القيم المدرسية.
 * قيمة الأسبوع تتغير تلقائيًا كل أسبوع بالترتيب بدءًا من rotationStart.
 * لتثبيت قيمة معينة ضعي معرّفها في featuredValueId، مثل: 'respect'.
 */
export const valuesConfig = {
  rotationStart: '2026-08-23',
  featuredValueId: '' as string,
}

export const schoolValues: SchoolValue[] = [
  {
    id: 'respect',
    name: 'الاحترام',
    meaning: 'أن أعامل الآخرين كما أحب أن يعاملوني، في القول والفعل.',
    practices: ['أستأذن قبل أن أتحدث', 'أحافظ على ممتلكات غيري', 'أختلف دون أن أجرح'],
    icon: 'heart-handshake',
  },
  {
    id: 'responsibility',
    name: 'المسؤولية',
    meaning: 'أن ألتزم بما عليّ، وأتحمل نتائج اختياراتي.',
    practices: ['أُنجز واجباتي في وقتها', 'أعترف بخطئي وأصلحه', 'أهتم بنظافة مكاني'],
    icon: 'check-circle',
  },
  {
    id: 'honesty',
    name: 'الأمانة',
    meaning: 'أن أكون صادقة في قولي وعملي، وأحفظ ما يُؤتمن عندي.',
    practices: ['أؤدي اختباراتي بنزاهة', 'أعيد ما ليس لي', 'أحفظ أسرار صديقاتي'],
    icon: 'shield-check',
  },
  {
    id: 'belonging',
    name: 'الانتماء الوطني',
    meaning: 'أن أعتز بديني ووطني، وأشارك في بنائه وخدمته.',
    practices: ['أحترم رموز الوطن', 'أحافظ على المرافق العامة', 'أشارك في المبادرات الوطنية'],
    icon: 'flag',
  },
  {
    id: 'perseverance',
    name: 'المثابرة',
    meaning: 'أن أستمر في المحاولة حتى أصل، وأتعلم من الخطأ.',
    practices: ['أعيد المحاولة بطريقة جديدة', 'أطلب المساعدة عند الحاجة', 'أحتفل بتقدمي الصغير'],
    icon: 'mountain',
  },
  {
    id: 'cooperation',
    name: 'التعاون',
    meaning: 'أن أعمل مع غيري لنصل معًا إلى ما لا نصل إليه منفردات.',
    practices: ['أشارك في العمل الجماعي', 'أستمع لرأي زميلتي', 'أساعد من تحتاج'],
    icon: 'handshake',
  },
  {
    id: 'kindness',
    name: 'الرحمة',
    meaning: 'أن أكون لطيفة مع من حولي، وأراعي مشاعرهم.',
    practices: ['أبتسم وأُلقي السلام', 'أواسي من تحزن', 'أرفق بالحيوان والنبات'],
    icon: 'smile',
  },
  {
    id: 'discipline',
    name: 'الانضباط',
    meaning: 'أن أنظم وقتي وسلوكي وفق ما اتفقنا عليه.',
    practices: ['أحضر في الموعد', 'ألتزم بالزي المدرسي', 'أتبع تعليمات السلامة'],
    icon: 'clock',
  },
]
