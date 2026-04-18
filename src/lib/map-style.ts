import {
  SOURCES,
  LAYERS,
  COLORS,
} from "@/lib/config";
import type { StyleSpecification } from "maplibre-gl";

/**
 * Map style definition extracted for better code splitting and caching.
 * This ~15KB object is now tree-shakeable and not recreated on every render.
 */
export const MAP_STYLE: StyleSpecification = {
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
};
