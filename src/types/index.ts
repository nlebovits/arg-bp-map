import type { Map as MapLibreMap } from "maplibre-gl";

export interface Settlement {
  id_renabap: number;
  nombre: string;
  provincia: string;
  departamento: string;
  localidad: string;
  is_urban: boolean;
  estimate_source: "buildings" | "renabap";
  renabap_families: number;
  building_count: number;
  estimated_families: number;
}

export interface MapViewState {
  lng: number;
  lat: number;
  zoom: number;
}

export interface MapStore {
  // Map instance
  map: MapLibreMap | null;
  setMap: (map: MapLibreMap | null) => void;

  // Loading states
  mapLoading: boolean;
  setMapLoading: (loading: boolean) => void;

  // View state
  viewState: MapViewState;
  setViewState: (viewState: MapViewState) => void;

  // Layer visibility
  showBuildings: boolean;
  setShowBuildings: (show: boolean) => void;
  showSettlements: boolean;
  setShowSettlements: (show: boolean) => void;
  showSatellite: boolean;
  setShowSatellite: (show: boolean) => void;

  // Selection
  selectedSettlement: Settlement | null;
  setSelectedSettlement: (settlement: Settlement | null) => void;

  // Population estimation parameters
  populationMultiplier: 2.8 | 3.35;
  setPopulationMultiplier: (multiplier: 2.8 | 3.35) => void;
  occupationRate: 0.85 | 0.9 | 0.95 | 1.0;
  setOccupationRate: (rate: 0.85 | 0.9 | 0.95 | 1.0) => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  tutorialSeen: boolean;
  setTutorialSeen: (seen: boolean) => void;

  // Locale
  locale: "es" | "en";
  setLocale: (locale: "es" | "en") => void;

  // Tutorial modal
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;

  // Tutorial step tracking
  tutorialStep: number;
  setTutorialStep: (step: number) => void;

  // Tutorial active state (for map dimming)
  tutorialActive: boolean;
  setTutorialActive: (active: boolean) => void;

  // Zoom tracking
  currentZoom: number;
  setCurrentZoom: (zoom: number) => void;

  // Navigation
  flyTo: (lng: number, lat: number, zoom?: number) => void;

  // Tutorial-specific navigation
  tutorialFlyTo: (step: number) => void;
}
