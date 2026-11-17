import { useCallback, useEffect, useState } from 'react';
import { DataSourcesModal } from './components/DataSourcesModal';
import { DetailDrawer } from './components/DetailDrawer';
import { EmergencyPhones } from './components/EmergencyPhones';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HowToReport } from './components/HowToReport';
import { InteractiveMap } from './components/InteractiveMap';
import { MobileNav } from './components/MobileNav';
import { Sidebar } from './components/Sidebar';
import { BwHeader } from './components/bw/BwHeader';
import { BwInteractiveMap } from './components/bw/BwInteractiveMap';
import { BwSidebar } from './components/bw/BwSidebar';
import {
  BwDataSourcesModal,
  BwDetailDrawer,
  BwEmergencyPhones,
  BwFooter,
  BwHowToReport,
  BwMobileNav,
} from './components/bw/BwViews';
import { useMapData } from './hooks/useMapData';
import type {
  FilterCategory,
  FlyToTarget,
  LayerVisibility,
  MapPoint,
  TabId,
  ThemeMode,
  UserLocation,
} from './types/map';

type AppEdition = 'original' | 'bw';

function getInitialEdition(): AppEdition {
  if (typeof window === 'undefined') return 'original';
  const params = new URLSearchParams(window.location.search);
  if (params.get('version') === 'bw' || window.location.hash === '#bw') {
    return 'bw';
  }
  return 'original';
}

