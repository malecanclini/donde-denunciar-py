import { useEffect, useMemo, useState } from 'react';
import Supercluster from 'supercluster';
import {
  CURATED_CENTERS,
  formatDepartment,
  haversineKm,
  mapPolicialFeature,
  mapSaludFeature,
} from '../data/resources';
import type {
  ClusterAggregate,
  DataCounts,
  FilterCategory,
  LayerVisibility,
  MapPoint,
  SortedPointItem,
  UserLocation,
} from '../types/map';

export interface PointFeatureProps {
  cluster: false;
  point: MapPoint;
}

export type SuperclusterIndex = Supercluster<PointFeatureProps, ClusterAggregate>;

interface UseMapDataParams {
  categoryFilter: FilterCategory;
  departmentFilter: string;
  searchQuery: string;
  layerVisibility: LayerVisibility;
  userLocation: UserLocation | null;
}

export function useMapData({
  categoryFilter,
  departmentFilter,
  searchQuery,
  layerVisibility,
  userLocation,
}: UseMapDataParams) {
  const [policialPoints, setPolicialPoints] = useState<MapPoint[]>([]);
  const [saludPoints, setSaludPoints] = useState<MapPoint[]>([]);
  const [loadingGeo, setLoadingGeo] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  const curatedPoints = useMemo<MapPoint[]>(
    () =>
      CURATED_CENTERS.map((c) => ({
        uid: `cur-${c.id}`,
        source: 'curated',
        curatedId: c.id,
        name: c.name,
        category: c.category,
        subCategory: 'Centro especializado',
        address: c.address,
        distrito: c.city,
        departamento: c.departamento,
        phone: c.phone,
        hours: c.hours,
        email: c.email,
        services: c.services,
        lat: c.lat,
        lng: c.lng,
        isPriority: true,
      })),
    []
  );

  useEffect(() => {
    let active = true;
    setLoadingGeo(true);
    setGeoError(null);

    Promise.all([
      fetch('/data/locales_policiales.geojson').then((res) => {
        if (!res.ok) throw new Error('Error al cargar locales policiales');
        return res.json();
      }),
      fetch('/data/locales_de_salud.geojson').then((res) => {
        if (!res.ok) throw new Error('Error al cargar centros de salud');
        return res.json();
      }),
    ])
      .then(([polJson, salJson]) => {
        if (!active) return;
        const pol = ((polJson.features || []) as Array<Record<string, unknown>>)
          .map(mapPolicialFeature)
          .filter((item): item is MapPoint => item !== null);
        const sal = ((salJson.features || []) as Array<Record<string, unknown>>)
          .map(mapSaludFeature)
          .filter((item): item is MapPoint => item !== null);

        setPolicialPoints(pol);
        setSaludPoints(sal);
        setLoadingGeo(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setGeoError(err instanceof Error ? err.message : 'No se pudieron cargar las capas geográficas.');
        setLoadingGeo(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const departments = useMemo(() => {
    const set = new Set<string>();
    curatedPoints.forEach((p) => set.add(p.departamento));
    policialPoints.forEach((p) => set.add(p.departamento));
    saludPoints.forEach((p) => set.add(p.departamento));
    return Array.from(set)
      .filter(Boolean)
      .sort((a, b) => formatDepartment(a).localeCompare(formatDepartment(b), 'es'));
  }, [curatedPoints, policialPoints, saludPoints]);

  const allPoints = useMemo(
    () => [...curatedPoints, ...policialPoints, ...saludPoints],
    [curatedPoints, policialPoints, saludPoints]
  );

  const filteredPoints = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPoints.filter((pt) => {
      if (pt.source === 'curated' && !layerVisibility.curated) return false;
      if (pt.source === 'policial' && !layerVisibility.policial) return false;
      if (pt.source === 'salud' && !layerVisibility.salud) return false;
      if (categoryFilter !== 'all' && pt.category !== categoryFilter) return false;
      if (departmentFilter !== 'all' && pt.departamento !== departmentFilter) return false;
      if (q) {
        const haystack = `${pt.name} ${pt.address} ${pt.distrito} ${formatDepartment(pt.departamento)} ${pt.subCategory} ${pt.services.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allPoints, categoryFilter, departmentFilter, searchQuery, layerVisibility]);

  const sortedListPoints = useMemo<SortedPointItem[]>(() => {
    const items = filteredPoints.map((pt) => ({
      point: pt,
      distanceKm: userLocation ? haversineKm(userLocation.lat, userLocation.lng, pt.lat, pt.lng) : null,
    }));

    items.sort((a, b) => {
      if (
        userLocation &&
        a.distanceKm !== null &&
        b.distanceKm !== null &&
        Math.abs(a.distanceKm - b.distanceKm) > 0.35
      ) {
        return a.distanceKm - b.distanceKm;
      }
      if (a.point.isPriority === b.point.isPriority) {
        return a.point.name.localeCompare(b.point.name, 'es');
      }
      return a.point.isPriority ? -1 : 1;
    });

    return items;
  }, [filteredPoints, userLocation]);

  const filteredCurated = useMemo(() => filteredPoints.filter((p) => p.isPriority), [filteredPoints]);
  const filteredGeoPoints = useMemo(() => filteredPoints.filter((p) => !p.isPriority), [filteredPoints]);

  const superclusterIndexes = useMemo(() => {
    const features: Array<GeoJSON.Feature<GeoJSON.Point, PointFeatureProps>> = filteredGeoPoints.map((pt) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [pt.lng, pt.lat],
      },
      properties: {
        cluster: false,
        point: pt,
      },
    }));

    const buildIndex = (radius: number, minPoints: number): SuperclusterIndex => {
      const idx = new Supercluster<PointFeatureProps, ClusterAggregate>({
        radius,
        maxZoom: 15,
        minPoints,
        map: (props) => ({
          policialCount: props.point.source === 'policial' ? 1 : 0,
          saludCount: props.point.source === 'salud' ? 1 : 0,
        }),
        reduce: (acc, props) => {
          acc.policialCount += props.policialCount;
          acc.saludCount += props.saludCount;
        },
      });
      idx.load(features);
      return idx;
    };

    return {
      lowZoom: buildIndex(60, 3),
      highZoom: buildIndex(40, 2),
    };
  }, [filteredGeoPoints]);

  const counts = useMemo<DataCounts>(
    () => ({
      totalFiltered: filteredPoints.length,
      curatedTotal: curatedPoints.length,
      policialTotal: policialPoints.length,
      saludTotal: saludPoints.length,
      curatedFiltered: filteredCurated.length,
      geoFiltered: filteredGeoPoints.length,
    }),
    [
      filteredPoints.length,
      curatedPoints.length,
      policialPoints.length,
      saludPoints.length,
      filteredCurated.length,
      filteredGeoPoints.length,
    ]
  );

  return {
    loadingGeo,
    geoError,
    departments,
    filteredPoints,
    filteredCurated,
    filteredGeoPoints,
    sortedListPoints,
    superclusterIndexes,
    counts,
    allPoints,
  };
}
