import { ExternalLink, Mic, MicOff, Send, Volume2, VolumeX, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SourceLink, sourcePath } from '../SourceLink'
import { Link } from 'react-router-dom'
import { suggestedQuestions } from '../../data/faq'
import { useContent } from '../../hooks/useContent'
import { sensitiveLabel } from '../../lib/privacy'
import { canSpeak, getRecognition, speak, stopSpeaking } from '../../lib/speech'
import { content } from '../../services/contentService'
import { answer, type RushdReply } from '../../services/rushdEngine'
import { getSearchIndex } from '../../services/searchService'
import { useRushd } from './RushdContext'
import { RushdAvatar } from './RushdAvatar'
import { RushdBot } from './RushdBot'

interface Message {
  id: number
  from: 'user' | 'rushd'
  text: string
  reply?: RushdReply
}

const WELCOME = 'أهلًا بك، أنا رُشد. كيف أساعدك؟'

/** النص الذي يُقرأ صوتيًا لكل رد */
function replyText(r: RushdReply): string {
  switch (r.kind) {
    case 'answer':
      return r.faq.answer
    case 'search':
      return 'لم أجد إجابة مباشرة، لكن هذه الصفحات قد تفيدك.'
    case 'none':
      return 'لا تتوفر لديّ إجابة معتمدة عن هذا السؤال. يمكنك التواصل مع المدرسة مباشرة.'
    case 'sensitive':
      return 'حفاظًا على خصوصيتك لم أعالج هذه الرسالة؛ لأنها تتضمن بيانات شخصية.'
    case 'greeting':
      return 'وعليكم السلام ورحمة الله، مرحبًا بك. كيف أساعدك؟'
    case 'thanks':
      return 'العفو، يسعدني أن أكون في خدمتك.'
  }
}

