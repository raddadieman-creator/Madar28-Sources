import { sendToSchool, type InboxKind } from './schoolApp'

export type SuggestionCategory = 'فكرة' | 'ملاحظة' | 'مبادرة'

export interface SuggestionInput {
  category: SuggestionCategory
  title: string
  details: string
  /** صفة المرسل اختيارية ولا تحدد هويته */
  senderType?: 'ولي أمر' | 'طالبة' | 'منسوبة' | ''
}

export type SubmitResult = { ok: true; trackingCode: string } | { ok: false; message: string }

const KIND: Record<SuggestionCategory, InboxKind> = { فكرة: 'idea', ملاحظة: 'note', مبادرة: 'initiative' }

/** إرسال المشاركة إلى المدرسة؛ تصل للمديرة في صفحة «المشاركات» برقم متابعة. */
export async function submitSuggestion(input: SuggestionInput): Promise<SubmitResult> {
  const res = await sendToSchool({
    p_source: 'voice',
    p_kind: KIND[input.category],
    p_topic: input.title.trim(),
    p_details: input.details.trim(),
    p_sender_type: input.senderType || undefined,
  })
  return res.ok ? { ok: true, trackingCode: String(res.refNo) } : res
}
