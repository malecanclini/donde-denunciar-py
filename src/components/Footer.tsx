import { FOOTER_ATTRIBUTION } from '../data/resources';

export function Footer() {
  return (
    <footer className="hidden lg:flex items-center justify-center px-4 py-1.5 bg-[#ffffff] dark:bg-[#111827] border-t border-[#e5e7eb] dark:border-[#1f2937] text-[11px] text-[#374151] dark:text-[#d1d5db] shrink-0 transition-colors duration-200">
      <p className="text-center truncate">{FOOTER_ATTRIBUTION}</p>
    </footer>
  );
}
