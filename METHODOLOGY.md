# Data Processing Methodology

Technical documentation for generating settlement analysis data.

## Data Sources

| Dataset | Source | Format |
|---------|--------|--------|
| RENABAP settlements | [argentina.gob.ar/habitat/renabap](https://www.argentina.gob.ar/habitat/renabap) | GeoJSON polygons |
| Building footprints | [source.coop/vida/google-microsoft-osm-open-buildings](https://source.coop/vida/google-microsoft-osm-open-buildings) | PMTiles (ARG.pmtiles) |

## Analysis Pipeline

### 1. Spatial Join (DuckDB)

Join building footprints to settlement boundaries:

```sql
INSTALL spatial; LOAD spatial;

-- Count buildings per settlement
CREATE TABLE settlement_buildings AS
SELECT 
  s.id_renabap,
  s.nombre_barrio,
  s.provincia,
  s.departamento,
  s.renabap_families,
  COUNT(b.*) AS building_count,
  ST_AsGeoJSON(s.geometry) AS geometry
FROM settlements s
LEFT JOIN buildings b 
  ON ST_Intersects(s.geometry, b.geometry)
GROUP BY s.id_renabap, s.nombre_barrio, s.provincia, 
         s.departamento, s.renabap_families, s.geometry;
```

### 2. Density Stratification

3-tier model accounts for vertical density differences:

| Tier | Condition | Multiplier | Rationale |
|------|-----------|------------|-----------|
| CABA | `provincia = 'Ciudad Autónoma de Buenos Aires'` | 2.7× | Multi-story villas with vertical densification |
| Urban | `departamento` contains major city | 1.2× | Moderate vertical density in urban cores |
| Other | Default | 1.0× | Single-family structures predominate |

Urban tier includes departments containing: Buenos Aires, Córdoba, Rosario, Mendoza, Tucumán, La Plata, Mar del Plata, Salta, Santa Fe.

**Model validation:** R² improved from 0.7765 (2-tier) to 0.7968 (3-tier).

### 3. Estimate Calculation

```sql
-- Apply density multipliers
ALTER TABLE settlement_buildings ADD COLUMN density_tier VARCHAR;
ALTER TABLE settlement_buildings ADD COLUMN families_per_building FLOAT;

UPDATE settlement_buildings SET 
  density_tier = CASE 
    WHEN provincia = 'Ciudad Autónoma de Buenos Aires' THEN 'CABA'
    WHEN departamento ILIKE '%Buenos Aires%' 
      OR departamento ILIKE '%Córdoba%'
      -- ... other urban centers
    THEN 'Urban'
    ELSE 'Other'
  END,
  families_per_building = CASE density_tier
    WHEN 'CABA' THEN 2.7
    WHEN 'Urban' THEN 1.2
    ELSE 1.0
  END;

-- Calculate estimates
ALTER TABLE settlement_buildings ADD COLUMN estimated_min_families INT;
ALTER TABLE settlement_buildings ADD COLUMN estimated_min_population INT;
ALTER TABLE settlement_buildings ADD COLUMN difference INT;

UPDATE settlement_buildings SET
  estimated_min_families = CAST(building_count * families_per_building AS INT),
  estimated_min_population = CAST(building_count * families_per_building * 3.3 AS INT),
  difference = CAST(building_count * families_per_building AS INT) - renabap_families;
```

Population multiplier: **3.3 persons/family** (from barrios populares household studies).

### 4. Export to GeoJSON

```sql
COPY (
  SELECT 
    id_renabap,
    nombre_barrio,
    provincia,
    departamento,
    density_tier,
    renabap_families,
    building_count,
    estimated_min_families,
    estimated_min_population,
    difference,
    geometry
  FROM settlement_buildings
) TO 'bp-w-buildings.geojson' 
WITH (FORMAT GDAL, DRIVER 'GeoJSON');
```

Output: `bp-w-buildings.geojson` (6.8 MB, 6,467 features)

## PMTiles Generation

### Tippecanoe Command

```bash
tippecanoe \
  -o bp-w-buildings.pmtiles \
  --layer=settlements \
  --minimum-zoom=0 \
  --maximum-zoom=16 \
  --drop-densest-as-needed \
  --extend-zooms-if-still-dropping \
  --cluster-distance=50 \
  --cluster-maxzoom=9 \
  --generate-ids \
  bp-w-buildings.geojson
```

**Key flags:**
- `--cluster-maxzoom=9`: Points cluster at z0-9, individual polygons z10+
- `--drop-densest-as-needed`: Prevents tile size explosion
- `--extend-zooms-if-still-dropping`: Ensures all features visible at max zoom

Output: `bp-w-buildings.pmtiles` (14 MB)

### Deployment

```bash
cp bp-w-buildings.pmtiles public/data/
```

Served via Next.js static files at `/data/bp-w-buildings.pmtiles`.

## Layer Configuration

MapLibre layers reference the PMTiles:

| Layer | Type | Zoom Range | Styling |
|-------|------|------------|---------|
| `settlements-fill` | circle | z0-9 | Population-based radius, discrepancy color |
| `settlements-outline` | fill | z10+ | Polygon fill with discrepancy color |
| `settlements-polygon-outline` | line | z10+ | Orange stroke |

### Discrepancy Color Expression

```javascript
// Grey (match) → Orange (undercount)
// Based on log of discrepancy ratio
["interpolate", ["linear"],
  ["ln", ["max", 1, ["+", 1, ["/",
    ["max", 0, ["-", ["get", "estimated_min_families"], ["get", "renabap_families"]]],
    ["max", 1, ["get", "renabap_families"]]
  ]]]],
  0, "#808080",    // ln(1) = 0 → grey (perfect match)
  1.5, "#ea9755"   // ln(~4.5) → orange (severe undercount)
]
```

### Population-Based Radius

```javascript
// Min 3px (always visible), max 25px (doesn't overwhelm)
["interpolate", ["linear"], ["zoom"],
  0, ["max", 3, ["min", 12, /* ln-based size */]],
  6, ["max", 4, ["min", 18, /* ... */]],
  10, ["max", 5, ["min", 25, /* ... */]]
]
```

## Summary Statistics

| Metric | Value |
|--------|-------|
| Settlements analyzed | 6,467 |
| Total RENABAP families | 1.24M |
| Total buildings detected | 1.89M |
| Estimated min families | 2.07M |
| Estimated min population | 6.8M |
| National discrepancy | +67% |
