/** رسوم توضيحية للقيم (SVG أصلي) — يُختار الرسم بحقل illustration في values.ts */
export function ValueIllustration({ name, className = '' }: { name?: string; className?: string }) {
  if (name !== 'perseverance') return null
  // المثابرة: درجات تصعد خطوة خطوة نحو قمة عليها راية، ونقاط تمثّل كل يوم
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-label="رسم: درجات تصعد خطوة بعد خطوة نحو القمة">
      <defs>
        <linearGradient id="vi-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF3E4" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="160" rx="18" fill="url(#vi-sky)" />
      <circle cx="58" cy="40" r="16" fill="#E9C98F" opacity=".55" />
      <path d="M0 132 Q60 112 120 126 T240 118 V160 H0 Z" fill="#EFE6F7" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={40 + i * 26} y={124 - i * 15} width="26" height={12 + i * 15} rx="3" fill={i === 5 ? '#B08A55' : '#C9B3E6'} opacity={0.55 + i * 0.08} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={53 + i * 26} cy={117 - i * 15} r="3" fill="#6C4BA6" />
      ))}
      <path d="M53 117 L79 102 L105 87 L131 72 L157 57 L183 42" fill="none" stroke="#6C4BA6" strokeWidth="1.6" strokeDasharray="3 4" />
      <line x1="183" y1="49" x2="183" y2="14" stroke="#5B4636" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M184 15 L208 21 L184 28 Z" fill="#1B6B3A" />
    </svg>
  )
}
