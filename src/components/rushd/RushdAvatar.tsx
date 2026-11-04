import { RushdBot, useAliveMood, type RushdMood } from './RushdBot'

/** رأس «رُشد» للأزرار والنوافذ: يعيش وحده (يبتسم ويلوّح أحيانًا) ما لم يُعطَ شعورًا محددًا */
export function RushdAvatar({ size = 40, thinking = false, mood }: { size?: number; thinking?: boolean; mood?: RushdMood }) {
  const alive = useAliveMood('idle', 9000 + Math.round(size * 37) % 3000)
  return <RushdBot size={size} mood={mood ?? (thinking ? 'think' : alive)} />
}
