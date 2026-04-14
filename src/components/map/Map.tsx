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
import SettlementsLayer from "./layers/SettlementsLayer";
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
          settlements: SOURCES.settlements,
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

    // Add settlement layers after map loads
    mapInstance.on("load", () => {
      // Color expression: grey (match) -> orange (undercount)
      // Based on log of discrepancy ratio: ln(1 + (est - renabap) / renabap)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const discrepancyColor: any = [
        "interpolate",
        ["linear"],
        // Log of (1 + discrepancy ratio), clamped to avoid division by zero
        ["ln", ["max", 1, ["+", 1, ["/",
          ["max", 0, ["-", ["get", "estimated_min_families"], ["get", "renabap_families"]]],
          ["max", 1, ["get", "renabap_families"]]
        ]]]],
        0, COLORS.settlements.match,      // ln(1) = 0 -> grey (perfect match)
        0.4, "#909090",                   // slight undercount
        0.7, "#a08060",                   // moderate
        1.0, "#c08050",                   // significant
        1.5, COLORS.settlements.undercount // ln(~4.5) -> orange (severe undercount)
      ];

      // Population-based radius with min/max bounds
      // min: 3px (always visible), max: 25px (doesn't overwhelm)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const populationRadius: any = [
        "interpolate",
        ["linear"],
        ["zoom"],
        // z0-4: tight range, all visible
        0, ["max", 3, ["min", 12,
          ["interpolate", ["linear"],
            ["ln", ["max", 1, ["get", "estimated_min_population"]]],
            5, 3,     // ln(~150) -> min
            8, 6,     // ln(~3000) -> small
            10, 9,    // ln(~22000) -> medium
            12, 12    // ln(~160000) -> max at this zoom
          ]
        ]],
        // z5-8: expand range
        6, ["max", 4, ["min", 18,
          ["interpolate", ["linear"],
            ["ln", ["max", 1, ["get", "estimated_min_population"]]],
            5, 4,
            8, 8,
            10, 12,
            12, 18
          ]
        ]],
        // z9-12: full range before switching to polygons
        10, ["max", 5, ["min", 25,
          ["interpolate", ["linear"],
            ["ln", ["max", 1, ["get", "estimated_min_population"]]],
            5, 5,
            8, 10,
            10, 16,
            12, 25
          ]
        ]]
      ];

      // Circle layer for points (z0-9) - sized by population, colored by discrepancy
      mapInstance.addLayer(
        {
          id: LAYERS.settlements.fill,
          type: "circle",
          source: "settlements",
          "source-layer": LAYERS.settlements.sourceLayer,
          maxzoom: 10,
          paint: {
            "circle-color": discrepancyColor,
            "circle-radius": populationRadius,
            "circle-opacity": 0.85,
            "circle-stroke-color": COLORS.settlements.outline,
            "circle-stroke-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 0.5,
              8, 1,
              12, 1.5
            ],
          },
        },
        LAYERS.buildings.fill
      );

      // Fill layer for polygons (z10+) - light wash, labels carry data now
      mapInstance.addLayer(
        {
          id: LAYERS.settlements.outline,
          type: "fill",
          source: "settlements",
          "source-layer": LAYERS.settlements.sourceLayer,
          minzoom: 10,
          paint: {
            "fill-color": discrepancyColor,
            "fill-opacity": 0.25,
          },
        },
        LAYERS.buildings.fill
      );

      // Polygon outline (z10+)
      mapInstance.addLayer(
        {
          id: "settlements-polygon-outline",
          type: "line",
          source: "settlements",
          "source-layer": LAYERS.settlements.sourceLayer,
          minzoom: 10,
          paint: {
            "line-color": COLORS.settlements.outline,
            "line-width": 2,
            "line-opacity": 0.9,
          },
        },
        LAYERS.buildings.fill
      );

      // Discrepancy labels at polygon zoom (z10+)
      // Text size scales with discrepancy magnitude (log scale)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const discrepancyTextSize: any = [
        "interpolate",
        ["linear"],
        // Log of absolute difference, clamped
        ["ln", ["max", 1, ["get", "difference"]]],
        0, 10,      // ln(1) = 0 -> minimum readable
        4, 12,      // ln(~55) -> small
        6, 16,      // ln(~400) -> medium
        8, 22,      // ln(~3000) -> large
        10, 28      // ln(~22000) -> maximum
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const labelTextField: any = [
        "case",
        [">=", ["get", "difference"], 0],
        ["concat", "+", ["number-format", ["get", "difference"], { "locale": "es-AR" }]],
        ["number-format", ["get", "difference"], { "locale": "es-AR" }]
      ];

      // Drop shadow layer (rendered first, underneath main labels)
      mapInstance.addLayer({
        id: "settlements-labels-shadow",
        type: "symbol",
        source: "settlements",
        "source-layer": LAYERS.settlements.sourceLayer,
        minzoom: 10,
        maxzoom: 16,
        layout: {
          "text-field": labelTextField,
          "text-font": ["Helvetica Bold"],
          "text-size": discrepancyTextSize,
          "text-anchor": "center",
          "text-allow-overlap": true,       // shadow follows main label
          "text-ignore-placement": true,    // doesn't affect collision
          "symbol-sort-key": ["-", ["get", "difference"]],
          "symbol-avoid-edges": true,
        },
        paint: {
          "text-color": "rgba(0, 0, 0, 0.5)",
          "text-halo-color": "rgba(0, 0, 0, 0.3)",
          "text-halo-width": 2,
          "text-halo-blur": 3,
          "text-translate": [2, 3],         // offset down-right
        },
      });

      // Main labels (on top of shadow)
      mapInstance.addLayer({
        id: "settlements-labels",
        type: "symbol",
        source: "settlements",
        "source-layer": LAYERS.settlements.sourceLayer,
        minzoom: 10,
        maxzoom: 16,
        layout: {
          "text-field": labelTextField,
          "text-font": ["Helvetica Bold"],
          "text-size": discrepancyTextSize,
          "text-anchor": "center",
          "text-allow-overlap": false,
          "text-ignore-placement": false,
          "symbol-sort-key": ["-", ["get", "difference"]], // larger discrepancies on top
          "symbol-avoid-edges": true,
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": discrepancyColor,
          "text-halo-width": 3,
          "text-halo-blur": 0,
        },
      });

      // Add highlight layer for tutorial (Barrio Sin Nombre)
      mapInstance.addLayer({
        id: LAYERS.settlements.highlight,
        type: "line",
        source: "settlements",
        "source-layer": LAYERS.settlements.sourceLayer,
        filter: ["==", ["get", "id_renabap"], BARRIO_SIN_NOMBRE_ID],
        paint: {
          "line-color": COLORS.settlements.highlight,
          "line-width": 4,
          "line-opacity": 0,
        },
      });

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

  // Toggle settlements visibility
  useEffect(() => {
    if (!map || !map.getStyle()) return;
    const visibility = showSettlements ? "visible" : "none";

    if (map.getLayer(LAYERS.settlements.fill)) {
      map.setLayoutProperty(LAYERS.settlements.fill, "visibility", visibility);
    }
    if (map.getLayer(LAYERS.settlements.outline)) {
      map.setLayoutProperty(LAYERS.settlements.outline, "visibility", visibility);
    }
    if (map.getLayer("settlements-polygon-outline")) {
      map.setLayoutProperty("settlements-polygon-outline", "visibility", visibility);
    }
    if (map.getLayer("settlements-labels-shadow")) {
      map.setLayoutProperty("settlements-labels-shadow", "visibility", visibility);
    }
    if (map.getLayer("settlements-labels")) {
      map.setLayoutProperty("settlements-labels", "visibility", visibility);
    }
  }, [map, showSettlements]);

  // Tutorial step 3: Highlight Barrio Sin Nombre
  useEffect(() => {
    if (!map || !map.getStyle()) return;
    if (!map.getLayer(LAYERS.settlements.highlight)) return;

    // Show highlight on step 3 (Barrio Sin Nombre)
    const highlightOpacity = tutorialActive && tutorialStep === 2 ? 1 : 0;
    map.setPaintProperty(
      LAYERS.settlements.highlight,
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
      <SettlementsLayer />
      {/* Map controls overlay */}
      <MapControls />
    </div>
  );
}
