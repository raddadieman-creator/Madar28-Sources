import type { Contact, FaqItem, SearchItem } from '../types/content'
import { tokenize, normalizeArabic } from '../lib/arabic'
import { detectSensitive, type SensitiveKind } from '../lib/privacy'
import { scoreFields, searchItems } from './searchService'

/**
 * محرك «رُشد» في المرحلة الأولى: مطابقة محلية مع قاعدة المعرفة فقط.
 * - لا يؤلف إجابات؛ إن لم يجد تطابقًا كافيًا يقول ذلك صراحة.
 * - لا يرسل أي نص خارج المتصفح.
 * - في المرحلة الثانية يمكن استبدال answer() باستدعاء Backend آمن
 *   (مع الإبقاء على فحص البيانات الحساسة هنا قبل الإرسال).
 */

export type RushdReply =
  | { kind: 'answer'; faq: FaqItem; contact?: Contact; related: FaqItem[] }
  | { kind: 'search'; results: SearchItem[] }
  | { kind: 'none' }
  | { kind: 'sensitive'; found: SensitiveKind[] }
  | { kind: 'greeting' }
  | { kind: 'thanks' }

const GREETINGS = ['السلام عليكم', 'مرحبا', 'اهلا', 'هلا', 'صباح الخير', 'مساء الخير', 'هاي']
const THANKS = ['شكرا', 'يعطيك العافيه', 'جزاك الله خير', 'مشكور', 'تسلم']

const ANSWER_THRESHOLD = 2.2
/** حد أعلى للاقتراحات البديلة حتى لا يعرض رُشد صفحات غير ذات صلة */
const SEARCH_THRESHOLD = 2

export function answer(
  question: string,
  faq: FaqItem[],
  index: SearchItem[],
  contacts: Contact[],
): RushdReply {
  const sensitive = detectSensitive(question)
  if (sensitive.length) return { kind: 'sensitive', found: sensitive }

  const norm = normalizeArabic(question)
  const tokens = tokenize(question)

  if (!tokens.length || tokens.length <= 2) {
    if (THANKS.some((t) => norm.includes(normalizeArabic(t)))) return { kind: 'thanks' }
    if (GREETINGS.some((g) => norm.startsWith(normalizeArabic(g)))) return { kind: 'greeting' }
  }

  const scored = faq
    .map((f) => {
      let score = scoreFields(tokens, [
        { text: f.question, weight: 3 },
        { text: f.keywords.join(' '), weight: 3 },
        { text: f.answer, weight: 0.6 },
      ])
      // مطابقة عبارة مفتاحية كاملة داخل السؤال
      for (const k of f.keywords) {
        const nk = normalizeArabic(k)
        if (nk.length >= 3 && norm.includes(nk)) score += 2
      }
      return { f, score }
    })
    .sort((a, b) => b.score - a.score)

  const best = scored[0]
  if (best && best.score >= ANSWER_THRESHOLD) {
    const contact = best.f.contactId ? contacts.find((c) => c.id === best.f.contactId) : undefined
    const related = scored
      .slice(1, 4)
      .filter((s) => s.score >= ANSWER_THRESHOLD * 0.8)
      .map((s) => s.f)
    return { kind: 'answer', faq: best.f, contact, related }
  }

  const results = searchItems(question, index.filter((i) => !i.id.startsWith('faq-')), 4)
    .filter((r) => r.score >= SEARCH_THRESHOLD)
    .map((r) => r.item)
  if (results.length) return { kind: 'search', results }
  return { kind: 'none' }
}
