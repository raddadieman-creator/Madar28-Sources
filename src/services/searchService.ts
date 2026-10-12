import type { FaqItem, SearchItem } from '../types/content'
import { normalizeArabic, tokenize, tokensMatch } from '../lib/arabic'
import { content } from './contentService'

/**
 * فهرس البحث الموحد: يجمع الخدمات والأدلة والبرامج والفعاليات وجهات التواصل.
 * يُبنى مرة واحدة ويُخزَّن في الذاكرة.
 */
let cache: Promise<SearchItem[]> | null = null

export function getSearchIndex(): Promise<SearchItem[]> {
  if (!cache) cache = buildIndex()
  return cache
}

async function buildIndex(): Promise<SearchItem[]> {
  const [services, whatToDo, guidance, programs, initiatives, events, contacts, faq, library, procedures] = await Promise.all([
    content.services(),
    content.whatToDo(),
    content.guidance(),
    content.mawhibaPrograms(),
    content.initiatives(),
    content.events(),
    content.contacts(),
    content.faq(),
    content.library(),
    content.procedures(),
  ])
  const items: SearchItem[] = []
  items.push({
    id: 'nafs',
    title: 'اختبارات نافس',
    description: 'الاختبارات الوطنية للصف الثالث المتوسط في القراءة والرياضيات والعلوم، والنتائج عبر منصة مستقبلهم.',
    section: 'اختبارات نافس',
    path: '/nafs',
    keywords: 'نافس الاختبارات الوطنية ثالث متوسط قراءة رياضيات علوم مستقبلهم',
    icon: 'graduation',
    type: 'خدمة',
  })
  library.forEach((d) => {
    items.push({
      id: `doc-${d.id}`,
      title: `${d.title} ${d.year.split('–')[0].trim()}`,
      description: d.summary,
      section: 'الأدلة والأنظمة',
      path: `/library/${d.id}`,
      keywords: d.tags.join(' ') + ' دليل ' + d.toc.map((t) => t.title).join(' '),
      icon: 'library',
      type: 'دليل',
      year: d.year.split('–')[0].trim(),
      issuer: d.issuer.split('—')[0].trim(),
    })
    d.highlights?.forEach((h, i) =>
      items.push({
        id: `doc-${d.id}-h${i}`,
        title: h.text.length > 70 ? h.text.slice(0, 68) + '…' : h.text,
        description: `${d.title} ${d.year.split('–')[0].trim()}${h.section ? ` — ${h.section}` : ''}${h.page ? `، ص ${h.page}` : ''}`,
        section: 'الأدلة والأنظمة',
        path: `/library/${d.id}${h.page ? `?p=${h.page}` : ''}`,
        keywords: d.tags.join(' '),
        icon: 'book',
        type: 'دليل',
        year: d.year.split('–')[0].trim(),
        issuer: d.issuer.split('—')[0].trim(),
      }),
    )
  })
  procedures.forEach((p) =>
    items.push({
      id: `proc-${p.id}`,
      title: p.title,
      description: p.when,
      section: 'دليلك المدرسي',
      path: `/procedures#${p.id}`,
      keywords: p.tags.join(' ') + ' إجراء ' + p.steps.map((s) => s.text).join(' '),
      icon: p.icon,
      type: 'إجراء',
    }),
  )
  services.forEach((s) =>
    items.push({
      id: `service-${s.id}`,
      title: s.title,
      description: s.summary,
      section: 'الخدمات المدرسية',
      path: s.to ?? `/services#${s.id}`,
      external: s.url,
      keywords: s.tags.join(' '),
      icon: s.icon,
      type: 'خدمة',
    }),
  )
  whatToDo.forEach((w) =>
    items.push({
      id: `wtd-${w.id}`,
      title: `ماذا أفعل إذا: ${w.question}`,
      description: w.steps[0],
      section: 'دليل ماذا أفعل إذا؟',
      path: `/services#wtd-${w.id}`,
      keywords: w.tags.join(' '),
      icon: 'compass',
      type: 'إجراء',
    }),
  )
  guidance.forEach((g) =>
    items.push({
      id: `guide-${g.id}`,
      title: g.title,
      description: g.summary,
      section: 'التوجيه الطلابي',
      path: `/guidance/${g.id}`,
      keywords: g.tags.join(' ') + ' ' + g.sections.map((s) => s.heading).join(' '),
      icon: g.icon,
      type: 'موضوع',
    }),
  )
  programs.forEach((p) =>
    items.push({
      id: `mawhiba-${p.id}`,
      title: p.title,
      description: p.summary,
      section: 'موهبة والإبداع',
      path: `/mawhiba#${p.id}`,
      keywords: p.tags.join(' '),
      icon: p.icon,
      type: 'موضوع',
    }),
  )
  initiatives.forEach((i) =>
    items.push({
      id: `vol-${i.id}`,
      title: i.title,
      description: i.summary,
      section: 'العمل التطوعي',
      path: `/volunteer#${i.id}`,
      keywords: i.tags.join(' ') + ' تطوع',
      icon: i.icon,
      type: 'موضوع',
    }),
  )
  events.forEach((e) =>
    items.push({
      id: `event-${e.id}`,
      title: e.title,
      description: e.description,
      section: 'الفعاليات والتقويم',
      path: `/events/${e.id}`,
      keywords: `${e.category} مناسبة فعالية`,
      icon: 'calendar',
      type: 'فعالية',
    }),
  )
  contacts.forEach((c) =>
    items.push({
      id: `contact-${c.id}`,
      title: c.name ? `${c.role}: ${c.name}` : c.role,
      description: c.responsibility,
      section: 'مركز التواصل',
      path: `/contact#${c.id}`,
      keywords: c.topics.join(' ') + ' تواصل رقم',
      icon: c.icon,
      type: 'تواصل',
    }),
  )
  faq.forEach((f: FaqItem) =>
    items.push({
      id: `faq-${f.id}`,
      title: f.question,
      description: f.answer,
      section: 'أسئلة شائعة',
      path: f.source ? `/library/${f.source.docId}${f.source.page ? `?p=${f.source.page}` : ''}` : (f.to?.path ?? '/'),
      keywords: f.keywords.join(' '),
      icon: 'help',
      type: 'سؤال',
    }),
  )
  return items
}

export interface ScoredItem<T> {
  item: T
  score: number
}

/** تقييم تطابق نص البحث مع حقول مرجّحة */
export function scoreFields(queryTokens: string[], fields: { text: string; weight: number }[]): number {
  if (!queryTokens.length) return 0
  let total = 0
  let matched = 0
  for (const q of queryTokens) {
    let best = 0
    for (const f of fields) {
      for (const t of tokenize(f.text)) {
        const m = tokensMatch(q, t) * f.weight
        if (m > best) best = m
      }
    }
    if (best > 0) matched++
    total += best
  }
  // نكافئ النتائج التي تطابق أكبر عدد من كلمات البحث
  return total * (matched / queryTokens.length)
}

export function searchItems(query: string, index: SearchItem[], limit = 20): ScoredItem<SearchItem>[] {
  const q = tokenize(query)
  const phrase = normalizeArabic(query)
  if (!q.length && phrase.length < 2) return []
  return index
    .map((item) => {
      let score = scoreFields(q, [
        { text: item.title, weight: 3 },
        { text: item.keywords, weight: 2 },
        { text: item.description, weight: 1 },
        { text: item.section, weight: 0.5 },
      ])
      if (phrase.length >= 3 && normalizeArabic(item.title).includes(phrase)) score += 3
      return { item, score }
    })
    .filter((r) => r.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
