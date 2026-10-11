/**
 * القراءة الصوتية (تحويل النص إلى كلام) والإدخال الصوتي — كلاهما من المتصفح نفسه،
 * دون إرسال النص إلى خدمات خارجية من طرف المنصة.
 */
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

function arabicVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  return voices.find((v) => v.lang === 'ar-SA') ?? voices.find((v) => v.lang.toLowerCase().startsWith('ar'))
}

export function hasArabicVoice(): boolean {
  if (!canSpeak()) return false
  return Boolean(arabicVoice())
}

export function speak(text: string, onEnd?: () => void): boolean {
  if (!canSpeak()) return false
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ar-SA'
  const v = arabicVoice()
  if (v) u.voice = v
  u.rate = 0.95
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  window.speechSynthesis.speak(u)
  return true
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type RecognitionCtor = new () => any
export function getRecognition(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition
}
