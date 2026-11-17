export type ThemeMode = 'dark' | 'light';

export type CategoryKey = 'emergencia' | 'legal' | 'psicologico' | 'albergue' | 'policial';

export type FilterCategory = 'all' | 'legal' | 'psicologico' | 'policial' | 'albergue';

export type LayerSource = 'curated' | 'policial' | 'salud';

export type TabId = 'mapa' | 'centros' | 'telefonos' | 'info';

export interface CuratedCenter {
  id: number;
  name: string;
  category: CategoryKey;
  address: string;
  phone: string;
  hours: string;
  email?: string;
  services: string[];
  lat: number;
  lng: number;
  city: string;
  departamento: string;
}

export interface MapPoint {
  uid: string;
  source: LayerSource;
  curatedId?: number;
  name: string;
  category: CategoryKey;
  subCategory: string;
  address: string;
  distrito: string;
  departamento: string;
  phone: string;
  hours: string;
  email?: string;
  services: string[];
  lat: number;
  lng: number;
  isPriority: boolean;
}

export interface SortedPointItem {
  point: MapPoint;
  distanceKm: number | null;
}

export interface LayerVisibility {
  curated: boolean;
  policial: boolean;
  salud: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface FlyToTarget {
  lat: number;
  lng: number;
  zoom: number;
  nonce: number;
}

export interface DataCounts {
  totalFiltered: number;
  curatedTotal: number;
  policialTotal: number;
  saludTotal: number;
  curatedFiltered: number;
  geoFiltered: number;
}

export interface EmergencyLine {
  number: string;
  telHref: string;
  name: string;
  color: string;
  desc: string;
  hours: string;
  isFree: boolean;
}

export interface ReportStep {
  step: string;
  title: string;
  accent: string;
  description: string;
}

export interface ClusterAggregate {
  policialCount: number;
  saludCount: number;
}