export default function App() {
  const [edition, setEdition] = useState<AppEdition>(getInitialEdition);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activeTab, setActiveTab] = useState<TabId>('mapa');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    curated: true,
    policial: true,
    salud: true,
  });
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<FlyToTarget | null>(null);
  const [sourcesModalOpen, setSourcesModalOpen] = useState(false);

  // Sincroniza la clase "dark" directamente en <body> y meta theme-color
  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      if (edition === 'bw') {
        themeMeta.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
      } else {
        themeMeta.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff');
      }
    }
  }, [theme, edition]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const switchEdition = useCallback((next: AppEdition) => {
    setEdition(next);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (next === 'bw') {
        url.searchParams.set('version', 'bw');
      } else {
        url.searchParams.delete('version');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const {
    loadingGeo,
    geoError,
    departments,
    filteredPoints,
    filteredCurated,
    sortedListPoints,
    superclusterIndexes,
    counts,
  } = useMapData({
    categoryFilter,
    departmentFilter,
    searchQuery,
    layerVisibility,
    userLocation,
  });

  const handleToggleLayer = useCallback((layer: keyof LayerVisibility) => {
    setLayerVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const handleSelectPointFromList = useCallback((point: MapPoint) => {
    setSelectedPoint(point);
    setActiveTab('mapa');
    setFlyToTarget({
      lat: point.lat,
      lng: point.lng,
      zoom: 15,
      nonce: Date.now(),
    });
  }, []);

  const handleRequestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no admite geolocalización.');
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: UserLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setUserLocation(loc);
        setLocating(false);
        setFlyToTarget({
          lat: loc.lat,
          lng: loc.lng,
          zoom: 13,
          nonce: Date.now(),
        });
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Permiso de ubicación denegado. Podés filtrar por departamento.');
        } else {
          setLocationError('No se pudo obtener tu ubicación actual.');
        }
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 }
    );
  }, []);

  if (edition === 'bw') {
    return (
      <div className="bw-edition min-h-dvh h-dvh flex flex-col bg-[#ffffff] text-[#000000] dark:bg-[#000000] dark:text-[#ffffff] overflow-hidden transition-colors duration-200">
        <BwHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onBackToOriginal={() => switchEdition('original')}
          theme={theme}
          onSetTheme={setTheme}
        />

        <main className="flex-1 min-h-0 relative">
          {(activeTab === 'mapa' || activeTab === 'centros') && (
            <div className="h-full max-w-[1440px] mx-auto flex flex-col lg:flex-row">
              <aside
                className={`${
                  activeTab === 'centros' ? 'block w-full h-full' : 'hidden lg:block lg:w-[400px] lg:shrink-0 lg:h-full'
                } border-r border-[#e5e5e5] dark:border-[#262626] min-h-0 transition-colors duration-200`}
              >
                <BwSidebar
                  items={sortedListPoints}
                  departments={departments}
                  departmentFilter={departmentFilter}
                  onDepartmentChange={setDepartmentFilter}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedUid={selectedPoint?.uid ?? null}
                  onSelectPoint={handleSelectPointFromList}
                  userLocation={userLocation}
                  locating={locating}
                  onRequestLocation={handleRequestLocation}
                  loadingGeo={loadingGeo}
                  geoError={geoError}
                />
              </aside>

              <section
                aria-label="Mapa interactivo en blanco y negro de recursos en Paraguay"
                className={`${
                  activeTab === 'mapa' ? 'flex-1 h-full pb-[60px] lg:pb-0' : 'hidden lg:block lg:flex-1 lg:h-full'
                } relative min-w-0`}
              >
                <BwInteractiveMap
                  theme={theme}
                  filteredCurated={filteredCurated}
                  filteredPoints={filteredPoints}
                  superclusterIndexes={superclusterIndexes}
                  selectedPoint={selectedPoint}
                  onSelectPoint={setSelectedPoint}
                  userLocation={userLocation}
                  locating={locating}
                  locationError={locationError}
                  onRequestLocation={handleRequestLocation}
                  layerVisibility={layerVisibility}
                  onToggleLayer={handleToggleLayer}
                  departmentFilter={departmentFilter}
                  departments={departments}
                  onDepartmentChange={setDepartmentFilter}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  flyToTarget={flyToTarget}
                  loadingGeo={loadingGeo}
                  isVisible={activeTab === 'mapa'}
                  onOpenSources={() => setSourcesModalOpen(true)}
                  counts={counts}
                />
              </section>
            </div>
          )}

          {activeTab === 'telefonos' && (
            <div className="h-full overflow-y-auto custom-scrollbar">
              <BwEmergencyPhones />
            </div>
          )}

          {activeTab === 'info' && (
            <div className="h-full overflow-y-auto custom-scrollbar">
              <BwHowToReport
                onGoToMap={() => setActiveTab('mapa')}
                onOpenSources={() => setSourcesModalOpen(true)}
              />
            </div>
          )}

          {activeTab === 'mapa' && (
            <BwDetailDrawer
              point={selectedPoint}
              userLocation={userLocation}
              onClose={() => setSelectedPoint(null)}
            />
          )}
        </main>

        <BwFooter />

        <BwMobileNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          filteredCount={counts.totalFiltered}
        />

        <BwDataSourcesModal open={sourcesModalOpen} onClose={() => setSourcesModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh h-dvh flex flex-col bg-[#ffffff] text-[#000000] dark:bg-[#111827] dark:text-[#ffffff] overflow-hidden transition-colors duration-200">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenBwEdition={() => switchEdition('bw')}
      />

      <main className="flex-1 min-h-0 relative">
        {(activeTab === 'mapa' || activeTab === 'centros') && (
          <div className="h-full max-w-[1440px] mx-auto flex flex-col lg:flex-row">
            <aside
              className={`${
                activeTab === 'centros' ? 'block w-full h-full' : 'hidden lg:block lg:w-[400px] lg:shrink-0 lg:h-full'
              } border-r border-[#e5e7eb] dark:border-[#1f2937] min-h-0 transition-colors duration-200`}
            >
              <Sidebar
                items={sortedListPoints}
                departments={departments}
                departmentFilter={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedUid={selectedPoint?.uid ?? null}
                onSelectPoint={handleSelectPointFromList}
                userLocation={userLocation}
                locating={locating}
                onRequestLocation={handleRequestLocation}
                loadingGeo={loadingGeo}
                geoError={geoError}
              />
            </aside>

            <section
              aria-label="Mapa interactivo de recursos en Paraguay"
              className={`${
                activeTab === 'mapa' ? 'flex-1 h-full pb-[60px] lg:pb-0' : 'hidden lg:block lg:flex-1 lg:h-full'
              } relative min-w-0`}
            >
              <InteractiveMap
                theme={theme}
                onToggleTheme={toggleTheme}
                filteredCurated={filteredCurated}
                filteredPoints={filteredPoints}
                superclusterIndexes={superclusterIndexes}
                selectedPoint={selectedPoint}
                onSelectPoint={setSelectedPoint}
                userLocation={userLocation}
                locating={locating}
                locationError={locationError}
                onRequestLocation={handleRequestLocation}
                layerVisibility={layerVisibility}
                onToggleLayer={handleToggleLayer}
                departmentFilter={departmentFilter}
                departments={departments}
                onDepartmentChange={setDepartmentFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                flyToTarget={flyToTarget}
                loadingGeo={loadingGeo}
                isVisible={activeTab === 'mapa'}
                onOpenSources={() => setSourcesModalOpen(true)}
                counts={counts}
              />
            </section>
          </div>
        )}

        {activeTab === 'telefonos' && (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <EmergencyPhones />
          </div>
        )}

        {activeTab === 'info' && (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <HowToReport
              onGoToMap={() => setActiveTab('mapa')}
              onOpenSources={() => setSourcesModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'mapa' && (
          <DetailDrawer
            point={selectedPoint}
            userLocation={userLocation}
            onClose={() => setSelectedPoint(null)}
          />
        )}
      </main>

      <Footer />

      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        filteredCount={counts.totalFiltered}
      />

      <DataSourcesModal open={sourcesModalOpen} onClose={() => setSourcesModalOpen(false)} />
    </div>
  );
}
