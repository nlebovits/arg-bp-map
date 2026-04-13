"use client";

import { useEffect } from "react";
import { useMapStore } from "@/lib/store";
import { ARGENTINA_GEOMETRY } from "@/lib/argentina-boundary";

// Layer IDs
const LAYERS = {
  mask: "argentina-mask",
  outline: "argentina-outline",
};

/**
 * ArgentinaMask creates an inverse fill effect:
 * - Semi-transparent overlay on everything OUTSIDE Argentina
 * - Thick white outline on Argentina's border
 * - Includes Islas Malvinas (Falkland Islands) as part of Argentina
 *
 * Boundary data is pre-merged at build time (Natural Earth 50m + Malvinas)
 * for zero-fetch, instant render.
 */
export default function ArgentinaMask() {
  const map = useMapStore((s) => s.map);

  // Add layers when map is ready (geometry is static import, always available)
  useEffect(() => {
    if (!map) return;

    const addLayers = () => {
      // Guard: style must be loaded
      if (!map.getStyle()) return;

      // Skip if already added
      if (map.getSource("argentina-mask-source")) return;

      // Create a world-covering polygon with Argentina as a hole
      const worldBounds: GeoJSON.Position[] = [
        [-180, -90],
        [-180, 90],
        [180, 90],
        [180, -90],
        [-180, -90],
      ];

      // Argentina coordinates (always MultiPolygon from static data)
      const argentinaCoords = ARGENTINA_GEOMETRY.coordinates;

      // Create mask polygon (world with Argentina holes)
      const maskCoordinates: GeoJSON.Position[][] = [worldBounds];

      // Add each Argentina polygon's outer ring as a hole
      for (const polygon of argentinaCoords) {
        // Reverse the winding order for holes
        maskCoordinates.push([...polygon[0]].reverse());
      }

      const maskGeoJSON: GeoJSON.Feature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: maskCoordinates,
        },
      };

      // Add mask source
      map.addSource("argentina-mask-source", {
        type: "geojson",
        data: maskGeoJSON,
      });

      // Add Argentina outline source
      map.addSource("argentina-outline-source", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: ARGENTINA_GEOMETRY,
        },
      });

      // Add mask layer (semi-transparent fill outside Argentina)
      // Insert below labels but above satellite
      const firstLabelLayer = map.getStyle().layers?.find(
        (layer) => layer.type === "symbol"
      )?.id;

      map.addLayer(
        {
          id: LAYERS.mask,
          type: "fill",
          source: "argentina-mask-source",
          paint: {
            "fill-color": "#000000",
            "fill-opacity": 0.5,
          },
        },
        firstLabelLayer
      );

      // Add Argentina outline (thick white line)
      map.addLayer(
        {
          id: LAYERS.outline,
          type: "line",
          source: "argentina-outline-source",
          paint: {
            "line-color": "#ffffff",
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              3, 2,
              6, 3,
              10, 4,
            ],
            "line-opacity": 0.8,
          },
        },
        firstLabelLayer
      );
    };

    // If map already loaded, add immediately; otherwise wait for load event
    if (map.loaded()) {
      addLayers();
    } else {
      map.on("load", addLayers);
    }

    return () => {
      map.off("load", addLayers);
      // Cleanup layers on unmount
      if (map.getStyle()) {
        if (map.getLayer(LAYERS.mask)) map.removeLayer(LAYERS.mask);
        if (map.getLayer(LAYERS.outline)) map.removeLayer(LAYERS.outline);
        if (map.getSource("argentina-mask-source")) map.removeSource("argentina-mask-source");
        if (map.getSource("argentina-outline-source")) map.removeSource("argentina-outline-source");
      }
    };
  }, [map]);

  return null;
}
