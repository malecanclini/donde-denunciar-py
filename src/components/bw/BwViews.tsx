import { useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Database,
  ExternalLink,
  Info,
  List,
  Mail,
  Map,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  buildTelHref,
  CATEGORY_LABELS,
  EMERGENCY_NUMBERS,
  FOOTER_ATTRIBUTION,
  formatDepartment,
  formatDistance,
  haversineKm,
  HOW_TO_REPORT_STEPS,
  INE_PORTAL_URL,
} from '../../data/resources';
import type { MapPoint, TabId, UserLocation } from '../../types/map';
import { BW_CATEGORY_ICONS } from '../../utils/bwLeafletIcons';

export function BwDetailDrawer({
  point,
  userLocation,
  onClose,
}: {
  point: MapPoint | null;
  userLocation: UserLocation | null;
  onClose: () => void;
}) {
  if (!point) return null;

  const telHref = buildTelHref(point.phone);
  const viewMapsUrl = `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
  const distanceKm = userLocation
    ? haversineKm(userLocation.lat, userLocation.lng, point.lat, point.lng)
    : null;
  const icon = BW_CATEGORY_ICONS[point.category];

  return (
    <div
      className="fixed inset-x-0 bottom-[calc(60px+env(safe-area-inset-bottom))] lg:bottom-11 lg:left-auto lg:right-4 lg:w-[420px] z-[60] pointer-events-auto"
      role="dialog"
      aria-label={`Detalles de ${point.name}`}
    >
      <div className="bg-[#ffffff]/98 dark:bg-[#000000]/98 backdrop-blur-xl border border-[#d4d4d4] dark:border-[#404040] rounded-t-3xl lg:rounded-2xl shadow-2xl shadow-black/25 dark:shadow-black/80 max-h-[68vh] lg:max-h-[75vh] flex flex-col overflow-hidden transition-colors duration-200">
        <div className="lg:hidden flex justify-center pt-2.5 pb-1">
          <span className="w-10 h-1 rounded-full bg-[#d4d4d4] dark:bg-[#404040]" aria-hidden="true" />
        </div>

        <div className="px-5 pt-3 lg:pt-4 pb-3 border-b border-[#e5e5e5] dark:border-[#262626] flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-[#525252] dark:text-[#a3a3a3] mb-1">
              <span
                className={
                  point.category === 'psicologico'
                    ? 'font-mono-num font-bold text-[#000000] dark:text-[#ffffff]'
                    : 'bw-emoji'
                }
                aria-hidden="true"
              >
                {icon}
              </span>
              <span className="font-semibold text-[#000000] dark:text-[#ffffff]">
                {CATEGORY_LABELS[point.category]}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{point.subCategory}</span>
              {distanceKm !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num text-[#000000] dark:text-[#ffffff] font-medium shrink-0">
                    a {formatDistance(distanceKm)}
                  </span>
                </>
              )}
            </div>
            <h2 className="font-display text-base lg:text-lg font-bold text-[#000000] dark:text-[#ffffff] leading-snug">
              {point.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de detalles"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-xl text-[#525252] dark:text-[#a3a3a3] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#171717] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto custom-scrollbar space-y-3.5 text-sm">
          <div className="flex items-start gap-2.5 text-[#262626] dark:text-[#e5e5e5]">
            <MapPin className="w-4 h-4 text-[#737373] dark:text-[#a3a3a3] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="leading-relaxed">{point.address || formatDepartment(point.departamento)}</p>
              <p className="text-xs text-[#525252] dark:text-[#a3a3a3] mt-0.5">
                {point.distrito ? `${point.distrito} · ` : ''}
                {formatDepartment(point.departamento)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-[#262626] dark:text-[#e5e5e5]">
            <Clock className="w-4 h-4 text-[#737373] dark:text-[#a3a3a3] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-xs sm:text-sm leading-relaxed">{point.hours}</span>
          </div>

          <div className="flex items-center gap-2.5 text-[#262626] dark:text-[#e5e5e5]">
            <Phone className="w-4 h-4 text-[#737373] dark:text-[#a3a3a3] shrink-0" aria-hidden="true" />
            <span className="font-mono-num text-sm font-semibold text-[#000000] dark:text-[#ffffff]">
              {point.phone}
            </span>
          </div>

          {point.email && (
            <div className="flex items-center gap-2.5 text-[#262626] dark:text-[#e5e5e5]">
              <Mail className="w-4 h-4 text-[#737373] dark:text-[#a3a3a3] shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${point.email}`}
                className="text-xs sm:text-sm underline underline-offset-2 hover:opacity-75 transition-opacity"
              >
                {point.email}
              </a>
            </div>
          )}

          {point.services.length > 0 && (
            <div className="pt-2 border-t border-[#e5e5e5] dark:border-[#262626]">
              <p className="text-xs font-medium text-[#525252] dark:text-[#a3a3a3] mb-1.5">
                Servicios disponibles
              </p>
              <p className="text-xs sm:text-sm text-[#262626] dark:text-[#e5e5e5] leading-relaxed">
                {point.services.join(' · ')}
              </p>
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 border-t border-[#e5e5e5] dark:border-[#262626] bg-[#f5f5f5] dark:bg-[#111111] flex items-center gap-2.5">
          {telHref && (
            <a
              href={telHref}
              className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-[#000000] hover:bg-[#262626] text-[#ffffff] dark:bg-[#ffffff] dark:hover:bg-[#e5e5e5] dark:text-[#000000] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Llamar</span>
            </a>
          )}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-[#ffffff] hover:bg-[#e5e5e5] dark:bg-[#171717] dark:hover:bg-[#262626] border border-[#d4d4d4] dark:border-[#404040] text-[#000000] dark:text-[#ffffff] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
          >
            <Navigation className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Cómo llegar</span>
          </a>
          <a
            href={viewMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir coordenadas en Google Maps"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#ffffff] hover:bg-[#e5e5e5] dark:bg-[#171717] dark:hover:bg-[#262626] border border-[#d4d4d4] dark:border-[#404040] text-[#000000] dark:text-[#ffffff] transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function BwEmergencyPhones() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 lg:pb-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#ffffff] tracking-tight">
          Teléfonos de Emergencia
        </h2>
        <p className="text-sm text-[#525252] dark:text-[#a3a3a3] mt-1.5 max-w-2xl leading-relaxed">
          Líneas gratuitas y confidenciales en todo el Paraguay. Tocá cualquier tarjeta para llamar de forma directa desde tu celular.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EMERGENCY_NUMBERS.map((line) => (
          <a
            key={line.number}
            href={line.telHref}
            className="group block bg-[#ffffff] hover:bg-[#f5f5f5] dark:bg-[#111111] dark:hover:bg-[#171717] border border-[#d4d4d4] dark:border-[#404040] rounded-2xl p-5 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight text-[#000000] dark:text-[#ffffff]">
                  {line.number}
                </div>
                <h3 className="font-display text-base font-bold text-[#000000] dark:text-[#ffffff] mt-1">
                  {line.name}
                </h3>
              </div>
              <span
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center bg-[#f5f5f5] dark:bg-[#171717] group-hover:bg-[#000000] dark:group-hover:bg-[#ffffff] text-[#000000] dark:text-[#ffffff] group-hover:text-[#ffffff] dark:group-hover:text-[#000000] border border-[#d4d4d4] dark:border-[#404040] transition-colors shrink-0"
                aria-hidden="true"
              >
                <Phone className="w-5 h-5" />
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#404040] dark:text-[#d4d4d4] mt-2.5 leading-relaxed">
              {line.desc}
            </p>

            <div className="mt-3.5 pt-3 border-t border-[#e5e5e5] dark:border-[#262626] flex items-center gap-2 text-xs text-[#525252] dark:text-[#a3a3a3]">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{line.hours}</span>
              <span aria-hidden="true">·</span>
              <span>Servicio gratuito</span>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-[#525252] dark:text-[#a3a3a3]">
        {FOOTER_ATTRIBUTION}
      </p>
    </div>
  );
}

export function BwHowToReport({
  onGoToMap,
  onOpenSources,
}: {
  onGoToMap: () => void;
  onOpenSources: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 lg:pb-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#ffffff] tracking-tight">
          ¿Cómo hacer una denuncia?
        </h2>
        <p className="text-sm text-[#525252] dark:text-[#a3a3a3] mt-1.5 leading-relaxed">
          Guía rápida de orientación y derechos amparados por la Ley N° 5777/16 de Protección Integral a las Mujeres contra toda forma de Violencia.
        </p>
      </div>

      <div className="space-y-3.5">
        {HOW_TO_REPORT_STEPS.map((item) => (
          <section
            key={item.step}
            className="bg-[#ffffff] dark:bg-[#111111] border border-[#d4d4d4] dark:border-[#404040] rounded-2xl p-5 transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="font-mono-num text-sm font-bold px-2.5 py-1 rounded-lg bg-[#000000] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#000000] shrink-0">
                {item.step}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold text-[#000000] dark:text-[#ffffff]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#404040] dark:text-[#d4d4d4] mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 bg-[#ffffff] dark:bg-[#111111] border border-[#d4d4d4] dark:border-[#404040] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#000000] dark:text-[#ffffff] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-[#262626] dark:text-[#e5e5e5] leading-relaxed">
            En ningún caso se puede rechazar la recepción de una denuncia ni exigir documento de identidad para tomarla. Todas las actuaciones son reservadas y gratuitas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:137"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#000000] hover:bg-[#262626] text-[#ffffff] dark:bg-[#ffffff] dark:hover:bg-[#e5e5e5] dark:text-[#000000] text-xs font-semibold inline-flex items-center gap-2 whitespace-nowrap transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>Llamar 137</span>
          </a>
          <button
            type="button"
            onClick={onGoToMap}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#f5f5f5] hover:bg-[#e5e5e5] dark:bg-[#171717] dark:hover:bg-[#262626] border border-[#d4d4d4] dark:border-[#404040] text-[#000000] dark:text-[#ffffff] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
          >
            Ver mapa
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 text-xs text-[#525252] dark:text-[#a3a3a3]">
        <span>{FOOTER_ATTRIBUTION}</span>
        <button
          type="button"
          onClick={onOpenSources}
          className="inline-flex items-center gap-1.5 text-[#000000] dark:text-[#ffffff] font-medium self-start sm:self-auto cursor-pointer shrink-0 underline underline-offset-2"
        >
          <Database className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Ver detalle de fuente de datos</span>
        </button>
      </div>
    </div>
  );
}

export function BwDataSourcesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bw-sources-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-[#ffffff] dark:bg-[#000000] border border-[#d4d4d4] dark:border-[#404040] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <span className="w-10 h-1 rounded-full bg-[#d4d4d4] dark:bg-[#404040]" aria-hidden="true" />
        </div>

        <div className="px-5 pt-3 sm:pt-5 pb-3.5 border-b border-[#e5e5e5] dark:border-[#262626] flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#525252] dark:text-[#a3a3a3]">
              Versión Light & Dark - Blanco y Negro
            </p>
            <h2
              id="bw-sources-modal-title"
              className="font-display text-lg sm:text-xl font-extrabold text-[#000000] dark:text-[#ffffff] mt-0.5"
            >
              Fuente de datos
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de fuentes de datos"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-xl text-[#525252] dark:text-[#a3a3a3] hover:text-[#000000] dark:hover:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#171717] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto custom-scrollbar space-y-4 text-sm text-[#262626] dark:text-[#e5e5e5]">
          <section className="bg-[#f5f5f5] dark:bg-[#111111] border border-[#d4d4d4] dark:border-[#262626] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#000000] dark:text-[#ffffff]">
              <Database className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Fuente principal</span>
            </div>

            <p className="text-sm font-semibold text-[#000000] dark:text-[#ffffff] leading-snug">
              Visor Geoestadístico del Instituto Nacional de Estadística (INE) - Paraguay
            </p>
            <p className="text-xs sm:text-sm text-[#404040] dark:text-[#d4d4d4] leading-relaxed">
              Datos georreferenciados obtenidos del Visor del INE, Paraguay. Instituciones productoras originales: Policía Nacional, Ministerio de Salud Pública y Bienestar Social y Ministerio de la Mujer.
            </p>

            <div className="pt-2 border-t border-[#d4d4d4] dark:border-[#262626] grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#ffffff] dark:bg-[#000000] border border-[#d4d4d4] dark:border-[#262626] rounded-lg py-2 px-1.5">
                <div className="font-mono-num text-sm font-bold text-[#000000] dark:text-[#ffffff]">1.179</div>
                <div className="text-[11px] text-[#525252] dark:text-[#a3a3a3]">Locales policiales</div>
              </div>
              <div className="bg-[#ffffff] dark:bg-[#000000] border border-[#d4d4d4] dark:border-[#262626] rounded-lg py-2 px-1.5">
                <div className="font-mono-num text-sm font-bold text-[#000000] dark:text-[#ffffff]">1.740</div>
                <div className="text-[11px] text-[#525252] dark:text-[#a3a3a3]">Estab. de salud</div>
              </div>
              <div className="bg-[#ffffff] dark:bg-[#000000] border border-[#d4d4d4] dark:border-[#262626] rounded-lg py-2 px-1.5">
                <div className="font-mono-num text-sm font-bold text-[#000000] dark:text-[#ffffff]">13</div>
                <div className="text-[11px] text-[#525252] dark:text-[#a3a3a3]">Centros espec.</div>
              </div>
            </div>

            <p className="text-[11px] text-[#525252] dark:text-[#a3a3a3]">
              <span className="font-mono-num font-semibold text-[#000000] dark:text-[#ffffff]">2.932</span> puntos totales en el mapa (
              <span className="font-mono-num font-semibold text-[#000000] dark:text-[#ffffff]">2.919</span> del Visor INE +{' '}
              <span className="font-mono-num font-semibold text-[#000000] dark:text-[#ffffff]">13</span> centros especializados).
            </p>

            <a
              href={INE_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-xl bg-[#000000] hover:bg-[#262626] text-[#ffffff] dark:bg-[#ffffff] dark:hover:bg-[#e5e5e5] dark:text-[#000000] text-xs font-semibold transition-colors"
            >
              <span>Abrir Visor Geoestadístico del INE</span>
              <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
          </section>

          <section className="pt-2 border-t border-[#e5e5e5] dark:border-[#262626] space-y-1.5 px-1">
            <div className="flex items-start gap-2 text-xs text-[#525252] dark:text-[#a3a3a3] leading-relaxed">
              <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p>Datos consultados Nov 2026. Mapa informativo, no reemplaza denuncia formal.</p>
                <p className="mt-1 text-[11px]">Cartografía base: © OpenStreetMap contributors · Esri Dark Gray</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function BwMobileNav({
  activeTab,
  onSelectTab,
  filteredCount,
}: {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  filteredCount: number;
}) {
  const items: Array<{ id: TabId; label: string; icon: typeof Map; badge?: number }> = [
    { id: 'mapa', label: 'Mapa', icon: Map },
    { id: 'centros', label: 'Listado', icon: List, badge: filteredCount },
    { id: 'telefonos', label: 'Teléfonos', icon: Phone },
    { id: 'info', label: 'Guía', icon: BookOpen },
  ];

  return (
    <nav
      aria-label="Navegación móvil"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 dark:bg-[#000000]/95 backdrop-blur-md border-t border-[#d4d4d4] dark:border-[#262626] pb-safe transition-colors duration-200"
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
              className={`relative flex flex-col items-center justify-center min-h-[54px] py-1.5 px-1 transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#000000] dark:text-[#ffffff] font-semibold'
                  : 'text-[#737373] dark:text-[#a3a3a3] hover:text-[#000000] dark:hover:text-[#ffffff]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#000000] dark:bg-[#ffffff]" />
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

export function BwFooter() {
  return (
    <footer className="hidden lg:flex items-center justify-center px-4 py-1.5 bg-[#ffffff] dark:bg-[#000000] border-t border-[#e5e5e5] dark:border-[#262626] text-[11px] text-[#525252] dark:text-[#a3a3a3] shrink-0 transition-colors duration-200">
      <p className="text-center truncate">
        Versión Light & Dark - Blanco y Negro · {FOOTER_ATTRIBUTION}
      </p>
    </footer>
  );
}
