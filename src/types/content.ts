/**
 * أنواع المحتوى في المنصة.
 * هذه الأنواع هي "العقد" بين الواجهات ومصدر البيانات؛ عند ربط قاعدة بيانات
 * لاحقًا تُعاد البيانات بالشكل نفسه فلا تتغير الواجهات.
 */

/** اسم أيقونة من سجل الأيقونات في src/components/ui/Icon.tsx */
export type IconName = string

/** حالة المحتوى: معتمد من المدرسة، أو مسودة/بيانات تجريبية تحتاج اعتمادًا */
export type ContentStatus = 'approved' | 'draft'

export type Audience = 'الجميع' | 'أولياء الأمور' | 'الطالبات' | 'المنسوبات'

export interface ExternalLink {
  label: string
  url: string
  /** وصف قصير يظهر تحت الرابط */
  note?: string
}

export interface SchoolInfo {
  shortName: string
  fullName: string
  portalName: string
  tagline: string
  city: string
  stage: string
  welcome: string
  vision: string
  mission: string
  goals: string[]
  principalWord: { title: string; body: string[]; signature: string }
  address: string
  mapUrl?: string
  workingHours: string
  email?: string
  website?: string
  status: ContentStatus
}

export interface OrgUnit {
  role: string
  description: string
  icon: IconName
  /** يترك فارغًا حتى تعتمده المدرسة */
  name?: string
}

export interface SchoolValue {
  id: string
  name: string
  meaning: string
  /** سلوك الطالبة في المدرسة */
  practices: string[]
  icon: IconName
  /** آية قرآنية موثّقة بالسورة ورقم الآية (لا تُضاف أحاديث أو أقوال غير موثقة) */
  quote?: { text: string; ref: string }
  /** تحدي الأسبوع */
  challenge: string
  /** رسالة قصيرة للأسرة */
  family: string
  /** نشاط مدرسي مقترح — يُنفَّذ بعد اعتماد المدرسة */
  activity: string
  /** إن كانت القيمة من القيم الست المعتمدة لتقييم السلوك المتميز */
  officialSource?: SourceRef
}

/* ——— مكتبة الأدلة والأنظمة ——— */

/** إحالة إلى موضع في وثيقة رسمية من مكتبة الأدلة */
export interface SourceRef {
  /** معرّف الوثيقة في library.ts */
  docId: string
  /** المادة أو القسم كما ورد في الوثيقة */
  section?: string
  /** رقم الصفحة المطبوع (تقريبي عند تشوه النص المستخرج) */
  page?: number
}

export type GuideTopic = 'السلوك والمواظبة' | 'التوجيه الطلابي' | 'الأسرة والنمو' | 'التنمر والعنف'

export interface GuideDoc {
  id: string
  title: string
  issuer: string
  /** سنة الإصدار كما على الغلاف */
  year: string
  edition?: string
  topics: GuideTopic[]
  summary: string
  /** الرابط الرسمي للملف (تم التحقق منه) */
  officialUrl?: string
  /** ملف مرفوع إلى المستودع بجانب index.html (مثل guides/behavior-1447.pdf) */
  localFile?: string
  /** صفحة الإصدار الرسمية إن وجدت */
  landingUrl?: string
  /** تاريخ آخر تحقق من الرابط */
  verifiedOn: string
  /** الفهرس الداخلي: المواد والصفحات */
  toc: { title: string; page?: number }[]
  /** نقاط موثقة من الوثيقة نفسها مع الصفحة */
  highlights?: { text: string; page?: number; section?: string }[]
  /** ملاحظة أمانة علمية تظهر للقارئ */
  note?: string
  tags: string[]
}

/** إجراء في «دليلك المدرسي» */
export interface Procedure {
  id: string
  title: string
  icon: IconName
  /** متى يُستخدم */
  when: string
  steps: { text: string; basis: 'rule' | 'school' }[]
  requirements?: string[]
  /** المسؤولة (معرّفها في contacts.ts) */
  contactId?: string
  /** مرجع رسمي؛ يغيب إن كان الإجراء تنظيمًا مدرسيًا */
  source?: SourceRef
  /** إجراء مدرسي مقترح يحتاج اعتماد الإدارة */
  proposed?: boolean
  link?: ExternalLink
  tags: string[]
}

export interface Service {
  id: string
  title: string
  summary: string
  icon: IconName
  /** رابط رسمي خارجي */
  url?: string
  /** مسار داخلي في المنصة */
  to?: string
  steps?: string[]
  tags: string[]
  quick?: boolean
  official?: boolean
}

