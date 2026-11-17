import L from 'leaflet';
import { CATEGORY_COLORS } from '../data/resources';
import type { CategoryKey, ThemeMode } from '../types/map';

export function getClusterSize(pointCount: number): number {
  if (pointCount >= 500) return 50;
  if (pointCount >= 100) return 44;
  if (pointCount >= 25) return 40;
  return 36;
}

export function createClusterIcon(
  pointCount: number,
  policialCount: number,
  saludCount: number,
  theme: ThemeMode
): L.DivIcon {
  const ratio = policialCount / Math.max(1, policialCount + saludCount);
  const size = getClusterSize(pointCount);
  const boxSize = Math.max(44, size);
  const strokeWidth = 3.5;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const policialArc = ratio * circumference;
  const saludArc = circumference - policialArc;
  const label = pointCount >= 1000 ? `${(pointCount / 1000).toFixed(1)}k` : String(pointCount);

  const bg = theme === 'dark' ? '#15151d' : '#ffffff';
  const textColor = theme === 'dark' ? '#f4f2fa' : '#14141b';
  const shadow = theme === 'dark' ? '0 4px 16px rgba(0,0,0,0.55)' : '0 4px 14px rgba(15,15,25,0.18)';
  const ringBorder = theme === 'dark' ? '' : 'border:1px solid rgba(20,20,27,0.08);';

  const html = `
    <div style="width:${boxSize}px;height:${boxSize}px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:${bg};${ringBorder}box-shadow:${shadow};">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0;transform:rotate(-90deg);">
          <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="#2ecc71" stroke-width="${strokeWidth}" stroke-dasharray="${saludArc} ${circumference}" stroke-dashoffset="-${policialArc}" />
          <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="#3498db" stroke-width="${strokeWidth}" stroke-dasharray="${policialArc} ${circumference}" />
        </svg>
        <span style="position:relative;z-index:1;font-family:'JetBrains Mono',monospace;font-size:${size >= 44 ? 12 : 11}px;font-weight:700;color:${textColor};letter-spacing:-0.03em;">${label}</span>
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

export function createSpiderCenterIcon(remainingCount: number, theme: ThemeMode): L.DivIcon {
  const label = remainingCount > 0 ? `+${remainingCount}` : '✕';
  const bg = theme === 'dark' ? '#1f1f2b' : '#ffffff';
  const textColor = theme === 'dark' ? '#f4f2fa' : '#14141b';
  const shadow = theme === 'dark' ? '0 4px 14px rgba(0,0,0,0.6)' : '0 4px 14px rgba(15,15,25,0.2)';

  return L.divIcon({
    className: '',
    html: `
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="width:28px;height:28px;border-radius:9999px;background:${bg};border:2px solid #e05c7a;color:${textColor};font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:${shadow};">
          ${label}
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export function createPointIcon(category: CategoryKey, isSelected: boolean, theme: ThemeMode): L.DivIcon {
  const color = CATEGORY_COLORS[category];
  const size = isSelected ? 18 : 13;
  const borderColor = isSelected ? (theme === 'dark' ? '#ffffff' : '#14141b') : theme === 'dark' ? '#0f0f13' : '#ffffff';
  const shadow = isSelected
    ? `box-shadow:0 0 0 5px ${color}44, 0 4px 12px rgba(0,0,0,0.45);`
    : theme === 'dark'
      ? 'box-shadow:0 2px 6px rgba(0,0,0,0.45);'
      : 'box-shadow:0 2px 6px rgba(15,15,25,0.28);';

  return L.divIcon({
    className: '',
    html: `
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2.5px solid ${borderColor};${shadow}transition:transform 0.16s ease;"></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export function createCuratedPinIcon(category: CategoryKey, isSelected: boolean, theme: ThemeMode): L.DivIcon {
  const color = CATEGORY_COLORS[category];
  const size = isSelected ? 34 : 26;
  const borderColor = isSelected ? (theme === 'dark' ? '#ffffff' : '#14141b') : theme === 'dark' ? '#0f0f13' : '#ffffff';
  const shadow = isSelected
    ? `0 0 0 5px ${color}55, 0 8px 20px rgba(0,0,0,0.45)`
    : theme === 'dark'
      ? '0 4px 12px rgba(0,0,0,0.55)'
      : '0 4px 12px rgba(15,15,25,0.28)';

  return L.divIcon({
    className: '',
    html: `
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="
          width:${size}px;
          height:${size}px;
          background:${color};
          border:2.5px solid ${borderColor};
          border-radius:50% 50% 50% 4px;
          transform:rotate(-45deg);
          box-shadow:${shadow};
          display:flex;
          align-items:center;
          justify-content:center;
          transition:all 0.16s ease;
        ">
          <div style="width:${isSelected ? 9 : 7}px;height:${isSelected ? 9 : 7}px;border-radius:9999px;background:#ffffff;transform:rotate(45deg);"></div>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22 + size * 0.2],
  });
}

export function createUserLocationIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
        <div class="user-location-pulse" style="position:absolute;width:20px;height:20px;border-radius:9999px;background:rgba(224,92,122,0.45);"></div>
        <div style="position:relative;width:14px;height:14px;border-radius:9999px;background:#e05c7a;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.45);"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}
