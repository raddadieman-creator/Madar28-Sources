/**
 * حماية البيانات الشخصية في مدخلات المستخدم.
 * رُشد ونموذج الاقتراحات لا يحتاجان أي بيانات شخصية؛ هذه الدالة تكشف
 * الأنماط الشائعة (هوية/إقامة، جوال، بريد) لتنبيه المستخدم قبل المتابعة.
 */
export type SensitiveKind = 'national-id' | 'phone' | 'email'

export function detectSensitive(text: string): SensitiveKind[] {
  const t = text.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
  const found = new Set<SensitiveKind>()
  const digits = t.replace(/[\s-]/g, '')
  if (/(?<!\d)[12]\d{9}(?!\d)/.test(digits)) found.add('national-id')
  if (/(?<!\d)(?:\+?966|0)?5\d{8}(?!\d)/.test(digits)) found.add('phone')
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(t)) found.add('email')
  return [...found]
}

export const sensitiveLabel: Record<SensitiveKind, string> = {
  'national-id': 'رقم هوية أو إقامة',
  phone: 'رقم جوال',
  email: 'بريد إلكتروني',
}
