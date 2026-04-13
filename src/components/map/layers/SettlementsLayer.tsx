"use client";

import { useEffect, useCallback, useRef } from "react";
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
  const map = useMapStore((s) => s.map);
  const setSelectedSettlement = useMapStore((s) => s.setSelectedSettlement);
  const popupRef = useRef<Popup | null>(null);

  // Format number with thousands separator
  const formatNumber = (n: number) => n.toLocaleString("es-AR");

  // Format percentage
  const formatPct = (n: number) => {
    const sign = n >= 0 ? "+" : "";
    return `${sign}${n.toFixed(1)}%`;
  };

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

      // Calculate discrepancy percentage
      const discrepancyPct =
        props.renabap_families > 0
          ? ((props.estimated_min_families - props.renabap_families) /
              props.renabap_families) *
            100
          : 0;

      // Update store
      setSelectedSettlement(props);

      // Create popup content
      const popupContent = `
        <div class="p-3 max-w-xs">
          <h3 class="font-bold text-base mb-2 text-gray-900">${props.nombre_barrio}</h3>
          <div class="text-xs text-gray-600 mb-3">
            ${props.departamento}, ${props.provincia}
            <span class="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium ${
              props.density_tier === "CABA"
                ? "bg-purple-100 text-purple-700"
                : props.density_tier === "Urban"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
            }">${props.density_tier}</span>
          </div>

          <div class="space-y-1.5 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">RENABAP familias:</span>
              <span class="font-medium">${formatNumber(props.renabap_families)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Edificios detectados:</span>
              <span class="font-medium">${formatNumber(props.building_count)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Diferencia:</span>
              <span class="font-medium ${props.difference >= 0 ? "text-orange-600" : "text-green-600"}">
                ${props.difference >= 0 ? "+" : ""}${formatNumber(props.difference)}
              </span>
            </div>

            <hr class="my-2 border-gray-200" />

            <div class="flex justify-between">
              <span class="text-gray-600">Est. familias mín:</span>
              <span class="font-bold text-orange-700">${formatNumber(props.estimated_min_families)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Est. población mín:</span>
              <span class="font-bold text-red-700">${formatNumber(props.estimated_min_population)}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Discrepancia:</span>
              <span class="font-medium ${discrepancyPct >= 0 ? "text-orange-600" : "text-green-600"}">
                ${formatPct(discrepancyPct)}
              </span>
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
    [map, setSelectedSettlement]
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
