"use client";

import { create } from "zustand";
import type { MapStore } from "@/types";

// Argentina center point
const INITIAL_VIEW = {
  lng: -64.0,
  lat: -34.0,
  zoom: 5,
};

export const useMapStore = create<MapStore>((set) => ({
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
  tutorialSeen:
    typeof window !== "undefined"
      ? localStorage.getItem("tutorialSeen") === "true"
      : false,
  setTutorialSeen: (tutorialSeen) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tutorialSeen", String(tutorialSeen));
    }
    set({ tutorialSeen });
  },

  // Locale
  locale: "es",
  setLocale: (locale) => set({ locale }),
}));
