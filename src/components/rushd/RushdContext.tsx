import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface RushdCtx {
  isOpen: boolean
  pendingQuestion?: string
  open: (question?: string) => void
  close: () => void
  consumeQuestion: () => string | undefined
}

const Ctx = createContext<RushdCtx | null>(null)

export function RushdProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const [pendingQuestion, setPending] = useState<string | undefined>()

  const open = useCallback((q?: string) => {
    setPending(q)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const consumeQuestion = useCallback(() => {
    const q = pendingQuestion
    setPending(undefined)
    return q
  }, [pendingQuestion])

  const value = useMemo(() => ({ isOpen, pendingQuestion, open, close, consumeQuestion }), [isOpen, pendingQuestion, open, close, consumeQuestion])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useRushd() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useRushd must be used inside RushdProvider')
  return c
}
