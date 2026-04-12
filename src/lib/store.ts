"use client";

import { create } from "zustand";
import type { MapStore } from "@/types";

export type Locale = "es" | "en";

// Argentina center point
const INITIAL_VIEW = {
  lng: -64.0,
  lat: -34.0,
  zoom: 5,
};

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
  viewState: INITIAL_VIEW,
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

  // UI
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  // Initialize with server-safe defaults (hydrated in useHydrateStore)
  tutorialSeen: false,
  setTutorialSeen: (tutorialSeen) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tutorialSeen", String(tutorialSeen));
    }
    set({ tutorialSeen });
  },

  // Locale (kept for backward compat, URL is source of truth now)
  locale: "es",
  setLocale: (locale) => set({ locale }),

  // Tutorial modal - start hidden to match server, hydrate on client
  showTutorial: false,
  setShowTutorial: (showTutorial) => set({ showTutorial }),

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
}));

// Hook to hydrate store from localStorage after mount (avoids hydration mismatch)
export function useHydrateStore() {
  if (typeof window === "undefined" || isHydrated) return;

  isHydrated = true;
  const tutorialSeen = localStorage.getItem("tutorialSeen") === "true";
  useMapStore.setState({
    tutorialSeen,
    showTutorial: !tutorialSeen,
  });
}

// Alias for backward compatibility
export const useStore = useMapStore;
