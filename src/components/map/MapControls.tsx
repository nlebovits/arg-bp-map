"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMapStore, TUTORIAL_LOCATIONS } from "@/lib/store";
import { SearchInput } from "@/components/sidebar/SearchInput";

// Globe icon for "reset to full view"
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.6 9h16.8M3.6 15h16.8M12 3c-2.4 2.4-3.6 5.4-3.6 9s1.2 6.6 3.6 9c2.4-2.4 3.6-5.4 3.6-9s-1.2-6.6-3.6-9z"
      />
    </svg>
  );
}

// Location crosshair icon for "find my location"
function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2v4m0 12v4M2 12h4m12 0h4"
      />
    </svg>
  );
}

// Info icon for attribution toggle
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// Eye icon for visible state
function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

// Eye-off icon for hidden state
function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

export default function MapControls() {
  const [layersExpanded, setLayersExpanded] = useState(false);
  const [attributionExpanded, setAttributionExpanded] = useState(true);
  const [locating, setLocating] = useState(false);
  const t = useTranslations("map");
  const tSidebar = useTranslations("sidebar");

  const showSatellite = useMapStore((s) => s.showSatellite);
  const setShowSatellite = useMapStore((s) => s.setShowSatellite);
  const showBuildings = useMapStore((s) => s.showBuildings);
  const setShowBuildings = useMapStore((s) => s.setShowBuildings);
  const showSettlements = useMapStore((s) => s.showSettlements);
  const setShowSettlements = useMapStore((s) => s.setShowSettlements);
  const tutorialActive = useMapStore((s) => s.tutorialActive);
  const flyTo = useMapStore((s) => s.flyTo);

  const handleResetView = () => {
    const { lng, lat, zoom } = TUTORIAL_LOCATIONS.argentina;
    flyTo(lng, lat, zoom);
  };

  const handleFindMyLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        flyTo(position.coords.longitude, position.coords.latitude, 14);
        setLocating(false);
      },
      () => {
        setLocating(false);
        // Silently fail - the button will just stop spinning
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <>
      {/* Top left: Search bar - hidden during tutorial */}
      {!tutorialActive && (
        <div className="absolute top-4 left-4 z-20 w-72">
          <SearchInput placeholder={tSidebar("search.placeholder")} />
        </div>
      )}

      {/* Bottom left: MAP LAYERS button + Reset + Location - hidden during tutorial */}
      {!tutorialActive && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
          {/* Reset view button */}
          <button
            onClick={handleResetView}
            className="p-2 bg-surface-raised/90 backdrop-blur-sm border border-muted hover:border-secondary text-secondary hover:text-foreground transition-all rounded-sm"
            title={t("resetView")}
          >
            <GlobeIcon className="w-4 h-4" />
          </button>

          {/* Find my location button */}
          <button
            onClick={handleFindMyLocation}
            disabled={locating}
            className="p-2 bg-surface-raised/90 backdrop-blur-sm border border-muted hover:border-secondary text-secondary hover:text-foreground transition-all rounded-sm disabled:opacity-50"
            title={locating ? t("locating") : t("findMyLocation")}
          >
            <LocationIcon className={`w-4 h-4 ${locating ? "animate-pulse" : ""}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setLayersExpanded(!layersExpanded)}
              className="font-mono text-[11px] tracking-wider uppercase px-4 py-2 bg-surface-raised/90 backdrop-blur-sm border border-muted hover:border-secondary text-foreground/80 hover:text-foreground transition-all rounded-sm flex items-center gap-2"
            >
              {t("layers")}
              <span
                className={`transition-transform ${layersExpanded ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>

            {/* Expanded layers panel */}
            {layersExpanded && (
              <div className="absolute bottom-full mb-2 left-0 bg-surface-raised/95 backdrop-blur-sm border border-muted rounded-sm p-3 min-w-[200px]">
                <div className="space-y-2">
                  {/* Satellite toggle */}
                  <button
                    onClick={() => setShowSatellite(!showSatellite)}
                    className="flex items-center gap-3 w-full group"
                  >
                    {showSatellite ? (
                      <EyeIcon className="w-4 h-4 text-accent" />
                    ) : (
                      <EyeOffIcon className="w-4 h-4 text-secondary group-hover:text-foreground/80 transition-colors" />
                    )}
                    <span className="font-mono text-[11px] text-secondary group-hover:text-foreground transition-colors uppercase tracking-wide">
                      {t("satellite")}
                    </span>
                  </button>

                  {/* Buildings toggle */}
                  <button
                    onClick={() => setShowBuildings(!showBuildings)}
                    className="flex items-center gap-3 w-full group"
                  >
                    {showBuildings ? (
                      <EyeIcon className="w-4 h-4 text-accent" />
                    ) : (
                      <EyeOffIcon className="w-4 h-4 text-secondary group-hover:text-foreground/80 transition-colors" />
                    )}
                    <span className="font-mono text-[11px] text-secondary group-hover:text-foreground transition-colors uppercase tracking-wide">
                      {t("buildings")}
                    </span>
                  </button>

                  {/* Settlements (RENABAP) toggle */}
                  <button
                    onClick={() => setShowSettlements(!showSettlements)}
                    className="flex items-center gap-3 w-full group"
                  >
                    {showSettlements ? (
                      <EyeIcon className="w-4 h-4 text-cp-red" />
                    ) : (
                      <EyeOffIcon className="w-4 h-4 text-secondary group-hover:text-foreground/80 transition-colors" />
                    )}
                    <span className="font-mono text-[11px] text-secondary group-hover:text-foreground transition-colors uppercase tracking-wide">
                      {t("settlements")}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom right: Attribution with toggle */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        {attributionExpanded && (
          <div className="font-mono text-[9px] text-secondary tracking-wide bg-surface-raised/70 px-2 py-1 rounded-sm">
            <a
              href="https://source.coop/vida/google-microsoft-osm-open-buildings"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-hover transition-colors"
            >
              SOURCE.COOP
            </a>
            {" "}
            <span className="text-secondary/50">|</span>
            {" "}
            <a
              href="https://www.argentina.gob.ar/habitat/renabap"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground/80 transition-colors"
            >
              RENABAP
            </a>
            {" "}
            <span className="text-secondary/50">|</span>
            {" "}
            <a
              href="https://protomaps.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground/80 transition-colors"
            >
              PROTOMAPS
            </a>
            {" "}
            <span className="text-secondary/50">&copy;</span>
            {" "}
            <a
              href="https://openstreetmap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground/80 transition-colors"
            >
              OSM
            </a>
          </div>
        )}
        <button
          onClick={() => setAttributionExpanded(!attributionExpanded)}
          className="p-2 bg-surface-raised/90 backdrop-blur-sm border border-muted hover:border-secondary text-secondary hover:text-foreground transition-all rounded-sm"
          title={attributionExpanded ? t("hideAttribution") : t("showAttribution")}
        >
          <InfoIcon className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
