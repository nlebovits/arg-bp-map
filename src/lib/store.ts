import { create } from "zustand";
import type { Map as MaplibreMap } from "maplibre-gl";

interface MapState {
  map: MaplibreMap | null;
  setMap: (map: MaplibreMap | null) => void;
  flyTo: (lng: number, lat: number, zoom?: number) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  map: null,
  setMap: (map) => set({ map }),
  flyTo: (lng, lat, zoom = 14) => {
    const { map } = get();
    if (!map) return;
    map.flyTo({
      center: [lng, lat],
      zoom,
      duration: 1500,
    });
  },
}));
