import L from 'leaflet';
import type { CategoryKey, ThemeMode } from '../types/map';

export const BW_CATEGORY_ICONS: Record<CategoryKey, string> = {
  emergencia: '!',
  legal: '⚖️',
  psicologico: '+',
  policial: '🛡️',
  albergue: '🏠',
};

export function getBwClusterSize(pointCount: number): number {
  if (pointCount >= 500) return 50;
  if (pointCount >= 100) return 44;
  if (pointCount >= 25) return 40;
  return 36;
}

export function createBwClusterIcon(pointCount: number, theme: ThemeMode): L.DivIcon {
  const size = getBwClusterSize(pointCount);
  const boxSize = Math.max(44, size);
  const label = pointCount >= 1000 ? `${(pointCount / 1000).toFixed(1)}k` : String(pointCount);

  // Claro: cluster blanco con borde negro y número negro
  // Oscuro: cluster negro con borde blanco y número blanco
  const bg = theme === 'light' ? '#ffffff' : '#000000';
  const border = theme === 'light' ? '#000000' : '#ffffff';
  const textColor = theme === 'light' ? '#000000' : '#ffffff';
  const shadow =
    theme === 'light' ? '0 3px 10px rgba(0,0,0,0.22)' : '0 3px 12px rgba(0,0,0,0.75)';

  const html = `
    <div style="width:${boxSize}px;height:${boxSize}px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
      <div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:${bg};border:2.5px solid ${border};box-shadow:${shadow};">
        <span style="font-family:'JetBrains Mono',monospace;font-size:${size >= 44 ? 12 : 11}px;font-weight:700;color:${textColor};letter-spacing:-0.03em;">${label}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: '',
    html,
    iconSize: [boxSize, boxSize],
    iconAnchor: [boxSize / 2, boxSize / 2],
  });
}

export function createBwSpiderCenterIcon(remainingCount: number, theme: ThemeMode): L.DivIcon {
  const label = remainingCount > 0 ? `+${remainingCount}` : '✕';
  const bg = theme === 'light' ? '#ffffff' : '#000000';
  const border = theme === 'light' ? '#000000' : '#ffffff';
  const text = theme === 'light' ? '#000000' : '#ffffff';

  return L.divIcon({
    className: '',
    html: `
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="width:28px;height:28px;border-radius:9999px;background:${bg};border:2px solid ${border};color:${text};font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.35);">
          ${label}
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export function createBwPointIcon(
  category: CategoryKey,
  isSelected: boolean,
  theme: ThemeMode
): L.DivIcon {
  // Modo Claro: pines negros (contenido blanco). Modo Oscuro: pines blancos (contenido negro).
  const pinBg = theme === 'light' ? '#000000' : '#ffffff';
  const pinBorder = theme === 'light' ? '#ffffff' : '#000000';
  const symbolColor = theme === 'light' ? '#ffffff' : '#000000';
  const size = isSelected ? 24 : 20;
  const symbol = BW_CATEGORY_ICONS[category];
  const ring = isSelected
    ? `box-shadow:0 0 0 3px ${theme === 'light' ? '#000000' : '#ffffff'}, 0 4px 12px rgba(0,0,0,0.45);`
    : 'box-shadow:0 2px 6px rgba(0,0,0,0.35);';

  const symbolHtml =
    category === 'psicologico'
      ? `<span style="font-family:'JetBrains Mono',monospace;font-size:${isSelected ? 14 : 12}px;font-weight:800;line-height:1;color:${symbolColor};">+</span>`
      : `<span style="font-size:${isSelected ? 11 : 10}px;line-height:1;filter:grayscale(100%) contrast(1.4);">${symbol}</span>`;

  return L.divIcon({
    className: '',
    html: `
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="width:${size}px;height:${size}px;border-radius:9999px;background:${pinBg};border:2px solid ${pinBorder};${ring}display:flex;align-items:center;justify-content:center;transition:transform 0.16s ease;">
          ${symbolHtml}
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export function createBwCuratedPinIcon(
  category: CategoryKey,
  isSelected: boolean,
  theme: ThemeMode
): L.DivIcon {
  // Modo Claro: pines negros; Modo Oscuro: pines blancos
  const pinBg = theme === 'light' ? '#000000' : '#ffffff';
  const pinBorder = theme === 'light' ? '#ffffff' : '#000000';
  const symbolColor = theme === 'light' ? '#ffffff' : '#000000';
  const size = isSelected ? 34 : 28;
  const symbol = BW_CATEGORY_ICONS[category];
  const shadow = isSelected
    ? `0 0 0 4px ${theme === 'light' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)'}, 0 8px 20px rgba(0,0,0,0.45)`
    : '0 4px 12px rgba(0,0,0,0.4)';

  const innerSymbol =
    category === 'psicologico'
      ? `<span style="font-family:'JetBrains Mono',monospace;font-size:${isSelected ? 16 : 14}px;font-weight:800;line-height:1;color:${symbolColor};transform:rotate(45deg);display:inline-block;">+</span>`
      : `<span style="font-size:${isSelected ? 13 : 11}px;line-height:1;filter:grayscale(100%) contrast(1.4);transform:rotate(45deg);display:inline-block;">${symbol}</span>`;

  return L.divIcon({
    className: '',
    html: `
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="
          width:${size}px;
          height:${size}px;
          background:${pinBg};
          border:2px solid ${pinBorder};
          border-radius:50% 50% 50% 4px;
          transform:rotate(-45deg);
          box-shadow:${shadow};
          display:flex;
          align-items:center;
          justify-content:center;
          transition:all 0.16s ease;
        ">
          ${innerSymbol}
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22 + size * 0.2],
  });
}

export function createBwUserLocationIcon(theme: ThemeMode): L.DivIcon {
  const fill = theme === 'light' ? '#000000' : '#ffffff';
  const border = theme === 'light' ? '#ffffff' : '#000000';
  const pulse = theme === 'light' ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.35)';

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
        <div class="user-location-pulse" style="position:absolute;width:20px;height:20px;border-radius:9999px;background:${pulse};"></div>
        <div style="position:relative;width:14px;height:14px;border-radius:9999px;background:${fill};border:3px solid ${border};box-shadow:0 2px 8px rgba(0,0,0,0.45);"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}
