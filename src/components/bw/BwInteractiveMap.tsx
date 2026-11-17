import { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Compass,
  Database,
  Layers,
  Loader2,
  Minus,
  Navigation,
  Plus,
  Search,
  X,
} from 'lucide-react';
import {
  DARK_TILE_URL,
  FILTER_LABELS,
  formatDepartment,
  LIGHT_TILE_URL,
  PARAGUAY_CENTER,
  PARAGUAY_ZOOM,
} from '../../data/resources';
import type { SuperclusterIndex } from '../../hooks/useMapData';
import type {
  DataCounts,
  FilterCategory,
  FlyToTarget,
  LayerVisibility,
  MapPoint,
  ThemeMode,
  UserLocation,
} from '../../types/map';
import {
  BW_CATEGORY_ICONS,
  createBwClusterIcon,
  createBwCuratedPinIcon,
  createBwPointIcon,
  createBwSpiderCenterIcon,
  createBwUserLocationIcon,
  getBwClusterSize,
} from '../../utils/bwLeafletIcons';

interface BwInteractiveMapProps {
  theme: ThemeMode;
  filteredCurated: MapPoint[];
  filteredPoints: MapPoint[];
  superclusterIndexes: {
    lowZoom: SuperclusterIndex;
    highZoom: SuperclusterIndex;
  };
  selectedPoint: MapPoint | null;
  onSelectPoint: (point: MapPoint) => void;
  userLocation: UserLocation | null;
  locating: boolean;
  locationError: string | null;
  onRequestLocation: () => void;
  layerVisibility: LayerVisibility;
  onToggleLayer: (layer: keyof LayerVisibility) => void;
  departmentFilter: string;
  departments: string[];
  onDepartmentChange: (dept: string) => void;
  categoryFilter: FilterCategory;
  onCategoryChange: (cat: FilterCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  flyToTarget: FlyToTarget | null;
  loadingGeo: boolean;
  isVisible: boolean;
  onOpenSources: () => void;
  counts: DataCounts;
}

interface ActiveSpiderCluster {
  clusterId: number;
  zoom: number;
  center: [number, number];
  totalCount: number;
}

export function BwInteractiveMap({
  theme,
  filteredCurated,
  filteredPoints,
  superclusterIndexes,
  selectedPoint,
  onSelectPoint,
  userLocation,
  locating,
  locationError,
  onRequestLocation,
  layerVisibility,
  onToggleLayer,
  departmentFilter,
  departments,
  onDepartmentChange,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  flyToTarget,
  loadingGeo,
  isVisible,
  onOpenSources,
  counts,
}: BwInteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const clusterLayerRef = useRef<L.LayerGroup | null>(null);
  const spiderLayerRef = useRef<L.LayerGroup | null>(null);
  const curatedLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const activeSpiderRef = useRef<ActiveSpiderCluster | null>(null);

  const [layersOpen, setLayersOpen] = useState(false);

  const onSelectPointRef = useRef(onSelectPoint);
  onSelectPointRef.current = onSelectPoint;

  const superclusterRef = useRef(superclusterIndexes);
  superclusterRef.current = superclusterIndexes;

  const selectedUidRef = useRef<string | null>(selectedPoint?.uid ?? null);
  selectedUidRef.current = selectedPoint?.uid ?? null;

  const themeRef = useRef<ThemeMode>(theme);
  themeRef.current = theme;

  const clearSpider = useCallback(() => {
    activeSpiderRef.current = null;
    spiderLayerRef.current?.clearLayers();
  }, []);

  const renderClustersRef = useRef<() => void>(() => {});

  const spiderfyCluster = useCallback(
    (clusterId: number, lat: number, lng: number, index: SuperclusterIndex, totalCount: number) => {
      const map = mapRef.current;
      const spiderLayer = spiderLayerRef.current;
      if (!map || !spiderLayer) return;

      spiderLayer.clearLayers();
      const leaves = index.getLeaves(clusterId, 36, 0);
      const centerPt = map.latLngToLayerPoint([lat, lng]);
      const count = leaves.length;
      const lineColor =
        themeRef.current === 'dark' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.4)';

      leaves.forEach((leaf, idx) => {
        const pt = leaf.properties.point;
        let radiusPx: number;
        let angle: number;

        if (count <= 10) {
          radiusPx = 46 + count * 3.5;
          angle = (2 * Math.PI * idx) / count - Math.PI / 2;
        } else {
          angle = idx * 0.68 - Math.PI / 2;
          radiusPx = 42 + 14 * Math.sqrt(idx);
        }

        const leafPoint = L.point(
          centerPt.x + radiusPx * Math.cos(angle),
          centerPt.y + radiusPx * Math.sin(angle)
        );
        const leafLatLng = map.layerPointToLatLng(leafPoint);

        const leg = L.polyline(
          [
            [lat, lng],
            [leafLatLng.lat, leafLatLng.lng],
          ],
          {
            color: lineColor,
            weight: 1.5,
            dashArray: '3 4',
            interactive: false,
          }
        );
        spiderLayer.addLayer(leg);

        const isSelected = selectedUidRef.current === pt.uid;
        const marker = L.marker([leafLatLng.lat, leafLatLng.lng], {
          icon: createBwPointIcon(pt.category, isSelected, themeRef.current),
          zIndexOffset: isSelected ? 950 : 750,
        });

        marker.on('click', (ev) => {
          L.DomEvent.stopPropagation(ev);
          onSelectPointRef.current(pt);
        });
        marker.bindTooltip(
          `<div style="font-weight:600">${BW_CATEGORY_ICONS[pt.category]} ${pt.name}</div>
           <div style="opacity:0.75;font-size:11px">${pt.subCategory} · ${formatDepartment(pt.departamento)}</div>`,
          { direction: 'top', offset: [0, -10], className: 'custom-map-tooltip' }
        );
        spiderLayer.addLayer(marker);
      });

      const remaining = Math.max(0, totalCount - count);
      const centerBtn = L.marker([lat, lng], {
        icon: createBwSpiderCenterIcon(remaining, themeRef.current),
        zIndexOffset: 760,
      });

      centerBtn.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        if (remaining > 0) {
          const expansionZoom = Math.min(index.getClusterExpansionZoom(clusterId), 17);
          clearSpider();
          map.flyTo([lat, lng], Math.max(expansionZoom, map.getZoom() + 1), { duration: 0.45 });
        } else {
          clearSpider();
          renderClustersRef.current();
        }
      });

