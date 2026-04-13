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

  // RENABAP informal settlements (GeoJSON - will be converted to PMTiles later)
  renabap: {
    type: "geojson" as const,
    data: "/data/renabap.geojson",
    attribution:
      '<a href="https://www.argentina.gob.ar/habitat/renabap">RENABAP</a> &copy; Gobierno de Argentina',
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
  renabap: {
    outline: "renabap-outline",
    highlight: "renabap-highlight",
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

// Styling - CarbonPlan-inspired palette
export const COLORS = {
  buildings: {
    fill: "rgba(255, 255, 255, 0.25)", // White, subtle
    outline: "rgba(255, 255, 255, 0.4)",
  },
  renabap: {
    fill: "rgba(234, 151, 85, 0.2)", // CarbonPlan orange #ea9755
    outline: "rgba(234, 151, 85, 0.9)",
    highlight: "rgba(234, 151, 85, 0.6)",
  },
};

// Barrio Sin Nombre ID for tutorial highlighting
export const BARRIO_SIN_NOMBRE_ID = 46;
