import {
  Award, BookOpen, Brain, Bus, CalendarDays, CircleCheck, CircleHelp, CirclePlay, ClipboardList, Clock, Compass,
  Crown, FlaskConical, Flag, Gem, Globe, GraduationCap, Handshake, Heart, HeartHandshake, House, Landmark,
  LayoutGrid, Leaf, Library, Lightbulb, Lock, MessageCircleHeart, Monitor, Mountain, Pencil, Phone, Rocket,
  Scale, School, Shield, ShieldCheck, Smile, Sparkles, Sun, Trophy, Users, type LucideIcon, type LucideProps,
} from 'lucide-react'

/**
 * سجل الأيقونات: يربط أسماء الأيقونات المستخدمة في ملفات البيانات بمكونات Lucide.
 * الاستيراد الانتقائي يُبقي حجم الحزمة صغيرًا. لإضافة أيقونة جديدة أضيفيها هنا.
 */
const registry: Record<string, LucideIcon> = {
  award: Award, book: BookOpen, brain: Brain, bus: Bus, calendar: CalendarDays, 'check-circle': CircleCheck,
  help: CircleHelp, play: CirclePlay, clipboard: ClipboardList, clock: Clock, compass: Compass, crown: Crown,
  flask: FlaskConical, flag: Flag, gem: Gem, globe: Globe, graduation: GraduationCap, handshake: Handshake,
  heart: Heart, 'heart-handshake': HeartHandshake, home: House, landmark: Landmark, grid: LayoutGrid, leaf: Leaf,
  library: Library, lightbulb: Lightbulb, lock: Lock, message: MessageCircleHeart, monitor: Monitor,
  mountain: Mountain, pencil: Pencil, phone: Phone, rocket: Rocket, scale: Scale, school: School, shield: Shield,
  'shield-check': ShieldCheck, smile: Smile, sparkles: Sparkles, sun: Sun, trophy: Trophy, users: Users,
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = registry[name] ?? CircleHelp
  return <C aria-hidden="true" strokeWidth={1.75} {...props} />
}
