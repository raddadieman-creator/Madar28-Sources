/**
 * القراءة الصوتية (تحويل النص إلى كلام) والإدخال الصوتي — كلاهما من المتصفح نفسه،
 * دون إرسال النص إلى خدمات خارجية من طرف المنصة.
 *
 * لتقريب الصوت من الصوت البشري:
 * 1) تُقدَّم الأصوات العصبية (Natural / Neural / Enhanced / Premium) على الأصوات التقليدية،
 *    ويُؤخَّر صوت eSpeak الآلي إلى آخر القائمة.
 * 2) يُنظَّف النص من الرموز التي تُقرأ حرفيًا أو تُربك النطق (الروابط، علامات التنصيص، الشرطات…).
 * 3) يُقسَّم الكلام إلى جمل تُنطق متتابعة، فتظهر الوقفات الطبيعية بين الجمل،
 *    ويُتجنَّب انقطاع Chrome في المقاطع الطويلة.
 * جودة الصوت تبقى رهن الأصوات المثبتة في جهاز المستخدم.
 */

/** «رُشد» مساعد؛ يُقدَّم الصوت الذكوري */
const PREFER: 'female' | 'male' = 'male'

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

const FEMALE = /zariyah|hoda|laila|layla|mariam|maryam|salma|amina|amany|reem|sana|fatima|amira|mouna|iman|zeina|noura|female|أنثى/i
const MALE = /hamed|naayf|naif|maged|majed|tarik|shakir|bassel|hamdan|omar|fahed|ali\b|male\b|ذكر/i
const NATURAL = /natural|neural|online|enhanced|premium|wavenet|studio|siri/i
const ROBOTIC = /espeak|compact|festival|mbrola/i

let cached: SpeechSynthesisVoice | undefined
let cacheKey = ''

function score(v: SpeechSynthesisVoice): number {
  let s = 0
  if (ROBOTIC.test(v.name)) s += 100
  if (!NATURAL.test(v.name)) s += 10
  const fem = FEMALE.test(v.name)
  const mal = MALE.test(v.name)
  if (PREFER === 'female') s += fem ? 0 : mal ? 4 : 2
  else s += mal ? 0 : fem ? 4 : 2
  if (v.lang !== 'ar-SA') s += 1
  if (!v.localService) s -= 0.5 // أصوات «Online» في Edge أجود من المحلية غالبًا
  return s
}

function arabicVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('ar'))
  const key = voices.map((v) => v.name).join('|')
  if (key !== cacheKey) {
    cacheKey = key
    cached = voices.sort((a, b) => score(a) - score(b))[0]
  }
  return cached
}

// تحميل قائمة الأصوات مبكرًا؛ Chrome يحمّلها بعد تحميل الصفحة
if (canSpeak()) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', () => arabicVoice())
}

/** اسم الصوت المستخدم */
export function voiceName(): string | undefined {
  if (!canSpeak()) return undefined
  return arabicVoice()?.name
}

export function hasArabicVoice(): boolean {
  if (!canSpeak()) return false
  return Boolean(arabicVoice())
}

/** تهيئة النص للنطق */
export function prepareForSpeech(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[«»"“”]/g, '')
    .replace(/[﴿﴾]/g, '')
    .replace(/(\d+)\s*هـ/g, '$1 هجرية')
    .replace(/(^|\s)أ\.\s*/g, '$1الأستاذة ')
    .replace(/\s+[—–-]\s+/g, '، ')
    .replace(/[()[\]{}]/g, '، ')
    .replace(/[•▪·*#_|/\\]/g, ' ')
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([،,.؛:!؟?])/g, '$1')
    .replace(/([،,.؛:!؟?])(\s*[،,])+/g, '$1')
    .replace(/[،,]+\s*([.!؟?؛])/g, '$1')
    .replace(/([.!؟?؛])\.+/g, '$1')
    .replace(/(^|[.!؟?؛]\s*)[،,]\s*/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** تقسيم النص إلى جمل قصيرة تُنطق متتابعة */
export function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!؟?؛]+[.!؟?؛]*/g) ?? [text]
  const out: string[] = []
  for (const p of parts.map((s) => s.trim()).filter(Boolean)) {
    if (p.length <= 160) {
      out.push(p)
      continue
    }
    // جملة طويلة: تُقسَّم عند الفواصل
    let buf = ''
    for (const piece of p.split(/(?<=،)/)) {
      if ((buf + piece).length > 160 && buf) {
        out.push(buf.trim())
        buf = ''
      }
      buf += piece
    }
    if (buf.trim()) out.push(buf.trim())
  }
  return out
}

let session = 0

export function speak(text: string, onEnd?: () => void): boolean {
  if (!canSpeak()) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const id = ++session
  const chunks = splitSentences(prepareForSpeech(text))
  if (!chunks.length) {
    onEnd?.()
    return true
  }
  const v = arabicVoice()
  const natural = v ? NATURAL.test(v.name) : false
  let i = 0
  const next = () => {
    if (id !== session) return
    if (i >= chunks.length) {
      onEnd?.()
      return
    }
    const u = new SpeechSynthesisUtterance(chunks[i++])
    u.lang = v?.lang ?? 'ar-SA'
    if (v) u.voice = v
    // الأصوات العصبية أطبع بسرعتها الأصلية؛ والتقليدية أوضح مع إبطاء يسير
    u.rate = natural ? 1 : 0.9
    u.pitch = 1
    u.onend = next
    u.onerror = () => {
      if (id === session) onEnd?.()
    }
    synth.speak(u)
  }
  next()
  return true
}

export function stopSpeaking() {
  session++
  if (canSpeak()) window.speechSynthesis.cancel()
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type RecognitionCtor = new () => any
export function getRecognition(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition
}
