import { useEffect, useState } from 'react';
import { Loader2, MapPin, Navigation, Phone, Search, X } from 'lucide-react';
import { CATEGORY_LABELS, FILTER_LABELS, buildTelHref, formatDepartment, formatDistance } from '../../data/resources';
import type { FilterCategory, MapPoint, SortedPointItem, UserLocation } from '../../types/map';
import { BW_CATEGORY_ICONS } from '../../utils/bwLeafletIcons';

const PAGE_SIZE = 40;

interface BwSidebarProps {
  items: SortedPointItem[];
  departments: string[];
  departmentFilter: string;
  onDepartmentChange: (dept: string) => void;
  categoryFilter: FilterCategory;
  onCategoryChange: (cat: FilterCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedUid: string | null;
  onSelectPoint: (point: MapPoint) => void;
  userLocation: UserLocation | null;
  locating: boolean;
  onRequestLocation: () => void;
  loadingGeo: boolean;
  geoError: string | null;
}

export function BwSidebar({
  items,
  departments,
  departmentFilter,
  onDepartmentChange,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  selectedUid,
  onSelectPoint,
  userLocation,
  locating,
  onRequestLocation,
  loadingGeo,
  geoError,
}: BwSidebarProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [categoryFilter, departmentFilter, searchQuery, items.length]);

  const visibleItems = items.slice(0, visibleCount);
  const remaining = Math.max(0, items.length - visibleCount);
  const filterKeys: FilterCategory[] = ['all', 'legal', 'psicologico', 'policial', 'albergue'];

