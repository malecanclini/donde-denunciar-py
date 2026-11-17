import { Clock, Phone } from 'lucide-react';
import { EMERGENCY_NUMBERS, FOOTER_ATTRIBUTION } from '../data/resources';

export function EmergencyPhones() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 lg:pb-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#14141b] dark:text-[#f0eef5] tracking-tight">
          Teléfonos de Emergencia
        </h2>
        <p className="text-sm text-[#646177] dark:text-[#9895a8] mt-1.5 max-w-2xl leading-relaxed">
          Líneas gratuitas y confidenciales en todo el Paraguay. Tocá cualquier tarjeta para llamar de forma directa desde tu celular.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EMERGENCY_NUMBERS.map((line) => (
          <a
            key={line.number}
            href={line.telHref}
            className="group block bg-white hover:bg-[#f8f8fc] dark:bg-[#18181f] dark:hover:bg-[#1e1e27] border border-[#dcdbe6] hover:border-[#c3c1d2] dark:border-[#2a2a36] dark:hover:border-[#3e3e50] rounded-2xl p-5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: line.color }}>
                  {line.number}
                </div>
                <h3 className="font-display text-base font-bold text-[#14141b] dark:text-[#f0eef5] mt-1">
                  {line.name}
                </h3>
              </div>
              <span
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center bg-[#f1f0f7] dark:bg-[#23232f] group-hover:bg-[#e05c7a] text-[#14141b] dark:text-[#f0eef5] group-hover:text-white transition-colors shrink-0"
                aria-hidden="true"
              >
                <Phone className="w-5 h-5" />
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4b485c] dark:text-[#b8b5c8] mt-2.5 leading-relaxed">
              {line.desc}
            </p>

            <div className="mt-3.5 pt-3 border-t border-[#ecebf3] dark:border-[#252531] flex items-center gap-2 text-xs text-[#646177] dark:text-[#9895a8]">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{line.hours}</span>
              <span aria-hidden="true">·</span>
              <span>Servicio gratuito</span>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-[#646177] dark:text-[#9895a8]">
        {FOOTER_ATTRIBUTION}
      </p>
    </div>
  );
}
