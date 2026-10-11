import { NavLink } from 'react-router-dom'
import { mainNav } from '../../data/navigation'
import { school } from '../../data/school'
import { Icon } from '../ui/Icon'
import { RushdAvatar } from '../rushd/RushdAvatar'
import { useRushd } from '../rushd/RushdContext'
import { Brand } from './Brand'

/** القائمة الجانبية للشاشات الكبيرة */
export function Sidebar() {
  const { open } = useRushd()
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-e border-lav-100 bg-white/80 backdrop-blur lg:flex">
      <div className="px-6 pb-4 pt-6">
        <Brand />
      </div>
      <nav aria-label="أقسام المنصة" className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-0.5">
          {mainNav.map((item, i) => (
            <li key={item.path}>
              {item.secondary && !mainNav[i - 1]?.secondary && (
                <p className="mx-3 mb-1 mt-4 border-t border-lav-100 pt-3 text-[11px] font-semibold text-ink-400">أقسام أخرى</p>
              )}
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 ${item.secondary ? 'py-1.5 text-sm' : 'py-2.5 text-[15px]'} transition-colors ${
                    isActive ? 'bg-gradient-to-l from-lav-600 to-lav-500 font-medium text-white shadow-glow' : 'text-ink-600 hover:bg-lav-50 hover:text-ink-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'text-ink-500 group-hover:text-lav-600'
                      }`}
                    >
                      <Icon name={item.icon} className="h-[18px] w-[18px]" />
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <button
          type="button"
          onClick={() => open()}
          className="flex w-full items-center gap-3 rounded-2xl border border-lav-100 bg-gradient-to-l from-lav-50 to-sage-50 p-3 text-start transition-colors hover:border-lav-300"
        >
          <RushdAvatar size={40} />
          <span>
            <span className="block text-sm font-semibold text-ink-900">اسأل رُشد</span>
            <span className="block text-xs text-ink-500">إجابات فورية من دليل المدرسة</span>
          </span>
        </button>
        <p className="mt-3 px-1 text-[11px] leading-5 text-ink-400">{school.fullName}</p>
      </div>
    </aside>
  )
}
