import { useEffect } from 'react'

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | مدار 28` : 'مدار 28 | المنصة الرقمية للمتوسطة الثامنة والعشرين'
  }, [title])
}
