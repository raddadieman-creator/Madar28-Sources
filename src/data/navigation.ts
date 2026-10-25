import type { IconName } from '../types/content'

export interface NavItem {
  label: string
  path: string
  icon: IconName
  /** وصف قصير يظهر في قائمة الجوال */
  hint?: string
  /** أقسام ثانوية تظهر تحت فاصل في القائمة الجانبية */
  secondary?: boolean
}

export const mainNav: NavItem[] = [
  { label: 'الرئيسية', path: '/', icon: 'home', hint: 'الأقسام والإعلانات' },
  { label: 'الأدلة والأنظمة', path: '/library', icon: 'library', hint: 'قواعد السلوك والمواظبة 1447هـ' },
  { label: 'دليلك المدرسي', path: '/procedures', icon: 'compass', hint: 'الإجراءات خطوة بخطوة' },
  { label: 'الشؤون التعليمية', path: '/academic', icon: 'graduation', hint: 'خدمة المستفيد ودليل المعلمة والإدارية' },
  { label: 'مركز التواصل', path: '/contact', icon: 'phone', hint: 'طلب، موعد، استفسار' },
  { label: 'التوجيه الطلابي', path: '/guidance', icon: 'heart', hint: 'التنمر، النمو، الاختبارات' },
  { label: 'ترسيخ القيم', path: '/values', icon: 'gem', hint: 'قيمة الأسبوع وقيم العام' },
  { label: 'اختبارات نافس', path: '/nafs', icon: 'graduation', hint: 'الصف الثالث المتوسط' },
  { label: 'الخدمات المدرسية', path: '/services', icon: 'grid', hint: 'نور، مدرستي، مستقبلهم', secondary: true },
  { label: 'الفعاليات والتقويم', path: '/events', icon: 'calendar', hint: 'هجري وميلادي', secondary: true },
  { label: 'موهبة والإبداع', path: '/mawhiba', icon: 'lightbulb', hint: 'برامج ومسابقات', secondary: true },
  { label: 'العمل التطوعي', path: '/volunteer', icon: 'handshake', hint: 'مبادرات وفرص', secondary: true },
  { label: 'صوتك مسموع', path: '/voice', icon: 'message', hint: 'شاركنا أفكارك', secondary: true },
  { label: 'عن المدرسة', path: '/about', icon: 'school', hint: 'الرؤية والرسالة والهيكل', secondary: true },
]

/** عناصر شريط التنقل السفلي في الجوال (رُشد يُضاف كزر مستقل) */
export const bottomNav: NavItem[] = [
  { label: 'الرئيسية', path: '/', icon: 'home' },
  { label: 'الأدلة', path: '/library', icon: 'library' },
  { label: 'التواصل', path: '/contact', icon: 'phone' },
]
