"use client";

import { useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Popup } from "maplibre-gl";
import type { MapMouseEvent } from "maplibre-gl";
import { useMapStore } from "@/lib/store";
import { LAYERS } from "@/lib/config";
import type { Settlement } from "@/types";

/**
 * SettlementsLayer manages click interactions and popups for settlement features.
 * Shows popup with all settlement data fields on click.
 */
export default function SettlementsLayer() {
  const t = useTranslations("popup");
  const map = useMapStore((s) => s.map);
  const setSelectedSettlement = useMapStore((s) => s.setSelectedSettlement);
  const popupRef = useRef<Popup | null>(null);

  const populationMultiplier = useMapStore((s) => s.populationMultiplier);
  const occupationRate = useMapStore((s) => s.occupationRate);

  // Use refs for values that change frequently to avoid listener churn
  const paramsRef = useRef({ populationMultiplier, occupationRate });
  paramsRef.current = { populationMultiplier, occupationRate };

  // Format number with thousands separator
  const formatNumber = (n: number) => n.toLocaleString("es-AR");

  // Handle click on settlement
  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      if (!map) return;

      // Query both circle layer (points, z0-12) and fill layer (polygons, z13+)
      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYERS.settlements.fill, LAYERS.settlements.outline],
      });

      if (features.length === 0) {
        // Close popup if clicking outside settlements
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        setSelectedSettlement(null);
        return;
      }

      const feature = features[0];
      const props = feature.properties as Settlement;

      // Update store
      setSelectedSettlement(props);

      // Compute population estimate using sidebar params (via ref to avoid listener churn)
      const { populationMultiplier: mult, occupationRate: occ } = paramsRef.current;
      const estPopulation = Math.round(props.building_count * occ * mult);

      // Create popup content - simplified to key fields only
      const popupContent = `
        <div class="settlement-popup-content">
          <h3 class="popup-name">${props.nombre}</h3>
          <p class="popup-location">${props.departamento}, ${props.provincia}</p>
          <div class="popup-stats">
            <div class="popup-stat">
              <span class="popup-label">${t("renabapFamilies")}</span>
              <span class="popup-value">${formatNumber(props.renabap_families)}</span>
            </div>
            <div class="popup-stat">
              <span class="popup-label">${t("detectedBuildings")}</span>
              <span class="popup-value">${formatNumber(props.building_count)}</span>
            </div>
            <div class="popup-stat popup-highlight">
              <span class="popup-label">${t("estPopulation")}</span>
              <span class="popup-value popup-accent">${formatNumber(estPopulation)}</span>
            </div>
          </div>
        </div>
      `;

      // Remove existing popup
      if (popupRef.current) {
        popupRef.current.remove();
      }

      // Create new popup
      popupRef.current = new Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: "320px",
        className: "settlement-popup",
      })
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
    },
    [map, setSelectedSettlement, t]
  );

  // Hover cursor change
  const handleMouseEnter = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = "pointer";
    }
  }, [map]);

  const handleMouseLeave = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = "";
    }
  }, [map]);

  // Set up event listeners for both circle (points) and fill (polygons) layers
  useEffect(() => {
    if (!map) return;

    const setupListeners = () => {
      // Circle layer for points (z0-12)
      if (map.getLayer(LAYERS.settlements.fill)) {
        map.on("click", LAYERS.settlements.fill, handleClick);
        map.on("mouseenter", LAYERS.settlements.fill, handleMouseEnter);
        map.on("mouseleave", LAYERS.settlements.fill, handleMouseLeave);
      }
      // Fill layer for polygons (z13+)
      if (map.getLayer(LAYERS.settlements.outline)) {
        map.on("click", LAYERS.settlements.outline, handleClick);
        map.on("mouseenter", LAYERS.settlements.outline, handleMouseEnter);
        map.on("mouseleave", LAYERS.settlements.outline, handleMouseLeave);
      }
    };

    // Wait for map load (not styledata) because layers are added in load handler
    if (map.isStyleLoaded() && map.getLayer(LAYERS.settlements.fill)) {
      setupListeners();
    } else {
      map.once("load", setupListeners);
    }

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      if (map.getStyle()) {
        if (map.getLayer(LAYERS.settlements.fill)) {
          map.off("click", LAYERS.settlements.fill, handleClick);
          map.off("mouseenter", LAYERS.settlements.fill, handleMouseEnter);
          map.off("mouseleave", LAYERS.settlements.fill, handleMouseLeave);
        }
        if (map.getLayer(LAYERS.settlements.outline)) {
          map.off("click", LAYERS.settlements.outline, handleClick);
          map.off("mouseenter", LAYERS.settlements.outline, handleMouseEnter);
          map.off("mouseleave", LAYERS.settlements.outline, handleMouseLeave);
        }
      }
    };
  }, [map, handleClick, handleMouseEnter, handleMouseLeave]);

  // This component only manages map state, no DOM rendering
  return null;
}
