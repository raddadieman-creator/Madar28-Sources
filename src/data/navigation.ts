import type { IconName } from '../types/content'

export interface NavItem {
  label: string
  path: string
  icon: IconName
  /** وصف قصير يظهر في قائمة الجوال */
  hint?: string
}

export const mainNav: NavItem[] = [
  { label: 'الرئيسية', path: '/', icon: 'home', hint: 'آخر الإعلانات والمواعيد' },
  { label: 'عن المدرسة', path: '/about', icon: 'school', hint: 'الرؤية والرسالة والهيكل' },
  { label: 'الخدمات المدرسية', path: '/services', icon: 'grid', hint: 'نور، مدرستي، النقل' },
  { label: 'التوجيه الطلابي', path: '/guidance', icon: 'heart', hint: 'أدلة وبرامج إرشادية' },
  { label: 'موهبة والإبداع', path: '/mawhiba', icon: 'lightbulb', hint: 'برامج ومسابقات' },
  { label: 'العمل التطوعي', path: '/volunteer', icon: 'handshake', hint: 'مبادرات وفرص' },
  { label: 'الفعاليات والتقويم', path: '/events', icon: 'calendar', hint: 'هجري وميلادي' },
  { label: 'صوتك مسموع', path: '/voice', icon: 'message', hint: 'شاركونا أفكاركم' },
  { label: 'تواصل معنا', path: '/contact', icon: 'phone', hint: 'لمن أتوجه؟' },
]

/** عناصر شريط التنقل السفلي في الجوال (رُشد يُضاف كزر مستقل) */
export const bottomNav: NavItem[] = [
  { label: 'الرئيسية', path: '/', icon: 'home' },
  { label: 'الخدمات', path: '/services', icon: 'grid' },
  { label: 'التقويم', path: '/events', icon: 'calendar' },
]
