import { Search, X } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { getSearchIndex, searchItems } from '../services/searchService'
import { Icon } from './ui/Icon'

/**
 * حقل بحث موحّد مع اقتراحات فورية (نمط combobox وفق إرشادات ARIA).
 * Enter يفتح صفحة النتائج، والأسهم تتنقل بين الاقتراحات.
 */
export function SearchBox({
  size = 'md',
  placeholder = 'البحث عن خدمة أو دليل أو موعد',
  initial = '',
  autoFocus = false,
  onDone,
}: {
  size?: 'md' | 'lg'
  placeholder?: string
  initial?: string
  autoFocus?: boolean
  onDone?: () => void
}) {
  const navigate = useNavigate()
  const { data: index } = useContent(getSearchIndex)
  const [q, setQ] = useState(initial)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => setQ(initial), [initial])

  const results = useMemo(() => (index && q.trim().length >= 2 ? searchItems(q, index, 6) : []), [q, index])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function go(path: string) {
    setOpen(false)
    onDone?.()
    navigate(path)
  }

  function submit() {
    if (active >= 0 && results[active]) return go(results[active].item.path)
    if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const lg = size === 'lg'

  return (
    <div ref={wrapRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          بحث في المنصة
        </label>
        <Search
          className={`pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-lav-500 ${lg ? 'h-6 w-6' : 'h-5 w-5'}`}
          aria-hidden="true"
        />
        <input
          id={`${listId}-input`}
          type="search"
          value={q}
          autoFocus={autoFocus}
          autoComplete="off"
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(a + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(a - 1, -1))
            } else if (e.key === 'Escape') setOpen(false)
          }}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          className={`w-full appearance-none rounded-2xl border border-lav-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-lav-500 focus:outline-none focus:ring-4 focus:ring-lav-100 [&::-webkit-search-cancel-button]:hidden ${
            lg ? 'border-white/0 py-4 pe-28 ps-14 text-base shadow-lift focus:ring-white/40 md:text-lg' : 'py-2.5 pe-10 ps-12 text-sm'
          }`}
        />
        {q && !lg && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-400 hover:text-ink-700"
            aria-label="مسح البحث"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {lg && (
          <button type="submit" className="btn-primary absolute end-2 top-1/2 -translate-y-1/2 px-5">
            بحث
          </button>
        )}
      </form>

      {open && results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-lav-100 bg-white p-1.5 shadow-lift"
        >
          {results.map(({ item }, i) => (
            <li
              key={item.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault()
                go(item.path)
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 ${i === active ? 'bg-lav-50' : ''}`}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lav-50 text-lav-700">
                <Icon name={item.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink-900">{item.title}</span>
                <span className="block text-xs text-ink-500">{item.section}</span>
              </span>
            </li>
          ))}
          <li
            role="option"
            aria-selected={false}
            onMouseDown={(e) => {
              e.preventDefault()
              go(`/search?q=${encodeURIComponent(q.trim())}`)
            }}
            className="cursor-pointer rounded-xl px-3 py-2 text-center text-sm font-medium text-lav-700 hover:bg-lav-50"
          >
            كل النتائج عن «{q.trim()}»
          </li>
        </ul>
      )}
    </div>
  )
}
