/**
 * إعداد مصدر البيانات.
 * 'local'  → البيانات من ملفات src/data (المرحلة الأولى، مناسبة لـ GitHub Pages).
 * 'api'    → البيانات من واجهة برمجية (المرحلة الثانية) عبر VITE_API_URL.
 * الواجهات لا تتعامل مع المصدر مباشرة، بل عبر دوال contentService فقط.
 */
export const DATA_SOURCE: 'local' | 'api' = import.meta.env.VITE_API_URL ? 'api' : 'local'
export const API_URL: string = import.meta.env.VITE_API_URL ?? ''

/** هل الإرسال الفعلي لنموذج «صوتك مسموع» مفعّل؟ (يتطلب Backend) */
export const SUGGESTIONS_ENABLED = DATA_SOURCE === 'api'
