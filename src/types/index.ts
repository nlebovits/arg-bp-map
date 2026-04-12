import type { Map as MapLibreMap } from "maplibre-gl";

export interface Settlement {
  id: string;
  name: string;
  officialBuildingCount?: number;
  detectedBuildingCount?: number;
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

  // Navigation
  flyTo: (lng: number, lat: number, zoom?: number) => void;

  // Tutorial-specific navigation
  tutorialFlyTo: (step: number) => void;
}
