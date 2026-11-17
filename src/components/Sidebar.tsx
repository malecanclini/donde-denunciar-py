import { useEffect, useState } from 'react';
import { Loader2, MapPin, Navigation, Phone, Search, X } from 'lucide-react';
import { buildTelHref, CATEGORY_COLORS, CATEGORY_LABELS, FILTER_LABELS, formatDepartment, formatDistance } from '../data/resources';
import type { FilterCategory, MapPoint, SortedPointItem, UserLocation } from '../types/map';

const PAGE_SIZE = 40;

interface SidebarProps {
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

export function Sidebar({
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
}: SidebarProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [categoryFilter, departmentFilter, searchQuery, items.length]);

  const visibleItems = items.slice(0, visibleCount);
  const remaining = Math.max(0, items.length - visibleCount);
  const filterKeys: FilterCategory[] = ['all', 'legal', 'psicologico', 'policial', 'albergue'];

  return (
    <div className="h-full flex flex-col bg-[#ffffff] text-[#000000] dark:bg-[#111827] dark:text-[#ffffff] transition-colors duration-200">
      <div className="p-4 border-b border-[#e5e7eb] dark:border-[#1f2937] space-y-3 shrink-0">
        <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a23] border border-[#dcdbe6] dark:border-[#2c2c3a] focus-within:border-[#e05c7a] rounded-xl px-3 min-h-[44px] transition-colors">
          <Search className="w-4 h-4 text-[#737087] dark:text-[#9895a8] shrink-0" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar ciudad, barrio, centro..."
            aria-label="Buscar centro o ciudad"
            className="w-full bg-transparent text-sm text-[#14141b] dark:text-[#f0eef5] placeholder:text-[#868399] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              className="p-1 text-[#737087] dark:text-[#9895a8] hover:text-[#14141b] dark:hover:text-white cursor-pointer"
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
            className="flex-1 min-h-[40px] px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1a23] border border-[#dcdbe6] dark:border-[#2c2c3a] text-xs font-medium text-[#14141b] dark:text-[#f0eef5] focus:outline-none focus:border-[#e05c7a] transition-colors"
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
                ? 'bg-[#e05c7a] border-[#e05c7a] text-white'
                : 'bg-white dark:bg-[#1a1a23] border-[#dcdbe6] dark:border-[#2c2c3a] text-[#2a2838] dark:text-[#f0eef5] hover:bg-[#efeff5] dark:hover:bg-[#23232f]'
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
            const activeBg = key === 'all' ? '#e05c7a' : CATEGORY_COLORS[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onCategoryChange(key)}
                className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-[#1a1a23] text-[#4b485c] dark:text-[#c7c4d6] border-[#dcdbe6] dark:border-[#2c2c3a] hover:text-[#14141b] dark:hover:text-white'
                }`}
                style={isActive ? { backgroundColor: activeBg } : undefined}
              >
                {key === 'psicologico' ? 'Salud / Psic.' : FILTER_LABELS[key]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-[#e2e1ea] dark:border-[#252531] flex items-center justify-between text-xs text-[#646177] dark:text-[#9895a8] shrink-0">
        <span>
          Mostrando{' '}
          <strong className="font-mono-num text-[#14141b] dark:text-[#f0eef5]">
            {items.length.toLocaleString('es-PY')}
          </strong>{' '}
          {items.length === 1 ? 'lugar' : 'lugares'}
          {userLocation && ' · ordenados por cercanía'}
        </span>
        {loadingGeo && <span className="text-[#d63042] dark:text-[#e05c7a]">Actualizando...</span>}
      </div>

      {geoError && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-red-50 dark:bg-[#2a171c] border border-red-200 dark:border-[#ff4757]/30 text-xs text-red-800 dark:text-[#ffd5d9]">
          {geoError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#e5e4ee] dark:divide-[#252531] pb-24 lg:pb-6">
        {items.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="font-display text-sm font-bold text-[#14141b] dark:text-[#f0eef5]">
              Sin resultados para este filtro
            </p>
            <p className="text-xs text-[#646177] dark:text-[#9895a8]">
              Probá cambiar el departamento, la categoría o limpiar la búsqueda.
            </p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onCategoryChange('all');
                onDepartmentChange('all');
              }}
              className="mt-2 inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-xl bg-[#efeff5] hover:bg-[#e4e3ee] dark:bg-[#252532] dark:hover:bg-[#303042] text-xs font-semibold text-[#14141b] dark:text-white cursor-pointer"
            >
              Ver todos los puntos
            </button>
          </div>
        ) : (
          <>
            {visibleItems.map(({ point, distanceKm }) => {
              const color = CATEGORY_COLORS[point.category];
              const isSelected = selectedUid === point.uid;
              const telHref = buildTelHref(point.phone);

              return (
                <article
                  key={point.uid}
                  className={`px-4 py-3.5 transition-colors ${
                    isSelected
                      ? 'bg-[#efecf6] dark:bg-[#232330]'
                      : 'hover:bg-[#f1f0f7] dark:hover:bg-[#1b1b24]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectPoint(point)}
                    className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a] rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-[#646177] dark:text-[#9895a8] mb-1">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                      <span className="font-semibold" style={{ color }}>
                        {CATEGORY_LABELS[point.category]}
                      </span>
                      {point.isPriority && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#c43a5a] dark:text-[#f0a0b0] font-medium">
                            Centro especializado
                          </span>
                        </>
                      )}
                      {distanceKm !== null && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num text-[#14141b] dark:text-[#f0eef5] font-medium">
                            {formatDistance(distanceKm)}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-[14px] font-bold text-[#14141b] dark:text-[#f0eef5] leading-snug">
                      {point.name}
                    </h3>
                    <p className="text-xs text-[#646177] dark:text-[#9895a8] mt-1 leading-relaxed">
                      {point.address || formatDepartment(point.departamento)}
                    </p>
                    <p className="text-xs text-[#4b485c] dark:text-[#b8b5c8] mt-1.5 line-clamp-1">
                      {point.services.slice(0, 3).join(' · ')}
                    </p>
                  </button>

                  <div className="mt-2.5 flex items-center justify-between gap-3">
                    <span className="font-mono-num text-xs font-medium text-[#2a2838] dark:text-[#d6d3e3]">
                      {point.phone}
                    </span>

                    <div className="flex items-center gap-2">
                      {telHref && (
                        <a
                          href={telHref}
                          className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#efeff5] hover:bg-[#e3e2ee] dark:bg-[#252532] dark:hover:bg-[#313144] text-xs font-medium text-[#14141b] dark:text-[#f0eef5] inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Llamar</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectPoint(point)}
                        className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#efeff5] hover:bg-[#e05c7a] hover:text-white dark:bg-[#252532] dark:hover:bg-[#e05c7a] text-xs font-medium text-[#14141b] dark:text-[#f0eef5] inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
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
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-[#f0eff6] dark:bg-[#22222d] dark:hover:bg-[#2c2c3a] border border-[#dcdbe6] dark:border-[#323244] text-xs font-semibold text-[#14141b] dark:text-[#f0eef5] transition-colors cursor-pointer"
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
