"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/lib/store";

// Layer IDs
const LAYERS = {
  mask: "argentina-mask",
  outline: "argentina-outline",
};

// Islas Malvinas (Falkland Islands) - simplified boundary
// Argentina claims sovereignty over these islands
const MALVINAS_COORDINATES: GeoJSON.Position[][] = [
  // East Falkland (Isla Soledad)
  [
    [-57.75, -51.25], [-57.65, -51.35], [-57.75, -51.55], [-57.85, -51.7],
    [-58.0, -51.8], [-58.3, -51.85], [-58.5, -51.9], [-58.85, -51.85],
    [-59.05, -51.95], [-59.2, -52.05], [-59.35, -52.2], [-59.4, -52.35],
    [-59.2, -52.4], [-59.0, -52.35], [-58.7, -52.3], [-58.4, -52.2],
    [-58.2, -52.1], [-58.0, -52.0], [-57.85, -51.9], [-57.7, -51.7],
    [-57.6, -51.5], [-57.65, -51.35], [-57.75, -51.25]
  ],
  // West Falkland (Gran Malvina)
  [
    [-60.0, -51.35], [-59.85, -51.45], [-59.75, -51.6], [-59.85, -51.75],
    [-60.0, -51.9], [-60.25, -52.0], [-60.5, -52.1], [-60.8, -52.15],
    [-61.1, -52.1], [-61.3, -52.0], [-61.4, -51.85], [-61.35, -51.7],
    [-61.2, -51.55], [-61.0, -51.45], [-60.75, -51.35], [-60.5, -51.3],
    [-60.25, -51.3], [-60.0, -51.35]
  ]
];

/**
 * ArgentinaMask creates an inverse fill effect:
 * - Semi-transparent overlay on everything OUTSIDE Argentina
 * - Thick white outline on Argentina's border
 * - Includes Islas Malvinas (Falkland Islands) as part of Argentina
 */
export default function ArgentinaMask() {
  const map = useMapStore((s) => s.map);
  const [argentinaGeometry, setArgentinaGeometry] = useState<GeoJSON.Geometry | null>(null);

  // Fetch Argentina boundary and merge with Malvinas
  useEffect(() => {
    async function fetchArgentina() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/ARG.geo.json"
        );
        const data = await response.json();

        if (data.features?.[0]?.geometry) {
          const baseGeometry = data.features[0].geometry as GeoJSON.MultiPolygon;

          // Add Malvinas to the MultiPolygon
          const withMalvinas: GeoJSON.MultiPolygon = {
            type: "MultiPolygon",
            coordinates: [
              ...baseGeometry.coordinates,
              // Add each Malvinas island as a polygon
              ...MALVINAS_COORDINATES.map(coords => [coords])
            ]
          };

          setArgentinaGeometry(withMalvinas);
        }
      } catch (error) {
        console.error("Failed to fetch Argentina boundary:", error);
      }
    }

    fetchArgentina();
  }, []);

  // Add layers when map and geometry are ready
  useEffect(() => {
    if (!map || !map.getStyle() || !argentinaGeometry) return;

    // Create a world-covering polygon with Argentina as a hole
    const worldBounds: GeoJSON.Position[] = [
      [-180, -90],
      [-180, 90],
      [180, 90],
      [180, -90],
      [-180, -90],
    ];

    // Extract Argentina coordinates (handle both Polygon and MultiPolygon)
    let argentinaCoords: GeoJSON.Position[][][] = [];

    if (argentinaGeometry.type === "Polygon") {
      argentinaCoords = [argentinaGeometry.coordinates];
    } else if (argentinaGeometry.type === "MultiPolygon") {
      argentinaCoords = argentinaGeometry.coordinates;
    }

    // Create mask polygon (world with Argentina holes)
    // For MultiPolygon, we create one big polygon with all Argentina parts as holes
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
    if (!map.getSource("argentina-mask-source")) {
      map.addSource("argentina-mask-source", {
        type: "geojson",
        data: maskGeoJSON,
      });
    }

    // Add Argentina outline source
    if (!map.getSource("argentina-outline-source")) {
      map.addSource("argentina-outline-source", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: argentinaGeometry,
        },
      });
    }

    // Add mask layer (semi-transparent fill outside Argentina)
    // Insert below labels but above satellite
    const firstLabelLayer = map.getStyle().layers?.find(
      (layer) => layer.type === "symbol"
    )?.id;

    if (!map.getLayer(LAYERS.mask)) {
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
    }

    // Add Argentina outline (thick white line)
    if (!map.getLayer(LAYERS.outline)) {
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
    }

    return () => {
      // Cleanup on unmount
      if (map.getStyle()) {
        if (map.getLayer(LAYERS.mask)) map.removeLayer(LAYERS.mask);
        if (map.getLayer(LAYERS.outline)) map.removeLayer(LAYERS.outline);
        if (map.getSource("argentina-mask-source")) map.removeSource("argentina-mask-source");
        if (map.getSource("argentina-outline-source")) map.removeSource("argentina-outline-source");
      }
    };
  }, [map, argentinaGeometry]);

  return null;
}