export function RushdPanel() {
  const { isOpen, close, consumeQuestion, pendingQuestion } = useRushd()
  const { data: faq } = useContent(content.faq)
  const { data: contacts } = useContent(content.contacts)
  const { data: index } = useContent(getSearchIndex)
  const ready = Boolean(faq && contacts && index)

  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: 'rushd', text: WELCOME }])
  const [input, setInput] = useState('')
  const [autoRead, setAutoRead] = useState(false)
  const [speakingId, setSpeakingId] = useState<number | null>(null)
  const [listening, setListening] = useState(false)
  const [typing, setTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null)
  const nextId = useRef(1)

  const speechOk = useMemo(() => canSpeak(), [])
  const Recognition = useMemo(() => getRecognition(), [])

  function ask(raw: string) {
    const q = raw.trim()
    if (!q || !faq || !contacts || !index) return
    const reply = answer(q, faq, index, contacts)
    const userId = nextId.current++
    const botId = nextId.current++
    setMessages((m) => [
      ...m,
      { id: userId, from: 'user', text: reply.kind === 'sensitive' ? 'رسالة أُخفيت لاحتوائها على بيانات شخصية' : q },
    ])
    setInput('')
    setTyping(true)
    // مهلة قصيرة تُظهر «رُشد» وهو يكتب، ثم تظهر الإجابة
    window.setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: botId, from: 'rushd', text: replyText(reply), reply }])
      if (autoRead && speechOk) {
        setSpeakingId(botId)
        speak(replyText(reply), () => setSpeakingId(null))
      }
    }, 650)
  }

  // سؤال مُمرَّر من خارج النافذة (مثل البحث في الرئيسية)
  useEffect(() => {
    if (isOpen && ready && pendingQuestion) {
      const q = consumeQuestion()
      if (q) ask(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, ready, pendingQuestion])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 60)
    else {
      stopSpeaking()
      setSpeakingId(null)
      recRef.current?.abort?.()
    }
  }, [isOpen])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  function toggleSpeak(m: Message) {
    if (speakingId === m.id) {
      stopSpeaking()
      setSpeakingId(null)
      return
    }
    setSpeakingId(m.id)
    speak(m.text, () => setSpeakingId(null))
  }

  function toggleListen() {
    if (!Recognition) return
    if (listening) {
      recRef.current?.stop()
      return
    }
    const rec = new Recognition()
    rec.lang = 'ar-SA'
    rec.interimResults = false
    rec.maxAlternatives = 1
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript as string | undefined
      if (text) ask(text)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    setListening(true)
    rec.start()
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rushd-title"
      className="sheet-enter fixed inset-0 z-50 flex flex-col bg-white md:inset-auto md:bottom-6 md:end-6 md:h-[min(640px,calc(100vh-3rem))] md:w-[400px] md:overflow-hidden md:rounded-3xl md:border md:border-lav-100 md:shadow-lift"
    >
      {/* الرأس */}
      <div className="flex items-center gap-3 border-b border-lav-100 bg-gradient-to-l from-lav-50 to-sage-50 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <RushdAvatar size={44} thinking={typing} />
        <div className="min-w-0 flex-1">
          <h2 id="rushd-title" className="text-base font-semibold">
            رُشد
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <span className="h-2 w-2 rounded-full bg-sage-500" aria-hidden="true" />
            {typing ? 'يكتب الآن…' : 'مساعد مدار 28'}
          </p>
        </div>
        {speechOk && (
          <button
            type="button"
            onClick={() => {
              setAutoRead((v) => !v)
              stopSpeaking()
              setSpeakingId(null)
            }}
            className={`rounded-xl p-2 transition-colors ${autoRead ? 'bg-lav-600 text-white' : 'text-ink-600 hover:bg-white'}`}
            aria-pressed={autoRead}
            title={autoRead ? 'إيقاف القراءة التلقائية' : 'قراءة الإجابات صوتيًا تلقائيًا'}
          >
            {autoRead ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            <span className="sr-only">القراءة الصوتية التلقائية</span>
          </button>
        )}
        <button type="button" onClick={close} className="rounded-xl p-2 text-ink-600 hover:bg-white" aria-label="إغلاق رُشد">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* الرسائل */}
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-lav-25 px-4 py-4" aria-live="polite">
        {messages.map((m) =>
          m.id === 0 ? (
            <div key={m.id} className="bubble-in flex flex-col items-center px-2 pb-1 pt-2 text-center">
              <div className="rushd-float">
                <RushdBot size={92} body />
              </div>
              <p className="mt-3 text-base font-semibold text-ink-900">أهلًا بك، أنا رُشد</p>
              <p className="mt-1 text-sm text-ink-600">كيف أساعدك؟</p>
            </div>
          ) : m.from === 'user' ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-se-md bg-lav-600 px-4 py-2.5 text-sm text-white">{m.text}</p>
            </div>
          ) : (
            <div key={m.id} className="bubble-in flex items-start justify-start gap-2">
              <span className="mt-0.5 shrink-0">
                <RushdBot size={28} animated={false} />
              </span>
              <div className="max-w-[86%] rounded-2xl rounded-ss-md border border-lav-100 bg-white px-4 py-3 text-sm text-ink-800 shadow-soft">
                <ReplyBody m={m} onAsk={ask} onNavigate={() => window.innerWidth < 768 && close()} />
                {speechOk && (
                  <button
                    type="button"
                    onClick={() => toggleSpeak(m)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-lav-700 hover:text-lav-800"
                  >
                    {speakingId === m.id ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    {speakingId === m.id ? 'إيقاف القراءة' : 'الاستماع إلى الإجابة'}
                  </button>
                )}
              </div>
            </div>
          ),
        )}

        {typing && (
          <div className="bubble-in flex items-center gap-2" role="status" aria-label="رُشد يكتب">
            <RushdBot size={28} thinking animated={false} />
            <span className="flex gap-1 rounded-2xl rounded-ss-md border border-lav-100 bg-white px-4 py-3 shadow-soft">
              <span className="typing-dot h-2 w-2 rounded-full bg-lav-400" />
              <span className="typing-dot h-2 w-2 rounded-full bg-lav-400" />
              <span className="typing-dot h-2 w-2 rounded-full bg-lav-400" />
            </span>
          </div>
        )}

        {messages.length === 1 && (
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {suggestedQuestions.map((q) => (
              <button key={q} type="button" className="chip text-xs" onClick={() => ask(q)} disabled={!ready}>
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* الإدخال */}
      <form
        className="border-t border-lav-100 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
      >
        <div className="flex items-center gap-2">
          <label htmlFor="rushd-input" className="sr-only">
            السؤال
          </label>
          <input
            ref={inputRef}
            id="rushd-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? 'أستمع…' : 'سؤالك هنا…'}
            className="field py-2.5"
            autoComplete="off"
            maxLength={300}
          />
          {Recognition && (
            <button
              type="button"
              onClick={toggleListen}
              className={`rounded-xl p-2.5 transition-colors ${listening ? 'bg-sage-500 text-white' : 'bg-sage-50 text-sage-700 hover:bg-sage-100'}`}
              aria-pressed={listening}
              title="اسأل بصوتك"
            >
              {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              <span className="sr-only">{listening ? 'إيقاف الاستماع' : 'السؤال الصوتي'}</span>
            </button>
          )}
          <button type="submit" className="rounded-xl bg-lav-600 p-2.5 text-white hover:bg-lav-700 disabled:opacity-40" disabled={!input.trim() || !ready || typing}>
            <Send className="h-5 w-5 -scale-x-100" />
            <span className="sr-only">إرسال</span>
          </button>
        </div>
      </form>
    </div>
  )
}

function ReplyBody({ m, onAsk, onNavigate }: { m: Message; onAsk: (q: string) => void; onNavigate: () => void }) {
  const r = m.reply
  if (!r) return <p>{m.text}</p>

  if (r.kind === 'answer') {
    return (
      <div className="space-y-3">
        <p className="text-xs font-medium text-sage-700">{r.faq.question}</p>
        <p className="leading-7">{r.faq.answer}</p>
        {(r.faq.links?.length || r.faq.to) && (
          <div className="flex flex-wrap gap-2">
            {r.faq.links?.map((l) => (
              <a
                key={l.url}
                href={l.url}
                {...(l.url.startsWith('tel:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                className="inline-flex items-center gap-1 rounded-lg bg-lav-50 px-2.5 py-1.5 text-xs font-medium text-lav-700 hover:bg-lav-100"
              >
                {l.label}
                {!l.url.startsWith('tel:') && <ExternalLink className="h-3 w-3" aria-hidden="true" />}
              </a>
            ))}
            {r.faq.to && (
              <Link
                to={r.faq.to.path}
                onClick={onNavigate}
                className="inline-flex items-center gap-1 rounded-lg bg-sage-50 px-2.5 py-1.5 text-xs font-medium text-sage-700 hover:bg-sage-100"
              >
                {r.faq.to.label}
              </Link>
            )}
          </div>
        )}
        {r.contact && (
          <p className="rounded-xl bg-lav-25 px-3 py-2 text-xs text-ink-600">
            للمتابعة:{' '}
            <Link to={`/contact#${r.contact.id}`} onClick={onNavigate} className="font-medium text-lav-700 underline-offset-4 hover:underline">
              {r.contact.role}
              {r.contact.name && ` — ${r.contact.name}`}
            </Link>
          </p>
        )}
        {r.faq.source ? (
          <div className="flex flex-col gap-1.5 rounded-xl bg-sage-50 px-3 py-2 ring-1 ring-sage-100">
            <SourceLink source={r.faq.source} onNavigate={onNavigate} />
            <Link to={sourcePath(r.faq.source)} onClick={onNavigate} className="inline-flex w-fit items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-sage-700 ring-1 ring-sage-200 hover:bg-sage-100">
              فتح الدليل{r.faq.source.page ? ` عند ص ${r.faq.source.page}` : ''}
            </Link>
          </div>
        ) : (
          <p className="text-[11px] text-ink-400">المصدر: الأسئلة الشائعة المعتمدة في المنصة</p>
        )}
        {r.related.length > 0 && (
          <div className="border-t border-lav-100 pt-2">
            <p className="mb-1.5 text-xs text-ink-500">أسئلة قريبة:</p>
            <div className="flex flex-wrap gap-1.5">
              {r.related.map((f) => (
                <button key={f.id} type="button" onClick={() => onAsk(f.question)} className="chip px-2.5 py-1 text-xs">
                  {f.question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (r.kind === 'search') {
    return (
      <div className="space-y-2">
        <p>لم أجد إجابة مباشرة في الأسئلة المعتمدة، لكن هذه الصفحات قد تفيدك:</p>
        <ul className="space-y-1.5">
          {r.results.map((s) => (
            <li key={s.id}>
              <Link to={s.path} onClick={onNavigate} className="block rounded-lg bg-lav-25 px-3 py-2 hover:bg-lav-50">
                <span className="block text-xs font-medium text-lav-800">{s.title}</span>
                <span className="block text-[11px] text-ink-500">{s.section}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (r.kind === 'none') {
    return (
      <div className="space-y-2">
        <p>لا تتوفر لديّ إجابة معتمدة عن هذا السؤال، ولا أجيب دون مصدر موثّق.</p>
        <p>
          جرّب صياغة أخرى، أو{' '}
          <Link to="/contact" onClick={onNavigate} className="font-medium text-lav-700 underline underline-offset-4">
            تواصل مع المدرسة
          </Link>{' '}
          مباشرة.
        </p>
      </div>
    )
  }

  if (r.kind === 'sensitive') {
    return (
      <div className="space-y-2">
        <p className="font-medium text-ink-900">لم أعالج رسالتك حفاظًا على خصوصيتك.</p>
        <p>
          تبدو الرسالة متضمنة {r.found.map((k) => sensitiveLabel[k]).join(' و')}. لا أحتاج إلى أي بيانات شخصية للإجابة؛ أعد كتابة السؤال
          دونها.
        </p>
      </div>
    )
  }

  return <p>{m.text}</p>
}