export interface WhatToDoItem {
  id: string
  question: string
  steps: string[]
  /** معرّف المسؤولة في دليل التواصل (contacts.ts) */
  contactId?: string
  link?: ExternalLink
  tags: string[]
}

export interface GuidanceTopic {
  id: string
  title: string
  summary: string
  icon: IconName
  /** فقرات وقوائم المحتوى */
  sections: { heading: string; points: string[]; source?: SourceRef }[]
  links?: ExternalLink[]
  /** الوثيقة الرسمية المرتبطة في المكتبة */
  docId?: string
  /** دليل PDF — يضاف رابطه عند توفره */
  pdf?: { label: string; url?: string }
  tags: string[]
  audience: Audience[]
}

export interface Program {
  id: string
  title: string
  summary: string
  details: string[]
  icon: IconName
  link?: ExternalLink
  kind: 'تعريف' | 'إثراء' | 'مسابقة' | 'بحث'
  tags: string[]
}

export interface Opportunity {
  id: string
  title: string
  summary: string
  /** نص يوضح التوقيت دون اختراع مواعيد رسمية */
  timing: string
  link?: ExternalLink
  status: ContentStatus
  tags: string[]
}

export interface Initiative {
  id: string
  title: string
  summary: string
  icon: IconName
  audience: Audience[]
  status: ContentStatus
  tags: string[]
}

export type EventCategory = 'وطنية' | 'عالمية' | 'تربوية' | 'اختبارات' | 'إجازات' | 'أنشطة'

export interface SchoolEvent {
  id: string
  title: string
  /** تاريخ البداية بصيغة YYYY-MM-DD (ميلادي) */
  start: string
  /** تاريخ النهاية (اختياري) بصيغة YYYY-MM-DD */
  end?: string
  /** وقت اختياري HH:MM */
  time?: string
  category: EventCategory
  description: string
  location?: string
  audience: Audience[]
  status: ContentStatus
}

export interface Announcement {
  id: string
  title: string
  body: string
  date: string
  /** تاريخ انتهاء العرض (اختياري) */
  expires?: string
  audience: Audience
  pinned?: boolean
  link?: ExternalLink
  status: ContentStatus
}

/**
 * بطاقة في دليل التواصل. الحقول مصممة لتطابق جدولًا في قاعدة البيانات
 * تُدار من لوحة التحكم في المرحلة الثانية.
 */
export interface Contact {
  id: string
  /** المسمى الوظيفي */
  role: string
  /** وصف مختصر لاختصاص المسؤولة */
  responsibility: string
  icon: IconName
  /** يُترك فارغًا لخانة تُضاف لاحقًا */
  name?: string
  /**
   * الرقم بصيغته المحلية (05XXXXXXXX). لا يُكتب في ملفات المحتوى؛
   * يُضاف في private/contact-phones.json ولا يصل إلى النسخة العامة إلا بعد الاعتماد والموافقة.
   */
  phone?: string
  /** هل الرقم متاح على واتساب */
  whatsapp?: boolean
  /** رقم محفوظ لكنه لم يُعتمد للنشر بعد (يظهر في نسخة التطوير فقط) */
  phoneUnpublished?: boolean
  email?: string
  /** أوقات تواصل — تُضاف فقط إذا اعتمدتها الإدارة */
  hours?: string
  /** كلمات يكتبها أولياء الأمور عادة، تساعد البحث داخل الدليل */
  topics: string[]
  /** ترتيب الظهور */
  order: number
  /** إخفاء البطاقة دون حذف بياناتها */
  active: boolean
  /** رابط رسمي ذو صلة (مثل نظام نور) */
  link?: ExternalLink
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  /** كلمات مفتاحية إضافية تساعد رُشد على المطابقة */
  keywords: string[]
  links?: ExternalLink[]
  /** مسار داخلي ذو صلة */
  to?: { label: string; path: string }
  /** معرّف المسؤولة المختصة في دليل التواصل عند الحاجة لمتابعة بشرية */
  contactId?: string
  /** مرجع الإجابة في مكتبة الأدلة */
  source?: SourceRef
  category: string
}

export interface SearchItem {
  id: string
  title: string
  description: string
  section: string
  path: string
  external?: string
  keywords: string
  icon: IconName
  /** نوع النتيجة لتصفية البحث */
  type?: 'دليل' | 'إجراء' | 'سؤال' | 'خدمة' | 'تواصل' | 'فعالية' | 'موضوع'
  /** سنة الإصدار والجهة (للأدلة) */
  year?: string
  issuer?: string
}