      centerBtn.bindTooltip(
        remaining > 0
          ? `<div style="font-weight:600">Mostrando ${count} de ${totalCount} puntos</div><div style="opacity:0.75;font-size:11px">Tocá para acercar más</div>`
          : `<div style="font-weight:600">Cerrar abanico (${count} puntos)</div>`,
        { direction: 'top', offset: [0, -12], className: 'custom-map-tooltip' }
      );

      spiderLayer.addLayer(centerBtn);
    },
    [clearSpider]
  );

  const renderClusters = useCallback(() => {
    const map = mapRef.current;
    const layer = clusterLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const bounds = map.getBounds();
    const zoom = Math.round(map.getZoom());
    const index = zoom < 12 ? superclusterRef.current.lowZoom : superclusterRef.current.highZoom;
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const items = index.getClusters(bbox, zoom);
    interface ClusterNode {
      cProps: {
        cluster_id: number;
        point_count: number;
        policialCount?: number;
        saludCount?: number;
      };
      px: number;
      py: number;
      radius: number;
    }

    const clusters: ClusterNode[] = [];
    const singles: typeof items = [];

    items.forEach((feat) => {
      const props = feat.properties;
      if ('cluster' in props && props.cluster) {
        const [lng, lat] = feat.geometry.coordinates;
        const pt = map.latLngToLayerPoint([lat, lng]);
        clusters.push({
          cProps: props as ClusterNode['cProps'],
          px: pt.x,
          py: pt.y,
          radius: getBwClusterSize(props.point_count) / 2,
        });
      } else {
        singles.push(feat);
      }
    });

    for (let iter = 0; iter < 4; iter++) {
      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const a = clusters[i];
          const b = clusters[j];
          const dx = b.px - a.px;
          const dy = b.py - a.py;
          const dist = Math.hypot(dx, dy);
          const minDist = a.radius + b.radius + 10;
          if (dist < minDist) {
            const shift = (minDist - dist) * 0.55;
            let ux: number;
            let uy: number;
            if (dist > 0.01) {
              ux = dx / dist;
              uy = dy / dist;
            } else {
              const angle = ((i + j) * 2.39996) % (Math.PI * 2);
              ux = Math.cos(angle);
              uy = Math.sin(angle);
            }
            a.px -= ux * shift;
            a.py -= uy * shift;
            b.px += ux * shift;
            b.py += uy * shift;
          }
        }
      }
    }

    clusters.forEach((node) => {
      const { cProps } = node;
      const activeSpider = activeSpiderRef.current;
      if (activeSpider && activeSpider.clusterId === cProps.cluster_id && activeSpider.zoom === zoom) {
        return;
      }

      const latLng = map.layerPointToLatLng(L.point(node.px, node.py));
      const policialCount = cProps.policialCount || 0;
      const saludCount = cProps.saludCount || 0;

      const marker = L.marker([latLng.lat, latLng.lng], {
        icon: createBwClusterIcon(cProps.point_count, themeRef.current),
        zIndexOffset: 100,
      });

      marker.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        const expansionZoom = Math.min(index.getClusterExpansionZoom(cProps.cluster_id), 17);
        if (cProps.point_count <= 36 || zoom >= 13 || expansionZoom <= zoom) {
          activeSpiderRef.current = {
            clusterId: cProps.cluster_id,
            zoom,
            center: [latLng.lat, latLng.lng],
            totalCount: cProps.point_count,
          };
          renderClustersRef.current();
          spiderfyCluster(cProps.cluster_id, latLng.lat, latLng.lng, index, cProps.point_count);
        } else {
          clearSpider();
          map.flyTo([latLng.lat, latLng.lng], Math.min(expansionZoom, 14), { duration: 0.45 });
        }
      });

      marker.bindTooltip(
        `<div style="font-weight:600">${cProps.point_count} puntos en esta zona</div>
         <div style="opacity:0.75;font-size:11px;margin-top:2px">🛡️ ${policialCount} policial · + ${saludCount} salud</div>`,
        { direction: 'top', offset: [0, -14], className: 'custom-map-tooltip' }
      );

      layer.addLayer(marker);
    });

    singles.forEach((feat) => {
      const [lng, lat] = feat.geometry.coordinates;
      const pt = (feat.properties as { point: MapPoint }).point;
      const isSelected = selectedUidRef.current === pt.uid;

      const marker = L.marker([lat, lng], {
        icon: createBwPointIcon(pt.category, isSelected, themeRef.current),
        zIndexOffset: isSelected ? 800 : 200,
      });

      marker.on('click', () => {
        onSelectPointRef.current(pt);
      });
      marker.bindTooltip(
        `<div style="font-weight:600">${BW_CATEGORY_ICONS[pt.category]} ${pt.name}</div>
         <div style="opacity:0.75;font-size:11px">${pt.subCategory} · ${formatDepartment(pt.departamento)}</div>`,
        { direction: 'top', offset: [0, -10], className: 'custom-map-tooltip' }
      );

      layer.addLayer(marker);
    });
  }, [clearSpider, spiderfyCluster]);

  renderClustersRef.current = renderClusters;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const map = L.map(el, {
      center: PARAGUAY_CENTER,
      zoom: PARAGUAY_ZOOM,
      zoomControl: false,
      attributionControl: false,
      minZoom: 5,
      maxZoom: 18,
    });

    L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

    const clusterLayer = L.layerGroup().addTo(map);
    const spiderLayer = L.layerGroup().addTo(map);
    const curatedLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    clusterLayerRef.current = clusterLayer;
    spiderLayerRef.current = spiderLayer;
    curatedLayerRef.current = curatedLayer;

    map.on('zoomstart', () => {
      clearSpider();
    });
    map.on('click', () => {
      if (activeSpiderRef.current) {
        clearSpider();
        renderClustersRef.current();
      }
    });
    map.on('moveend zoomend', () => {
      renderClustersRef.current();
    });

    const ro = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      clusterLayerRef.current = null;
      spiderLayerRef.current = null;
      curatedLayerRef.current = null;
    };
  }, [clearSpider]);

  // Al cambiar entre Claro y Oscuro: removeLayer(currentLayer) y addLayer(newLayer)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentLayer = tileLayerRef.current;
    if (currentLayer) {
      map.removeLayer(currentLayer);
      tileLayerRef.current = null;
    }

    const newLayer =
      theme === 'light'
        ? L.tileLayer(LIGHT_TILE_URL, {
            attribution: '&copy; OpenStreetMap contributors',
            subdomains: 'abc',
            maxZoom: 19,
          })
        : L.tileLayer(DARK_TILE_URL, {
            attribution: '&copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors',
            maxNativeZoom: 16,
            maxZoom: 19,
          });

    map.addLayer(newLayer);
    tileLayerRef.current = newLayer;
    renderClusters();
  }, [theme, renderClusters]);

  useEffect(() => {
    clearSpider();
    renderClusters();
  }, [superclusterIndexes, clearSpider, renderClusters]);

  useEffect(() => {
    renderClusters();
    const activeSpider = activeSpiderRef.current;
    if (activeSpider && mapRef.current) {
      const index =
        activeSpider.zoom < 12 ? superclusterRef.current.lowZoom : superclusterRef.current.highZoom;
      try {
        if (index.getLeaves(activeSpider.clusterId, 1, 0).length > 0) {
          spiderfyCluster(
            activeSpider.clusterId,
            activeSpider.center[0],
            activeSpider.center[1],
            index,
            activeSpider.totalCount
          );
        } else {
          clearSpider();
        }
      } catch {
        clearSpider();
      }
    }
  }, [selectedPoint, theme, renderClusters, spiderfyCluster, clearSpider]);

  useEffect(() => {
    const layer = curatedLayerRef.current;
    if (!layer) return;

    layer.clearLayers();
    filteredCurated.forEach((pt) => {
      const isSelected = selectedPoint?.uid === pt.uid;
      const marker = L.marker([pt.lat, pt.lng], {
        icon: createBwCuratedPinIcon(pt.category, isSelected, theme),
        zIndexOffset: isSelected ? 1000 : 500,
      });

      marker.on('click', () => {
        onSelectPointRef.current(pt);
      });
      marker.bindTooltip(
        `<div style="font-weight:700">${BW_CATEGORY_ICONS[pt.category]} ${pt.name}</div>
         <div style="opacity:0.75;font-size:11px;margin-top:2px">Centro especializado · Tel: ${pt.phone}</div>`,
        { direction: 'top', offset: [0, -18], className: 'custom-map-tooltip' }
      );
      layer.addLayer(marker);
    });
  }, [filteredCurated, selectedPoint, theme]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon: createBwUserLocationIcon(theme),
        zIndexOffset: 900,
      })
        .bindTooltip('Tu ubicación actual', {
          direction: 'top',
          offset: [0, -14],
          className: 'custom-map-tooltip',
        })
        .addTo(map);
      userMarkerRef.current = marker;
    }
  }, [userLocation, theme]);

  const prevDeptRef = useRef(departmentFilter);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || prevDeptRef.current === departmentFilter) return;
    prevDeptRef.current = departmentFilter;

    if (departmentFilter === 'all') {
      map.flyTo(PARAGUAY_CENTER, PARAGUAY_ZOOM, { duration: 0.6 });
    } else if (filteredPoints.length > 0) {
      const bounds = L.latLngBounds(filteredPoints.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13, animate: true });
    }
  }, [departmentFilter, filteredPoints]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && flyToTarget) {
      map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom, { duration: 0.65 });
    }
  }, [flyToTarget]);

  useEffect(() => {
    if (!isVisible || !mapRef.current) return;
    const timer = window.setTimeout(() => {
      mapRef.current?.invalidateSize({ animate: false });
      renderClusters();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [isVisible, renderClusters]);

  const filterKeys: FilterCategory[] = ['all', 'legal', 'psicologico', 'policial', 'albergue'];

  return (
    <div className="bw-edition relative w-full h-full bg-[#ffffff] dark:bg-[#000000] overflow-hidden transition-colors duration-200">
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Mobile floating search & filter bar */}
      <div className="lg:hidden absolute top-3 inset-x-3 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex-1 flex items-center gap-2 bg-[#ffffff]/95 dark:bg-[#000000]/95 backdrop-blur-md border border-[#d4d4d4] dark:border-[#404040] rounded-xl px-3 min-h-[44px] shadow-lg">
            <Search className="w-4 h-4 text-[#737373] dark:text-[#a3a3a3] shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar ciudad, barrio o centro..."
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

          <button
            type="button"
            onClick={() => setLayersOpen((prev) => !prev)}
            aria-label="Capas y leyenda del mapa"
            aria-expanded={layersOpen}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border backdrop-blur-md shadow-lg transition-colors cursor-pointer ${
              layersOpen
                ? 'bg-[#000000] text-[#ffffff] border-[#000000] dark:bg-[#ffffff] dark:text-[#000000] dark:border-[#ffffff]'
                : 'bg-[#ffffff]/95 dark:bg-[#000000]/95 border-[#d4d4d4] dark:border-[#404040] text-[#000000] dark:text-[#ffffff]'
            }`}
          >
            <Layers className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-0.5">
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            aria-label="Filtrar por departamento"
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#ffffff]/95 dark:bg-[#000000]/95 backdrop-blur-md border border-[#d4d4d4] dark:border-[#404040] text-xs font-medium text-[#000000] dark:text-[#ffffff] focus:outline-none focus:border-[#000000] dark:focus:border-[#ffffff] shrink-0"
          >
            <option value="all">Todo Paraguay</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {formatDepartment(dept)}
              </option>
            ))}
          </select>

          {filterKeys.map((key) => {
            const isActive = categoryFilter === key;
            const icon = key === 'all' ? null : BW_CATEGORY_ICONS[key];
            const label = key === 'psicologico' ? 'Salud / Psic.' : FILTER_LABELS[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onCategoryChange(key)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border backdrop-blur-md transition-colors cursor-pointer inline-flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#000000] text-[#ffffff] border-[#000000] dark:bg-[#ffffff] dark:text-[#000000] dark:border-[#ffffff]'
                    : 'bg-[#ffffff]/95 dark:bg-[#000000]/95 text-[#000000] dark:text-[#ffffff] border-[#d4d4d4] dark:border-[#404040]'
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

      {/* Top-right Layers + Claro/Oscuro panel */}
      <div
        className={`${
          layersOpen ? 'block' : 'hidden lg:block'
        } absolute top-[104px] lg:top-4 right-3 lg:right-4 z-20 w-[264px] bg-[#ffffff]/95 dark:bg-[#000000]/95 backdrop-blur-xl border border-[#d4d4d4] dark:border-[#404040] rounded-2xl p-3.5 shadow-2xl shadow-black/20 dark:shadow-black/70 transition-colors duration-200`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-display text-xs font-bold text-[#000000] dark:text-[#ffffff]">
            Capas del mapa
          </span>
          <button
            type="button"
            onClick={() => setLayersOpen(false)}
            aria-label="Cerrar capas"
            className="lg:hidden p-1 text-[#737373] dark:text-[#a3a3a3] hover:text-[#000000] dark:hover:text-[#ffffff] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#171717] cursor-pointer transition-colors">
            <span className="flex items-center gap-2 min-w-0">
              <input
                type="checkbox"
                checked={layerVisibility.curated}
                onChange={() => onToggleLayer('curated')}
                className="accent-[#000000] dark:accent-[#ffffff] w-4 h-4 rounded cursor-pointer"
              />
              <span
                className="w-2.5 h-2.5 rotate-45 rounded-[2px] bg-[#000000] dark:bg-[#ffffff] shrink-0"
                aria-hidden="true"
              />
              <span className="text-[#000000] dark:text-[#ffffff] truncate">Centros especializados</span>
            </span>
            <span className="font-mono-num text-[11px] text-[#525252] dark:text-[#a3a3a3]">
              {counts.curatedTotal}
            </span>
          </label>

          <label className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#171717] cursor-pointer transition-colors">
            <span className="flex items-center gap-2 min-w-0">
              <input
                type="checkbox"
                checked={layerVisibility.policial}
                onChange={() => onToggleLayer('policial')}
                className="accent-[#000000] dark:accent-[#ffffff] w-4 h-4 rounded cursor-pointer"
              />
              <span className="bw-emoji text-xs shrink-0" aria-hidden="true">
                🛡️
              </span>
              <span className="text-[#000000] dark:text-[#ffffff] truncate">Comisarías y puestos</span>
            </span>
            <span className="font-mono-num text-[11px] text-[#525252] dark:text-[#a3a3a3]">
              {counts.policialTotal.toLocaleString('es-PY')}
            </span>
          </label>

          <label className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#171717] cursor-pointer transition-colors">
            <span className="flex items-center gap-2 min-w-0">
              <input
                type="checkbox"
                checked={layerVisibility.salud}
                onChange={() => onToggleLayer('salud')}
                className="accent-[#000000] dark:accent-[#ffffff] w-4 h-4 rounded cursor-pointer"
              />
              <span className="font-mono-num font-extrabold text-sm leading-none text-[#000000] dark:text-[#ffffff] shrink-0" aria-hidden="true">
                +
              </span>
              <span className="text-[#000000] dark:text-[#ffffff] truncate">Centros de salud / USF</span>
            </span>
            <span className="font-mono-num text-[11px] text-[#525252] dark:text-[#a3a3a3]">
              {counts.saludTotal.toLocaleString('es-PY')}
            </span>
          </label>
        </div>

        {/* Categorías por ícono, no por color */}
        <div className="mt-2.5 pt-2.5 border-t border-[#e5e5e5] dark:border-[#262626] grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-[#262626] dark:text-[#d4d4d4]">
          <div className="flex items-center gap-1.5">
            <span className="bw-emoji" aria-hidden="true">
              ⚖️
            </span>
            <span>Legal / CRM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono-num font-bold text-[#000000] dark:text-[#ffffff]" aria-hidden="true">
              +
            </span>
            <span>Salud / Psic.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bw-emoji" aria-hidden="true">
              🛡️
            </span>
            <span>Policial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bw-emoji" aria-hidden="true">
              🏠
            </span>
            <span>Albergue</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setLayersOpen(false);
            onOpenSources();
          }}
          className="mt-2.5 w-full min-h-[36px] px-2.5 py-1.5 rounded-lg bg-[#f5f5f5] hover:bg-[#e5e5e5] dark:bg-[#171717] dark:hover:bg-[#262626] border border-[#d4d4d4] dark:border-[#404040] text-[11px] font-medium text-[#000000] dark:text-[#ffffff] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-[#000000] dark:text-[#ffffff]" aria-hidden="true" />
          <span>Fuente de datos (INE)</span>
        </button>
      </div>

      {loadingGeo && (
        <div className="absolute bottom-20 lg:bottom-4 left-3 lg:left-4 z-20 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ffffff]/95 dark:bg-[#000000]/95 backdrop-blur-md border border-[#d4d4d4] dark:border-[#404040] text-xs text-[#000000] dark:text-[#ffffff] shadow-md">
          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          <span>Cargando puntos nacionales...</span>
        </div>
      )}

      {locationError && (
        <div className="absolute bottom-20 lg:bottom-4 left-3 lg:left-4 z-20 max-w-xs px-3 py-2 rounded-xl bg-[#ffffff]/95 dark:bg-[#000000]/95 border border-[#000000] dark:border-[#ffffff] text-xs text-[#000000] dark:text-[#ffffff] shadow-md">
          {locationError}
        </div>
      )}

      {/* Bottom-right location + zoom controls */}
      <div className="absolute bottom-[74px] lg:bottom-4 right-3 lg:right-4 z-20 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={onRequestLocation}
          disabled={locating}
          className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000] dark:focus-visible:ring-[#ffffff] ${
            userLocation
              ? 'bg-[#000000] border-[#000000] text-[#ffffff] dark:bg-[#ffffff] dark:border-[#ffffff] dark:text-[#000000]'
              : 'bg-[#ffffff]/95 dark:bg-[#000000]/95 border-[#d4d4d4] dark:border-[#404040] text-[#000000] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#171717]'
          }`}
        >
          {locating ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Navigation className="w-4 h-4" aria-hidden="true" />
          )}
          <span>Cerca de mí</span>
        </button>

        <div className="flex flex-col bg-[#ffffff]/95 dark:bg-[#000000]/95 backdrop-blur-md border border-[#d4d4d4] dark:border-[#404040] rounded-xl overflow-hidden shadow-lg transition-colors">
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            aria-label="Acercar mapa"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#000000] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#171717] border-b border-[#e5e5e5] dark:border-[#262626] cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            aria-label="Alejar mapa"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#000000] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#171717] border-b border-[#e5e5e5] dark:border-[#262626] cursor-pointer transition-colors"
          >
            <Minus className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              const map = mapRef.current;
              if (!map) return;
              if (departmentFilter !== 'all' && filteredPoints.length > 0) {
                const bounds = L.latLngBounds(filteredPoints.map((p) => [p.lat, p.lng]));
                map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13, animate: true });
              } else {
                map.flyTo(PARAGUAY_CENTER, PARAGUAY_ZOOM, { duration: 0.6 });
              }
            }}
            aria-label="Centrar mapa"
            title="Ver todo el filtro actual"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#000000] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#171717] cursor-pointer transition-colors"
          >
            <Compass className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
