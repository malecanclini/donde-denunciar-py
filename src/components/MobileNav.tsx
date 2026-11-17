import { BookOpen, List, Map, Phone } from 'lucide-react';
import type { TabId } from '../types/map';

interface MobileNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  filteredCount: number;
}

export function MobileNav({ activeTab, onSelectTab, filteredCount }: MobileNavProps) {
  const items: Array<{ id: TabId; label: string; icon: typeof Map; badge?: number }> = [
    { id: 'mapa', label: 'Mapa', icon: Map },
    { id: 'centros', label: 'Listado', icon: List, badge: filteredCount },
    { id: 'telefonos', label: 'Teléfonos', icon: Phone },
    { id: 'info', label: 'Guía', icon: BookOpen },
  ];

  return (
    <nav
      aria-label="Navegación móvil"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#14141b]/95 backdrop-blur-md border-t border-[#e2e1ea] dark:border-[#2a2a36] pb-safe transition-colors duration-200"
    >
      <div className="grid grid-cols-4 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[54px] py-1.5 px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e05c7a] cursor-pointer ${
                isActive
                  ? 'text-[#d63042] dark:text-[#e05c7a]'
                  : 'text-[#646177] dark:text-[#9895a8] hover:text-[#14141b] dark:hover:text-[#f0eef5]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#e05c7a]" />
              )}
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-1 whitespace-nowrap">
                {item.label}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="ml-1 font-mono-num text-[10px] opacity-80">
                    ({item.badge > 999 ? '999+' : item.badge})
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