  return (
    <div className="h-full flex flex-col bg-[#ffffff] text-[#000000] dark:bg-[#000000] dark:text-[#ffffff] transition-colors duration-200">
      <div className="p-4 border-b border-[#e5e5e5] dark:border-[#262626] space-y-3 shrink-0">
        <div className="flex items-center gap-2 bg-[#ffffff] dark:bg-[#111111] border border-[#d4d4d4] dark:border-[#404040] focus-within:border-[#000000] dark:focus-within:border-[#ffffff] rounded-xl px-3 min-h-[44px] transition-colors">
          <Search className="w-4 h-4 text-[#737373] dark:text-[#a3a3a3] shrink-0" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar ciudad, barrio, centro..."
            aria-label="Buscar centro o ciudad"
            className="w-full bg-transparent text-sm text-[#000000] dark:text-[#ffffff] placeholder:text-[#737373] dark:placeholder:text-[#a3a3a3] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              className="p-1 text-[#737373] dark:text-[#a3a3a3] hover:text-[#000000] dark:hover:text-[#ffffff] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            aria-label="Filtrar por departamento"
            className="flex-1 min-h-[40px] px-3 py-1.5 rounded-xl bg-[#ffffff] dark:bg-[#111111] border border-[#d4d4d4] dark:border-[#404040] text-xs font-medium text-[#000000] dark:text-[#ffffff] focus:outline-none focus:border-[#000000] dark:focus:border-[#ffffff] transition-colors"
          >
            <option value="all">Todo Paraguay</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {formatDepartment(dept)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onRequestLocation}
            disabled={locating}
            className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              userLocation
                ? 'bg-[#000000] text-[#ffffff] border-[#000000] dark:bg-[#ffffff] dark:text-[#000000] dark:border-[#ffffff]'
                : 'bg-[#ffffff] dark:bg-[#111111] border-[#d4d4d4] dark:border-[#404040] text-[#000000] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#1f1f1f]'
            }`}
          >
            {locating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>Cerca de mí</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {filterKeys.map((key) => {
            const isActive = categoryFilter === key;
            const icon = key === 'all' ? null : BW_CATEGORY_ICONS[key];
            const label = key === 'psicologico' ? 'Salud / Psic.' : FILTER_LABELS[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onCategoryChange(key)}
                className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#000000] text-[#ffffff] border-[#000000] dark:bg-[#ffffff] dark:text-[#000000] dark:border-[#ffffff]'
                    : 'bg-[#ffffff] dark:bg-[#111111] text-[#404040] dark:text-[#d4d4d4] border-[#d4d4d4] dark:border-[#404040] hover:text-[#000000] dark:hover:text-[#ffffff]'
                }`}
              >
                {icon && (
                  <span className={key === 'psicologico' ? 'font-mono-num font-bold' : 'bw-emoji'} aria-hidden="true">
                    {icon}
                  </span>
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between text-xs text-[#525252] dark:text-[#a3a3a3] shrink-0">
        <span>
          Mostrando{' '}
          <strong className="font-mono-num text-[#000000] dark:text-[#ffffff]">
            {items.length.toLocaleString('es-PY')}
          </strong>{' '}
          {items.length === 1 ? 'lugar' : 'lugares'}
          {userLocation && ' · ordenados por cercanía'}
        </span>
        {loadingGeo && <span className="text-[#000000] dark:text-[#ffffff]">Actualizando...</span>}
      </div>

      {geoError && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-[#f5f5f5] dark:bg-[#171717] border border-[#000000] dark:border-[#ffffff] text-xs text-[#000000] dark:text-[#ffffff]">
          {geoError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#e5e5e5] dark:divide-[#262626] pb-24 lg:pb-6">
        {items.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="font-display text-sm font-bold text-[#000000] dark:text-[#ffffff]">
              Sin resultados para este filtro
            </p>
            <p className="text-xs text-[#525252] dark:text-[#a3a3a3]">
              Probá cambiar el departamento, la categoría o limpiar la búsqueda.
            </p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onCategoryChange('all');
                onDepartmentChange('all');
              }}
              className="mt-2 inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-xl bg-[#000000] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#000000] text-xs font-semibold cursor-pointer"
            >
              Ver todos los puntos
            </button>
          </div>
        ) : (
          <>
            {visibleItems.map(({ point, distanceKm }) => {
              const isSelected = selectedUid === point.uid;
              const telHref = buildTelHref(point.phone);
              const icon = BW_CATEGORY_ICONS[point.category];

              return (
                <article
                  key={point.uid}
                  className={`px-4 py-3.5 transition-colors ${
                    isSelected
                      ? 'bg-[#e5e5e5] dark:bg-[#262626]'
                      : 'hover:bg-[#f5f5f5] dark:hover:bg-[#171717]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectPoint(point)}
                    className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000] dark:focus-visible:ring-[#ffffff] rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-[#525252] dark:text-[#a3a3a3] mb-1">
                      <span
                        className={point.category === 'psicologico' ? 'font-mono-num font-bold text-[#000000] dark:text-[#ffffff]' : 'bw-emoji'}
                        aria-hidden="true"
                      >
                        {icon}
                      </span>
                      <span className="font-semibold text-[#000000] dark:text-[#ffffff]">
                        {CATEGORY_LABELS[point.category]}
                      </span>
                      {point.isPriority && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-[#262626] dark:text-[#d4d4d4]">
                            Centro especializado
                          </span>
                        </>
                      )}
                      {distanceKm !== null && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num text-[#000000] dark:text-[#ffffff] font-medium">
                            {formatDistance(distanceKm)}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-[14px] font-bold text-[#000000] dark:text-[#ffffff] leading-snug">
                      {point.name}
                    </h3>
                    <p className="text-xs text-[#525252] dark:text-[#a3a3a3] mt-1 leading-relaxed">
                      {point.address || formatDepartment(point.departamento)}
                    </p>
                    <p className="text-xs text-[#404040] dark:text-[#d4d4d4] mt-1.5 line-clamp-1">
                      {point.services.slice(0, 3).join(' · ')}
                    </p>
                  </button>

                  <div className="mt-2.5 flex items-center justify-between gap-3">
                    <span className="font-mono-num text-xs font-medium text-[#262626] dark:text-[#d4d4d4]">
                      {point.phone}
                    </span>

                    <div className="flex items-center gap-2">
                      {telHref && (
                        <a
                          href={telHref}
                          className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#f5f5f5] hover:bg-[#e5e5e5] dark:bg-[#171717] dark:hover:bg-[#262626] border border-[#d4d4d4] dark:border-[#404040] text-xs font-medium text-[#000000] dark:text-[#ffffff] inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Llamar</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectPoint(point)}
                        className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#000000] hover:bg-[#262626] text-[#ffffff] dark:bg-[#ffffff] dark:hover:bg-[#e5e5e5] dark:text-[#000000] text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Ver en mapa</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {remaining > 0 && (
              <div className="p-4 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#ffffff] hover:bg-[#f5f5f5] dark:bg-[#111111] dark:hover:bg-[#1f1f1f] border border-[#d4d4d4] dark:border-[#404040] text-xs font-semibold text-[#000000] dark:text-[#ffffff] transition-colors cursor-pointer"
                >
                  Mostrar más ({remaining.toLocaleString('es-PY')} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
