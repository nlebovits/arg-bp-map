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

  // Settlements with building analysis (PMTiles - points at low zoom, polygons at high zoom)
  settlements: {
    type: "vector" as const,
    url: "pmtiles:///data/bp-w-buildings.pmtiles",
    attribution:
      '<a href="https://www.argentina.gob.ar/habitat/renabap">RENABAP</a> + Building Analysis',
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
  settlements: {
    sourceLayer: "settlements", // From tippecanoe --layer=settlements
    fill: "settlements-fill",
    outline: "settlements-outline",
    highlight: "settlements-highlight",
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
// Zoom 3.5 gives padding around the country boundary
export const INITIAL_VIEW = {
  center: [-65.0, -40.0] as [number, number],
  zoom: 3.5,
};

// Styling - CarbonPlan-inspired palette
export const COLORS = {
  buildings: {
    fill: "rgba(255, 255, 255, 0.25)", // White, subtle
    outline: "rgba(255, 255, 255, 0.4)",
  },
  settlements: {
    // Grey (match) -> Orange (undercount) per legend
    match: "#808080",      // Grey - low discrepancy
    undercount: "#ea9755", // CarbonPlan orange - high discrepancy
    outline: "rgba(234, 151, 85, 0.9)", // Orange outline
    highlight: "#fbbf24",  // amber-400 for tutorial highlight
  },
};

// Barrio Sin Nombre ID for tutorial highlighting
export const BARRIO_SIN_NOMBRE_ID = 46;
