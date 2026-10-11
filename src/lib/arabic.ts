/**
 * أدوات معالجة النص العربي للبحث والمطابقة.
 * توحيد الهمزات والتاء المربوطة والألف المقصورة وحذف التشكيل والتطويل،
 * حتى يجد البحث «اجازة» عند كتابة «إجازة» والعكس.
 */
const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g
const TATWEEL = /ـ/g

export function normalizeArabic(input: string): string {
  return input
    .toLowerCase()
    .replace(DIACRITICS, '')
    .replace(TATWEEL, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const STOPWORDS = new Set(
  [
    'في', 'من', 'على', 'الى', 'عن', 'مع', 'او', 'ثم', 'ان', 'اذا', 'هل', 'ما', 'ماذا', 'كيف', 'متى', 'اين',
    'لماذا', 'هذا', 'هذه', 'ذلك', 'التي', 'الذي', 'هو', 'هي', 'انا', 'لي', 'عندي', 'ابي', 'ابغى', 'ابغي',
    'اريد', 'ودي', 'لو', 'يا', 'و', 'لا', 'قد', 'كان', 'وش', 'ايش', 'افعل', 'اسوي', 'بنتي', 'ابنتي',
    'بنت', 'طالبه', 'الطالبه', 'ممكن', 'شكرا', 'السلام', 'عليكم', 'اليوم', 'الان', 'حق', 'اعرف',
    'ابغا', 'كم', 'هو', 'هي', 'عندنا', 'لكم', 'لنا',
  ].map(normalizeArabic),
)

/** إزالة السوابق الشائعة للحصول على جذع تقريبي */
export function stem(word: string): string {
  let w = word
  for (const p of ['وال', 'بال', 'كال', 'فال', 'لل', 'ال']) {
    if (w.startsWith(p) && w.length - p.length >= 2) {
      w = w.slice(p.length)
      break
    }
  }
  if (w.length > 4 && (w.startsWith('و') || w.startsWith('ف'))) w = w.slice(1)
  for (const s of ['ات', 'ون', 'ين', 'ها', 'ه']) {
    if (w.endsWith(s) && w.length - s.length >= 3) {
      w = w.slice(0, -s.length)
      break
    }
  }
  return w
}

export function tokenize(input: string): string[] {
  return normalizeArabic(input)
    .split(' ')
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem)
}

/** هل تتطابق كلمتان تقريبيًا (مطابقة تامة أو بادئة مشتركة كافية) */
export function tokensMatch(a: string, b: string): number {
  if (a === b) return 1
  const min = Math.min(a.length, b.length)
  if (min >= 3 && (a.startsWith(b) || b.startsWith(a))) return 0.7
  if (min >= 4 && (a.includes(b) || b.includes(a))) return 0.5
  return 0
}
