"use client";

import { useEffect, useRef } from "react";
import {
  Map as MapLibreMap,
  addProtocol,
  removeProtocol,
  NavigationControl,
} from "maplibre-gl";
import { Protocol } from "pmtiles";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMapStore } from "@/lib/store";
import {
  SOURCES,
  LAYERS,
  MAP_BOUNDS,
  INITIAL_VIEW,
  COLORS,
  BARRIO_SIN_NOMBRE_ID,
} from "@/lib/config";
import BuildingsLayer from "./layers/BuildingsLayer";
import ArgentinaMask from "./layers/ArgentinaMask";
import MapControls from "./MapControls";

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const map = useMapStore((s) => s.map);
  const setMap = useMapStore((s) => s.setMap);
  const setMapLoading = useMapStore((s) => s.setMapLoading);
  const showSatellite = useMapStore((s) => s.showSatellite);
  const showSettlements = useMapStore((s) => s.showSettlements);
  const tutorialActive = useMapStore((s) => s.tutorialActive);
  const tutorialStep = useMapStore((s) => s.tutorialStep);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    setMapLoading(true);

    // Register PMTiles protocol
    const protocol = new Protocol();
    addProtocol("pmtiles", protocol.tile);

    const mapInstance = new MapLibreMap({
      container: containerRef.current,
      style: {
        version: 8,
        glyphs:
          "https://carbonplan-maps.s3.us-west-2.amazonaws.com/basemaps/fonts/{fontstack}/{range}.pbf",
        sources: {
          satellite: SOURCES.satellite,
          basemap: SOURCES.basemap,
          buildings: SOURCES.buildings,
        },
        layers: [
          // Satellite base layer (grayscale for muted aesthetic)
          {
            id: LAYERS.satellite,
            type: "raster",
            source: "satellite",
            paint: {
              "raster-saturation": -1,
              "raster-contrast": -0.5,
              "raster-opacity": 0.5,
            },
          },

          // Building footprints - fill
          {
            id: LAYERS.buildings.fill,
            type: "fill",
            source: "buildings",
            "source-layer": LAYERS.buildings.sourceLayer,
            paint: {
              "fill-color": COLORS.buildings.fill,
              "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0,
                12,
                0.7,
              ],
            },
            minzoom: 10,
          },

          // Building footprints - outline
          {
            id: LAYERS.buildings.outline,
            type: "line",
            source: "buildings",
            "source-layer": LAYERS.buildings.sourceLayer,
            paint: {
              "line-color": COLORS.buildings.outline,
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0.5,
                16,
                1.5,
              ],
              "line-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0,
                12,
                0.9,
              ],
            },
            minzoom: 10,
          },

          // Boundaries (admin borders)
          {
            id: "boundaries",
            type: "line",
            source: "basemap",
            "source-layer": "boundaries",
            paint: {
              "line-color": "rgba(255, 255, 255, 0.4)",
              "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.5, 10, 2],
              "line-dasharray": [2, 2],
            },
          },

          // Roads (subtle, for context)
          {
            id: "roads",
            type: "line",
            source: "basemap",
            "source-layer": "roads",
            filter: ["in", "kind", "highway", "major_road"],
            paint: {
              "line-color": "rgba(255, 255, 255, 0.15)",
              "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.5, 14, 2],
            },
            minzoom: 8,
          },

          // Place labels - countries
          {
            id: "place-country",
            type: "symbol",
            source: "basemap",
            "source-layer": "places",
            filter: ["==", "kind", "country"],
            layout: {
              "text-field": "{name}",
              "text-font": ["Helvetica"],
              "text-size": ["interpolate", ["linear"], ["zoom"], 3, 12, 6, 16],
              "text-transform": "uppercase",
              "text-letter-spacing": 0.1,
            },
            paint: {
              "text-color": "rgba(255, 255, 255, 0.9)",
              "text-halo-color": "rgba(0, 0, 0, 0.8)",
              "text-halo-width": 1.5,
            },
            maxzoom: 6,
          },

          // Place labels - regions/states
          {
            id: "place-region",
            type: "symbol",
            source: "basemap",
            "source-layer": "places",
            filter: ["==", "kind", "region"],
            layout: {
              "text-field": "{name}",
              "text-font": ["Helvetica"],
              "text-size": ["interpolate", ["linear"], ["zoom"], 4, 10, 8, 14],
              "text-transform": "uppercase",
              "text-letter-spacing": 0.05,
            },
            paint: {
              "text-color": "rgba(255, 255, 255, 0.7)",
              "text-halo-color": "rgba(0, 0, 0, 0.7)",
              "text-halo-width": 1,
            },
            minzoom: 4,
            maxzoom: 8,
          },

          // Place labels - cities
          {
            id: "place-city",
            type: "symbol",
            source: "basemap",
            "source-layer": "places",
            filter: [
              "all",
              ["==", "kind", "locality"],
              [">=", "population_rank", 8],
            ],
            layout: {
              "text-field": "{name}",
              "text-font": ["Helvetica Bold"],
              "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5,
                10,
                10,
                16,
                14,
                20,
              ],
            },
            paint: {
              "text-color": "rgba(255, 255, 255, 0.95)",
              "text-halo-color": "rgba(0, 0, 0, 0.85)",
              "text-halo-width": 1.5,
            },
            minzoom: 5,
          },

          // Place labels - towns
          {
            id: "place-town",
            type: "symbol",
            source: "basemap",
            "source-layer": "places",
            filter: [
              "all",
              ["==", "kind", "locality"],
              ["<", "population_rank", 8],
              [">=", "population_rank", 5],
            ],
            layout: {
              "text-field": "{name}",
              "text-font": ["Helvetica"],
              "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8,
                10,
                12,
                14,
              ],
            },
            paint: {
              "text-color": "rgba(255, 255, 255, 0.85)",
              "text-halo-color": "rgba(0, 0, 0, 0.75)",
              "text-halo-width": 1,
            },
            minzoom: 8,
          },

          // Neighborhoods at high zoom
          {
            id: "place-neighborhood",
            type: "symbol",
            source: "basemap",
            "source-layer": "places",
            filter: ["==", "kind", "neighbourhood"],
            layout: {
              "text-field": "{name}",
              "text-font": ["Helvetica"],
              "text-size": 11,
              "text-transform": "uppercase",
              "text-letter-spacing": 0.05,
            },
            paint: {
              "text-color": "rgba(255, 255, 255, 0.6)",
              "text-halo-color": "rgba(0, 0, 0, 0.6)",
              "text-halo-width": 1,
            },
            minzoom: 13,
          },
        ],
      },
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      minZoom: MAP_BOUNDS.minZoom,
      maxZoom: MAP_BOUNDS.maxZoom,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    });

    // Disable rotation
    mapInstance.touchZoomRotate.disableRotation();

    // Add navigation controls (no attribution - we use custom)
    mapInstance.addControl(
      new NavigationControl({ showCompass: false }),
      "top-right"
    );

    // Load RENABAP GeoJSON after map loads
    mapInstance.on("load", () => {
      // Add RENABAP source
      mapInstance.addSource("renabap", {
        type: "geojson",
        data: SOURCES.renabap.data,
      });

      // Add RENABAP outline layer (dashed, no fill)
      mapInstance.addLayer(
        {
          id: LAYERS.renabap.outline,
          type: "line",
          source: "renabap",
          paint: {
            "line-color": COLORS.renabap.outline,
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              4,
              1,
              10,
              2,
              14,
              2.5,
            ],
            "line-opacity": 0.9,
            "line-dasharray": [3, 2],
          },
        },
        LAYERS.buildings.fill // Insert below buildings
      );

      // Add highlight layer for tutorial (Barrio Sin Nombre)
      mapInstance.addLayer(
        {
          id: LAYERS.renabap.highlight,
          type: "line",
          source: "renabap",
          filter: ["==", ["get", "id_renabap"], BARRIO_SIN_NOMBRE_ID],
          paint: {
            "line-color": "#fbbf24", // amber-400
            "line-width": 4,
            "line-opacity": 0,
          },
        }
      );

      setMapLoading(false);
    });

    mapInstance.on("idle", () => {
      setMapLoading(false);
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
      removeProtocol("pmtiles");
      setMap(null);
    };
  }, [setMap, setMapLoading]);

  // Toggle satellite visibility
  useEffect(() => {
    if (!map || !map.getStyle()) return;
    if (map.getLayer(LAYERS.satellite)) {
      map.setLayoutProperty(
        LAYERS.satellite,
        "visibility",
        showSatellite ? "visible" : "none"
      );
    }
  }, [map, showSatellite]);

  // Toggle RENABAP settlements visibility
  useEffect(() => {
    if (!map || !map.getStyle()) return;
    if (map.getLayer(LAYERS.renabap.outline)) {
      map.setLayoutProperty(
        LAYERS.renabap.outline,
        "visibility",
        showSettlements ? "visible" : "none"
      );
    }
  }, [map, showSettlements]);

  // Tutorial step 3: Highlight Barrio Sin Nombre
  useEffect(() => {
    if (!map || !map.getStyle()) return;
    if (!map.getLayer(LAYERS.renabap.highlight)) return;

    // Show highlight on step 3 (Barrio Sin Nombre)
    const highlightOpacity = tutorialActive && tutorialStep === 2 ? 1 : 0;
    map.setPaintProperty(
      LAYERS.renabap.highlight,
      "line-opacity",
      highlightOpacity
    );
  }, [map, tutorialActive, tutorialStep]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="w-full h-full" />

      {/* Tutorial dimming overlay - only on step 0 (the hook) */}
      {tutorialActive && tutorialStep === 0 && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none transition-opacity duration-500"
          style={{ zIndex: 40 }}
        />
      )}

      {/* Layer management components */}
      <ArgentinaMask />
      <BuildingsLayer />
      {/* Map controls overlay */}
      <MapControls />
    </div>
  );
}
