// Data sources
export const SOURCES = {
  // ESRI World Imagery satellite basemap
  satellite: {
    type: "raster" as const,
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    attribution:
      '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
    maxzoom: 19,
  },

  // Protomaps basemap for labels/boundaries (PMTiles via CarbonPlan)
  basemap: {
    type: "vector" as const,
    url: "pmtiles://https://carbonplan-maps.s3.us-west-2.amazonaws.com/basemaps/pmtiles/global.pmtiles",
    attribution:
      '<a href="https://protomaps.com">Protomaps</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
  },

  // Argentina building footprints from Source Cooperative
  buildings: {
    type: "vector" as const,
    url: "pmtiles://https://data.source.coop/vida/google-microsoft-osm-open-buildings/pmtiles/by_country/country_iso=ARG/ARG.pmtiles",
    attribution:
      '<a href="https://source.coop/vida/google-microsoft-osm-open-buildings">Google-Microsoft-OSM Open Buildings</a>',
  },
};

// Layer IDs for reference
export const LAYERS = {
  satellite: "satellite-layer",
  buildings: {
    sourceLayer: "ARG", // From PMTiles metadata vector_layers[0].id
    fill: "buildings-fill",
    outline: "buildings-outline",
  },
  // We'll add settlement layers when you provide the PMTiles
  settlements: {
    sourceLayer: "settlements",
    fill: "settlements-fill",
    outline: "settlements-outline",
  },
};

// Map constraints for Argentina
export const MAP_BOUNDS = {
  // Argentina bounding box with buffer
  sw: [-75, -56] as [number, number],
  ne: [-53, -21] as [number, number],
  minZoom: 3,
  maxZoom: 19,
};

// Initial view - frame all of Argentina with mask effect visible
export const INITIAL_VIEW = {
  center: [-65.0, -40.0] as [number, number],
  zoom: 4,
};

// Styling
export const COLORS = {
  buildings: {
    fill: "rgba(255, 200, 100, 0.6)",
    outline: "rgba(200, 150, 50, 0.9)",
  },
  settlements: {
    fill: "rgba(255, 100, 100, 0.3)",
    outline: "rgba(200, 50, 50, 0.9)",
  },
};
