import { Phone } from 'lucide-react';
import type { TabId } from '../types/map';

interface HeaderProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onOpenBwEdition?: () => void;
}

export function Header({ activeTab, onSelectTab, onOpenBwEdition }: HeaderProps) {
  const navItems: Array<{ id: TabId; label: string }> = [
    { id: 'mapa', label: 'Mapa' },
    { id: 'telefonos', label: 'Teléfonos' },
    { id: 'info', label: '¿Cómo denunciar?' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-[#e5e7eb] dark:border-[#1f2937] transition-colors duration-200">
      <div className="hidden sm:flex items-center justify-center gap-4 px-4 py-1.5 bg-[#f9fafb] dark:bg-[#0f172a] border-b border-[#e5e7eb] dark:border-[#1f2937] text-xs text-[#374151] dark:text-[#d1d5db] transition-colors duration-200">
        <span>Servicios gratuitos y confidenciales en Paraguay</span>
        <span aria-hidden="true" className="text-[#9ca3af] dark:text-[#4b5563]">
          ·
        </span>
        <a href="tel:911" className="hover:text-black dark:hover:text-white transition-colors font-mono-num">
          Emergencias <strong className="text-black dark:text-white">911</strong>
        </a>
        <span aria-hidden="true" className="text-[#9ca3af] dark:text-[#4b5563]">
          ·
        </span>
        <a href="tel:137" className="hover:text-black dark:hover:text-white transition-colors font-mono-num">
          SOS Mujer <strong className="text-[#d63042] dark:text-[#ff6b78]">137</strong> (24hs)
        </a>
        <span aria-hidden="true" className="text-[#9ca3af] dark:text-[#4b5563]">
          ·
        </span>
        <a href="tel:133" className="hover:text-black dark:hover:text-white transition-colors font-mono-num">
          Defensoría <strong className="text-black dark:text-white">133</strong>
        </a>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-14 lg:h-16 flex items-center justify-between gap-3 lg:gap-8">
        <button
          type="button"
          onClick={() => onSelectTab('mapa')}
          className="font-display text-lg lg:text-xl font-extrabold tracking-tight text-black dark:text-white whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a] rounded-md cursor-pointer"
        >
          Dónde <span className="text-[#e05c7a]">Denunciar</span>
        </button>

        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a] rounded-sm cursor-pointer ${
                  isActive
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-[#4b5563] dark:text-[#9ca3af] hover:text-black dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && <span className="absolute left-0 right-0 -bottom-[21px] h-0.5 bg-[#e05c7a]" />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenBwEdition && (
            <button
              type="button"
              onClick={onOpenBwEdition}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] dark:bg-[#1f2937] dark:hover:bg-[#374151] border border-[#d1d5db] dark:border-[#374151] text-black dark:text-white text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              title="Abrir copia: Versión Light & Dark - Blanco y Negro (#30DayMapChallenge Día 17)"
            >
              <span className="hidden md:inline">Versión Light & Dark - Blanco y Negro</span>
              <span className="md:hidden">B&amp;N Día 17</span>
            </button>
          )}

          <a
            href="tel:137"
            aria-label="Llamar a SOS Mujer 137 las 24 horas"
            className="inline-flex items-center gap-2 min-h-[44px] lg:min-h-[40px] px-3.5 lg:px-4 py-2 rounded-xl bg-[#d63042] hover:bg-[#ff4757] active:scale-[0.98] text-white text-xs lg:text-sm font-semibold whitespace-nowrap shrink-0 transition-all shadow-sm shadow-[#ff4757]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="font-mono-num font-bold">137</span>
            <span className="hidden sm:inline">SOS Mujer · 24hs</span>
            <span className="sm:hidden">SOS 24hs</span>
          </a>
        </div>
      </div>
    </header>
  );
}
