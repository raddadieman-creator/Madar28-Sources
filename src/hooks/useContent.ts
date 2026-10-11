import { useEffect, useState } from 'react'

/** تحميل محتوى غير متزامن من طبقة الخدمات مع حالات التحميل والخطأ */
export function useContent<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | undefined>()
  const [error, setError] = useState<string | undefined>()
  useEffect(() => {
    let alive = true
    loader()
      .then((d) => alive && setData(d))
      .catch((e: Error) => alive && setError(e.message))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { data, error, loading: !data && !error }
}
