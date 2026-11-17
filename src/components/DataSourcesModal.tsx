import { useEffect } from 'react';
import { Database, ExternalLink, Info, Phone, X } from 'lucide-react';
import { INE_PORTAL_URL } from '../data/resources';

interface DataSourcesModalProps {
  open: boolean;
  onClose: () => void;
}

export function DataSourcesModal({ open, onClose }: DataSourcesModalProps) {
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
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/55 dark:bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sources-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-white dark:bg-[#18181f] border border-[#dcdbe6] dark:border-[#2f2f3d] rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-black/25 dark:shadow-black/70 overflow-hidden max-h-[88vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <span className="w-10 h-1 rounded-full bg-[#d4d2de] dark:bg-[#3a3a4a]" aria-hidden="true" />
        </div>

        <div className="px-5 pt-3 sm:pt-5 pb-3.5 border-b border-[#e5e4ee] dark:border-[#252531] flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#d63042] dark:text-[#e05c7a]">
              Mapa de Protección Ley N° 5777/16
            </p>
            <h2
              id="sources-modal-title"
              className="font-display text-lg sm:text-xl font-extrabold text-[#14141b] dark:text-[#f0eef5] mt-0.5"
            >
              Fuente de datos
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de fuentes de datos"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-xl text-[#646177] dark:text-[#9895a8] hover:text-[#14141b] dark:hover:text-white hover:bg-[#efeff5] dark:hover:bg-[#252532] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto custom-scrollbar space-y-4 text-sm text-[#3e3b4e] dark:text-[#d6d3e3]">
          <section className="bg-[#f6f6fb] dark:bg-[#1f1f28] border border-[#e2e1ea] dark:border-[#2c2c3a] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#d63042] dark:text-[#e05c7a]">
              <Database className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Fuente principal</span>
            </div>

            <p className="text-sm font-semibold text-[#14141b] dark:text-[#f0eef5] leading-snug">
              Visor Geoestadístico del Instituto Nacional de Estadística (INE) - Paraguay
            </p>
            <p className="text-xs sm:text-sm text-[#4b485c] dark:text-[#b8b5c8] leading-relaxed">
              Datos georreferenciados obtenidos del Visor del INE, Paraguay. Instituciones productoras originales: Policía Nacional, Ministerio de Salud Pública y Bienestar Social y Ministerio de la Mujer.
            </p>

            <div className="pt-2 border-t border-[#e2e1ea] dark:border-[#2c2c3a] grid grid-cols-3 gap-2 text-center">
              <div className="bg-white dark:bg-[#18181f] border border-[#e5e4ee] dark:border-transparent rounded-lg py-2 px-1.5">
                <div className="font-mono-num text-sm font-bold text-[#2574a9] dark:text-[#3498db]">1.179</div>
                <div className="text-[11px] text-[#646177] dark:text-[#9895a8]">Locales policiales</div>
              </div>
              <div className="bg-white dark:bg-[#18181f] border border-[#e5e4ee] dark:border-transparent rounded-lg py-2 px-1.5">
                <div className="font-mono-num text-sm font-bold text-[#1f9d55] dark:text-[#2ecc71]">1.740</div>
                <div className="text-[11px] text-[#646177] dark:text-[#9895a8]">Estab. de salud</div>
              </div>
              <div className="bg-white dark:bg-[#18181f] border border-[#e5e4ee] dark:border-transparent rounded-lg py-2 px-1.5">
                <div className="font-mono-num text-sm font-bold text-[#d63042] dark:text-[#e05c7a]">13</div>
                <div className="text-[11px] text-[#646177] dark:text-[#9895a8]">Centros espec.</div>
              </div>
            </div>

            <p className="text-[11px] text-[#646177] dark:text-[#9895a8]">
              <span className="font-mono-num font-semibold text-[#14141b] dark:text-[#f0eef5]">2.932</span> puntos totales en el mapa (
              <span className="font-mono-num font-semibold text-[#14141b] dark:text-[#f0eef5]">2.919</span> del Visor INE +{' '}
              <span className="font-mono-num font-semibold text-[#14141b] dark:text-[#f0eef5]">13</span> centros especializados).
            </p>

            <a
              href={INE_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-xl bg-[#e05c7a] hover:bg-[#c94d6a] text-white text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a]"
            >
              <span>Abrir Visor Geoestadístico del INE</span>
              <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
          </section>

          <section className="space-y-1.5 px-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#14141b] dark:text-[#f0eef5]">
              <Phone className="w-3.5 h-3.5 text-[#e05c7a] shrink-0" aria-hidden="true" />
              <span>Líneas de ayuda</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4b485c] dark:text-[#b8b5c8] leading-relaxed">
              Líneas de ayuda: <strong className="text-[#14141b] dark:text-[#f0eef5]">137 SOS Mujer</strong> (Ministerio de la Mujer) y{' '}
              <strong className="text-[#14141b] dark:text-[#f0eef5]">911</strong> (Policía Nacional).
            </p>
          </section>

          <section className="pt-3 border-t border-[#e5e4ee] dark:border-[#252531] space-y-1.5 px-1">
            <div className="flex items-start gap-2 text-xs text-[#646177] dark:text-[#9895a8] leading-relaxed">
              <Info className="w-4 h-4 text-[#646177] dark:text-[#9895a8] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p>Datos consultados Nov 2026. Mapa informativo, no reemplaza denuncia formal.</p>
                <p className="mt-1 text-[11px] text-[#7c798c]">
                  Cartografía base: © OpenStreetMap contributors © CARTO
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
