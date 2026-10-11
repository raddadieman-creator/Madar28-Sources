import { Ellipsis } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { bottomNav } from '../../data/navigation'
import { Icon } from '../ui/Icon'
import { RushdAvatar } from '../rushd/RushdAvatar'
import { useRushd } from '../rushd/RushdContext'

/** شريط التنقل السفلي للجوال والتابلت، ورُشد في المنتصف */
export function BottomNav({ onMore }: { onMore: () => void }) {
  const { open } = useRushd()
  const item = (path: string, label: string, icon: string) => (
    <NavLink
      key={path}
      to={path}
      end={path === '/'}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${isActive ? 'font-medium text-lav-700' : 'text-ink-500'}`
      }
    >
      <Icon name={icon} className="h-[22px] w-[22px]" />
      {label}
    </NavLink>
  )
  return (
    <nav
      aria-label="التنقل السريع"
      className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-lav-100 bg-white/95 backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-xl items-end px-2">
        {item(bottomNav[0].path, bottomNav[0].label, bottomNav[0].icon)}
        {item(bottomNav[1].path, bottomNav[1].label, bottomNav[1].icon)}
        <button type="button" onClick={() => open()} className="flex flex-1 flex-col items-center gap-0.5 pb-2 text-[11px] font-medium text-ink-700">
          <span className="-mt-5 rounded-full bg-white p-1 shadow-lift ring-1 ring-lav-100">
            <RushdAvatar size={40} />
          </span>
          رُشد
        </button>
        {item(bottomNav[2].path, bottomNav[2].label, bottomNav[2].icon)}
        <button type="button" onClick={onMore} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] text-ink-500">
          <Ellipsis className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden="true" />
          المزيد
        </button>
      </div>
    </nav>
  )
}
