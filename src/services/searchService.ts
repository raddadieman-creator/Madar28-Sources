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
  const [services, whatToDo, guidance, programs, initiatives, events, contacts, faq] = await Promise.all([
    content.services(),
    content.whatToDo(),
    content.guidance(),
    content.mawhibaPrograms(),
    content.initiatives(),
    content.events(),
    content.contacts(),
    content.faq(),
  ])
  const items: SearchItem[] = []
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
    }),
  )
  contacts.forEach((c) =>
    items.push({
      id: `contact-${c.id}`,
      title: c.name ? `${c.role}: ${c.name}` : c.role,
      description: c.responsibility,
      section: 'تواصل معنا',
      path: `/contact#${c.id}`,
      keywords: c.topics.join(' ') + ' تواصل رقم',
      icon: c.icon,
    }),
  )
  faq.forEach((f: FaqItem) =>
    items.push({
      id: `faq-${f.id}`,
      title: f.question,
      description: f.answer,
      section: 'أسئلة شائعة',
      path: f.to?.path ?? '/',
      keywords: f.keywords.join(' '),
      icon: 'help',
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
