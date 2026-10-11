import { API_URL, SUGGESTIONS_ENABLED } from './config'

export type SuggestionCategory = 'فكرة' | 'ملاحظة' | 'مبادرة'

export interface SuggestionInput {
  category: SuggestionCategory
  title: string
  details: string
  /** صفة المرسل اختيارية ولا تحدد هويته */
  senderType?: 'ولي أمر' | 'طالبة' | 'منسوبة' | ''
}

export type SubmitResult =
  | { ok: true; trackingCode: string }
  | { ok: false; reason: 'not-enabled' | 'error'; message: string }

/**
 * إرسال الاقتراح.
 * في المرحلة الأولى لا يوجد خادم، فلا يُحفظ أي شيء ولا يُرسل.
 * لا نستخدم localStorage كقاعدة بيانات للاقتراحات عمدًا.
 */
export async function submitSuggestion(input: SuggestionInput): Promise<SubmitResult> {
  if (!SUGGESTIONS_ENABLED) {
    return {
      ok: false,
      reason: 'not-enabled',
      message: 'الإرسال غير مفعّل في هذه النسخة التجريبية؛ لم يُحفظ اقتراحك ولم يُرسل.',
    }
  }
  try {
    const res = await fetch(`${API_URL}/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = (await res.json()) as { trackingCode: string }
    return { ok: true, trackingCode: data.trackingCode }
  } catch {
    return { ok: false, reason: 'error', message: 'تعذّر إرسال الاقتراح الآن. حاول مرة أخرى لاحقًا.' }
  }
}
