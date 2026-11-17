import { ArrowLeft, Phone } from 'lucide-react';
import type { TabId, ThemeMode } from '../../types/map';

interface BwHeaderProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onBackToOriginal: () => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
}

export function BwHeader({
  activeTab,
  onSelectTab,
  onBackToOriginal,
  theme,
  onSetTheme,
}: BwHeaderProps) {
  const navItems: Array<{ id: TabId; label: string }> = [
    { id: 'mapa', label: 'Mapa' },
    { id: 'telefonos', label: 'Teléfonos' },
    { id: 'info', label: '¿Cómo denunciar?' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] dark:bg-[#000000] border-b border-[#d4d4d4] dark:border-[#262626] transition-colors duration-200">
      <div className="hidden sm:flex items-center justify-center gap-4 px-4 py-1.5 bg-[#f5f5f5] dark:bg-[#111111] border-b border-[#e5e5e5] dark:border-[#262626] text-xs text-[#404040] dark:text-[#d4d4d4] transition-colors duration-200">
        <span className="font-semibold text-[#000000] dark:text-[#ffffff]">
          Versión Light & Dark - Blanco y Negro
        </span>
        <span aria-hidden="true" className="text-[#a3a3a3] dark:text-[#525252]">
          ·
        </span>
        <span>#30DayMapChallenge Día 17</span>
        <span aria-hidden="true" className="text-[#a3a3a3] dark:text-[#525252]">
          ·
        </span>
        <a href="tel:911" className="hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors font-mono-num">
          Emergencias <strong className="text-[#000000] dark:text-[#ffffff]">911</strong>
        </a>
        <span aria-hidden="true" className="text-[#a3a3a3] dark:text-[#525252]">
          ·
        </span>
        <a href="tel:137" className="hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors font-mono-num">
          SOS Mujer <strong className="text-[#000000] dark:text-[#ffffff]">137</strong> (24hs)
        </a>
      </div>

      <div className="max-w-[1440px] mx-auto px-2.5 sm:px-4 lg:px-6 h-14 lg:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => onSelectTab('mapa')}
            className="font-display text-sm sm:text-lg lg:text-xl font-extrabold tracking-tight text-[#000000] dark:text-[#ffffff] whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000] dark:focus-visible:ring-[#ffffff] rounded-md cursor-pointer"
          >
            Dónde Denunciar
          </button>
          <span className="hidden xl:inline text-xs text-[#525252] dark:text-[#a3a3a3] whitespace-nowrap truncate">
            · Blanco y Negro
          </span>
        </div>

        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000] dark:focus-visible:ring-[#ffffff] rounded-sm cursor-pointer ${
                  isActive
                    ? 'text-[#000000] dark:text-[#ffffff] font-semibold'
                    : 'text-[#525252] dark:text-[#a3a3a3] hover:text-[#000000] dark:hover:text-[#ffffff]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[21px] h-0.5 bg-[#000000] dark:bg-[#ffffff]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onBackToOriginal}
            className="inline-flex items-center gap-1 min-h-[38px] px-2 sm:px-3 py-1.5 rounded-xl bg-[#f5f5f5] hover:bg-[#e5e5e5] dark:bg-[#171717] dark:hover:bg-[#262626] border border-[#d4d4d4] dark:border-[#404040] text-[#000000] dark:text-[#ffffff] text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            title="Volver a la versión original a color"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Versión original</span>
            <span className="sm:hidden">Color</span>
          </button>

          {/* Selector siempre visible en móvil y desktop: ☀️ Claro / 🌙 Oscuro */}
          <div
            role="group"
            aria-label="Selector de modo Claro y Oscuro"
            className="inline-flex items-center rounded-xl border border-[#000000] dark:border-[#ffffff] bg-[#f5f5f5] dark:bg-[#171717] p-0.5 shrink-0"
          >
            <button
              type="button"
              onClick={() => onSetTheme('light')}
              aria-pressed={theme === 'light'}
              className={`inline-flex items-center gap-1 min-h-[34px] px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#000000] text-[#ffffff]'
                  : 'text-[#000000] dark:text-[#ffffff] hover:bg-[#e5e5e5] dark:hover:bg-[#262626]'
              }`}
            >
              <span className="bw-emoji" aria-hidden="true">
                ☀️
              </span>
              <span>Claro</span>
            </button>
            <span aria-hidden="true" className="text-[10px] text-[#737373] dark:text-[#a3a3a3] px-0.5 select-none">
              /
            </span>
            <button
              type="button"
              onClick={() => onSetTheme('dark')}
              aria-pressed={theme === 'dark'}
              className={`inline-flex items-center gap-1 min-h-[34px] px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#ffffff] text-[#000000]'
                  : 'text-[#000000] dark:text-[#ffffff] hover:bg-[#e5e5e5] dark:hover:bg-[#262626]'
              }`}
            >
              <span className="bw-emoji" aria-hidden="true">
                🌙
              </span>
              <span>Oscuro</span>
            </button>
          </div>

          <a
            href="tel:137"
            aria-label="Llamar a SOS Mujer 137 las 24 horas"
            className="inline-flex items-center gap-1.5 min-h-[38px] px-2.5 sm:px-4 py-1.5 rounded-xl bg-[#000000] hover:bg-[#262626] text-[#ffffff] dark:bg-[#ffffff] dark:hover:bg-[#e5e5e5] dark:text-[#000000] text-xs lg:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#737373]"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="font-mono-num font-bold">137</span>
            <span className="hidden md:inline">SOS Mujer · 24hs</span>
          </a>
        </div>
      </div>
    </header>
  );
}
