"use client";

import { create } from "zustand";
import type { MapStore } from "@/types";

export type Locale = "es" | "en";

// Tutorial step coordinates for flyTo animations
export const TUTORIAL_LOCATIONS = {
  // Step 1: Argentina overview (hook)
  argentina: {
    lng: -64.0,
    lat: -34.0,
    zoom: 5,
  },
  // Step 2: La Plata region
  laPlata: {
    lng: -57.95,
    lat: -34.92,
    zoom: 11,
  },
  // Step 3: Barrio Sin Nombre (Los Hornos)
  barrioSinNombre: {
    lng: -57.9948,
    lat: -34.9646,
    zoom: 15,
  },
  // Step 4: Back to national view
  national: {
    lng: -64.0,
    lat: -34.0,
    zoom: 5,
  },
};

// Total number of tutorial steps
export const TUTORIAL_STEPS = 5;

// Track if store has been hydrated from localStorage
let isHydrated = false;

export const useMapStore = create<MapStore>((set, get) => ({
  // Map instance
  map: null,
  setMap: (map) => set({ map }),

  // Loading states
  mapLoading: true,
  setMapLoading: (mapLoading) => set({ mapLoading }),

  // View state
  viewState: TUTORIAL_LOCATIONS.argentina,
  setViewState: (viewState) => set({ viewState }),

  // Layer visibility
  showBuildings: true,
  setShowBuildings: (showBuildings) => set({ showBuildings }),
  showSettlements: true,
  setShowSettlements: (showSettlements) => set({ showSettlements }),
  showSatellite: true,
  setShowSatellite: (showSatellite) => set({ showSatellite }),

  // Selection
  selectedSettlement: null,
  setSelectedSettlement: (selectedSettlement) => set({ selectedSettlement }),

  // Population estimation parameters
  populationMultiplier: 3.35,
  setPopulationMultiplier: (populationMultiplier) => set({ populationMultiplier }),
  occupationRate: 1.0,
  setOccupationRate: (occupationRate) => set({ occupationRate }),

  // UI
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  // Tutorial state
  tutorialSeen: false,
  setTutorialSeen: (tutorialSeen) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tutorialSeen", String(tutorialSeen));
    }
    set({ tutorialSeen });
  },

  // Tutorial modal visibility - start hidden to match server, hydrate on client
  showTutorial: false,
  setShowTutorial: (showTutorial) => set({ showTutorial }),

  // Tutorial step tracking (0-indexed, 5 steps total)
  tutorialStep: 0,
  setTutorialStep: (tutorialStep) => set({ tutorialStep }),

  // Tutorial active state (for map dimming)
  tutorialActive: false,
  setTutorialActive: (tutorialActive) => set({ tutorialActive }),

  // Zoom tracking
  currentZoom: 5,
  setCurrentZoom: (currentZoom) => set({ currentZoom }),

  // Locale (kept for backward compat, URL is source of truth now)
  locale: "es",
  setLocale: (locale) => set({ locale }),

  // Navigation
  flyTo: (lng: number, lat: number, zoom: number = 14) => {
    const { map } = get();
    if (!map) return;
    map.flyTo({
      center: [lng, lat],
      zoom,
      duration: 1500,
    });
  },

  // Tutorial-specific flyTo with custom duration
  tutorialFlyTo: (step: number) => {
    const { map } = get();
    if (!map) return;

    let location;
    switch (step) {
      case 0: // Hook - Argentina overview
        location = TUTORIAL_LOCATIONS.argentina;
        break;
      case 1: // La Plata
        location = TUTORIAL_LOCATIONS.laPlata;
        break;
      case 2: // Barrio Sin Nombre
        location = TUTORIAL_LOCATIONS.barrioSinNombre;
        break;
      case 3: // National view
      case 4: // Features (stay at national)
        location = TUTORIAL_LOCATIONS.national;
        break;
      default:
        location = TUTORIAL_LOCATIONS.argentina;
    }

    map.flyTo({
      center: [location.lng, location.lat],
      zoom: location.zoom,
      duration: 2000,
      essential: true,
    });
  },
}));

// Hydrate store from localStorage after mount (avoids hydration mismatch)
// Note: This is NOT a React hook - it's a plain function that updates Zustand state directly
export function hydrateStore() {
  if (typeof window === "undefined" || isHydrated) return;

  isHydrated = true;
  const tutorialSeen = localStorage.getItem("tutorialSeen") === "true";
  useMapStore.setState({
    tutorialSeen,
    showTutorial: !tutorialSeen,
    tutorialActive: !tutorialSeen,
    tutorialStep: 0,
  });
}

// Alias for backward compatibility
export const useStore = useMapStore;
