import { RushdBot } from './RushdBot'

/** رأس «رُشد» للأزرار والنوافذ */
export function RushdAvatar({ size = 40, thinking = false }: { size?: number; thinking?: boolean }) {
  return <RushdBot size={size} thinking={thinking} />
}
