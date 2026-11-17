import { Clock, ExternalLink, Mail, MapPin, Navigation, Phone, X } from 'lucide-react';
import {
  buildTelHref,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  formatDepartment,
  formatDistance,
  haversineKm,
} from '../data/resources';
import type { MapPoint, UserLocation } from '../types/map';

interface DetailDrawerProps {
  point: MapPoint | null;
  userLocation: UserLocation | null;
  onClose: () => void;
}

export function DetailDrawer({ point, userLocation, onClose }: DetailDrawerProps) {
  if (!point) return null;

  const color = CATEGORY_COLORS[point.category];
  const telHref = buildTelHref(point.phone);
  const viewMapsUrl = `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
  const distanceKm = userLocation
    ? haversineKm(userLocation.lat, userLocation.lng, point.lat, point.lng)
    : null;

  return (
    <div
      className="fixed inset-x-0 bottom-[calc(60px+env(safe-area-inset-bottom))] lg:bottom-11 lg:left-auto lg:right-4 lg:w-[420px] z-[60] pointer-events-auto"
      role="dialog"
      aria-label={`Detalles de ${point.name}`}
    >
      <div className="bg-white/98 dark:bg-[#18181f]/98 backdrop-blur-xl border border-[#dcdbe6] dark:border-[#2f2f3d] rounded-t-3xl lg:rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/60 max-h-[68vh] lg:max-h-[75vh] flex flex-col overflow-hidden transition-colors duration-200">
        <div className="lg:hidden flex justify-center pt-2.5 pb-1">
          <span className="w-10 h-1 rounded-full bg-[#d4d2de] dark:bg-[#3a3a4a]" aria-hidden="true" />
        </div>

        <div className="px-5 pt-3 lg:pt-4 pb-3 border-b border-[#e5e4ee] dark:border-[#252531] flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-[#646177] dark:text-[#9895a8] mb-1">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="font-semibold" style={{ color }}>
                {CATEGORY_LABELS[point.category]}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{point.subCategory}</span>
              {distanceKm !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num text-[#14141b] dark:text-[#f0eef5] font-medium shrink-0">
                    a {formatDistance(distanceKm)}
                  </span>
                </>
              )}
            </div>
            <h2 className="font-display text-base lg:text-lg font-bold text-[#14141b] dark:text-[#f0eef5] leading-snug">
              {point.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de detalles"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-xl text-[#646177] dark:text-[#9895a8] hover:text-[#14141b] dark:hover:text-white hover:bg-[#efeff5] dark:hover:bg-[#252532] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto custom-scrollbar space-y-3.5 text-sm">
          <div className="flex items-start gap-2.5 text-[#3e3b4e] dark:text-[#d6d3e3]">
            <MapPin className="w-4 h-4 text-[#737087] dark:text-[#9895a8] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="leading-relaxed">{point.address || formatDepartment(point.departamento)}</p>
              <p className="text-xs text-[#646177] dark:text-[#9895a8] mt-0.5">
                {point.distrito ? `${point.distrito} · ` : ''}
                {formatDepartment(point.departamento)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-[#3e3b4e] dark:text-[#d6d3e3]">
            <Clock className="w-4 h-4 text-[#737087] dark:text-[#9895a8] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-xs sm:text-sm leading-relaxed">{point.hours}</span>
          </div>

          <div className="flex items-center gap-2.5 text-[#3e3b4e] dark:text-[#d6d3e3]">
            <Phone className="w-4 h-4 text-[#737087] dark:text-[#9895a8] shrink-0" aria-hidden="true" />
            <span className="font-mono-num text-sm font-semibold text-[#14141b] dark:text-[#f0eef5]">
              {point.phone}
            </span>
          </div>

          {point.email && (
            <div className="flex items-center gap-2.5 text-[#3e3b4e] dark:text-[#d6d3e3]">
              <Mail className="w-4 h-4 text-[#737087] dark:text-[#9895a8] shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${point.email}`}
                className="text-xs sm:text-sm hover:text-[#e05c7a] underline underline-offset-2 transition-colors"
              >
                {point.email}
              </a>
            </div>
          )}

          {point.services.length > 0 && (
            <div className="pt-2 border-t border-[#e5e4ee] dark:border-[#252531]">
              <p className="text-xs font-medium text-[#646177] dark:text-[#9895a8] mb-1.5">
                Servicios disponibles
              </p>
              <p className="text-xs sm:text-sm text-[#2a2838] dark:text-[#d6d3e3] leading-relaxed">
                {point.services.join(' · ')}
              </p>
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 border-t border-[#e5e4ee] dark:border-[#252531] bg-[#f8f8fb] dark:bg-[#14141b] flex items-center gap-2.5">
          {telHref && (
            <a
              href={telHref}
              className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-[#e05c7a] hover:bg-[#c94d6a] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Llamar</span>
            </a>
          )}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#efeff5] dark:bg-[#23232f] dark:hover:bg-[#2d2d3d] border border-[#dcdbe6] dark:border-[#2f2f3d] text-[#14141b] dark:text-[#f0eef5] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
          >
            <Navigation className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Cómo llegar</span>
          </a>
          <a
            href={viewMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir coordenadas en Google Maps"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white hover:bg-[#efeff5] dark:bg-[#23232f] dark:hover:bg-[#2d2d3d] border border-[#dcdbe6] dark:border-[#2f2f3d] text-[#4b485c] dark:text-[#b8b5c8] hover:text-[#14141b] dark:hover:text-white transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
