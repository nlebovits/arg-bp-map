"use client";

import { useEffect } from "react";
import { useMapStore } from "@/lib/store";
import { LAYERS } from "@/lib/config";

/**
 * BuildingsLayer manages the visibility for building footprints.
 * Buildings are not interactive (no click/hover) - just visual context.
 */
export default function BuildingsLayer() {
  const map = useMapStore((s) => s.map);
  const showBuildings = useMapStore((s) => s.showBuildings);

  // Toggle layer visibility
  useEffect(() => {
    if (!map || !map.getStyle()) return;

    const visibility = showBuildings ? "visible" : "none";

    if (map.getLayer(LAYERS.buildings.fill)) {
      map.setLayoutProperty(LAYERS.buildings.fill, "visibility", visibility);
    }
    if (map.getLayer(LAYERS.buildings.outline)) {
      map.setLayoutProperty(LAYERS.buildings.outline, "visibility", visibility);
    }
  }, [map, showBuildings]);

  // This component only manages map state, no DOM rendering
  return null;
}
