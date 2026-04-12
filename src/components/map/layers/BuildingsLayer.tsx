"use client";

import { useEffect, useCallback, useRef } from "react";
import type { MapMouseEvent } from "maplibre-gl";
import { useMapStore } from "@/lib/store";
import { LAYERS } from "@/lib/config";

/**
 * BuildingsLayer manages the visibility and interactions for building footprints.
 * Following CarbonPlan pattern: renders null, manages map state via effects.
 */
export default function BuildingsLayer() {
  const map = useMapStore((s) => s.map);
  const showBuildings = useMapStore((s) => s.showBuildings);
  const hoveredFeatureId = useRef<string | number | null>(null);

  // Toggle layer visibility
  useEffect(() => {
    if (!map) return;

    const visibility = showBuildings ? "visible" : "none";

    if (map.getLayer(LAYERS.buildings.fill)) {
      map.setLayoutProperty(LAYERS.buildings.fill, "visibility", visibility);
    }
    if (map.getLayer(LAYERS.buildings.outline)) {
      map.setLayoutProperty(LAYERS.buildings.outline, "visibility", visibility);
    }
  }, [map, showBuildings]);

  // Hover interactions
  const handleMouseEnter = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = "pointer";
    }
  }, [map]);

  const handleMouseLeave = useCallback(() => {
    if (!map) return;

    if (hoveredFeatureId.current !== null) {
      map.setFeatureState(
        {
          source: "buildings",
          sourceLayer: LAYERS.buildings.sourceLayer,
          id: hoveredFeatureId.current,
        },
        { hovered: false }
      );
      hoveredFeatureId.current = null;
    }

    map.getCanvas().style.cursor = "";
  }, [map]);

  const handleMouseMove = useCallback(
    (e: MapMouseEvent) => {
      if (!map || map.getZoom() <= 13) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYERS.buildings.fill],
      });

      if (features.length > 0) {
        const feature = features[0];

        if (feature.id !== hoveredFeatureId.current) {
          // Clear previous hover
          if (hoveredFeatureId.current !== null) {
            map.setFeatureState(
              {
                source: "buildings",
                sourceLayer: LAYERS.buildings.sourceLayer,
                id: hoveredFeatureId.current,
              },
              { hovered: false }
            );
          }

          // Set new hover
          if (feature.id) {
            hoveredFeatureId.current = feature.id;
            map.setFeatureState(
              {
                source: "buildings",
                sourceLayer: LAYERS.buildings.sourceLayer,
                id: feature.id,
              },
              { hovered: true }
            );
          }
        }
      } else {
        handleMouseLeave();
      }
    },
    [map, handleMouseLeave]
  );

  // Set up event listeners
  useEffect(() => {
    if (!map) return;

    // Wait for style to load
    const setupListeners = () => {
      if (!map.getLayer(LAYERS.buildings.fill)) return;

      map.on("mouseenter", LAYERS.buildings.fill, handleMouseEnter);
      map.on("mousemove", LAYERS.buildings.fill, handleMouseMove);
      map.on("mouseleave", LAYERS.buildings.fill, handleMouseLeave);
    };

    if (map.isStyleLoaded()) {
      setupListeners();
    } else {
      map.once("styledata", setupListeners);
    }

    return () => {
      if (map.getLayer(LAYERS.buildings.fill)) {
        map.off("mouseenter", LAYERS.buildings.fill, handleMouseEnter);
        map.off("mousemove", LAYERS.buildings.fill, handleMouseMove);
        map.off("mouseleave", LAYERS.buildings.fill, handleMouseLeave);
      }
    };
  }, [map, handleMouseEnter, handleMouseMove, handleMouseLeave]);

  // This component only manages map state, no DOM rendering
  return null;
}
