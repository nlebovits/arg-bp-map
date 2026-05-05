"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  GlobeAltIcon,
  MapPinIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useMapStore } from "@/lib/store";
import { INITIAL_VIEW } from "@/lib/config";
import { SearchInput } from "@/components/sidebar/SearchInput";

export default function MapControls() {
  const [attributionExpanded, setAttributionExpanded] = useState(true);
  const [locating, setLocating] = useState(false);
  const t = useTranslations("map");
  const tSidebar = useTranslations("sidebar");

  const tutorialActive = useMapStore((s) => s.tutorialActive);
  const flyTo = useMapStore((s) => s.flyTo);

  const handleResetView = () => {
    const [lng, lat] = INITIAL_VIEW.center;
    flyTo(lng, lat, INITIAL_VIEW.zoom);
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
      {/* Top left: Search bar - hidden during tutorial and on mobile (overlaps toggle) */}
      {!tutorialActive && (
        <div className="absolute top-4 left-4 z-20 w-72 hidden md:block">
          <SearchInput placeholder={tSidebar("search.placeholder")} />
        </div>
      )}

      {/* Top right: Reset + Location buttons - on mobile sits below the mobile header bar; on desktop below the zoom controls */}
      {!tutorialActive && (
        <div
          className="map-control-buttons absolute right-[10px] z-20 flex flex-col bg-surface-raised border border-border overflow-hidden"
        >
          {/* Reset view button - match zoom control size (44px) */}
          <button
            onClick={handleResetView}
            className="w-[44px] h-[44px] flex items-center justify-center bg-surface-raised hover:bg-muted text-foreground transition-colors"
            title={t("resetView")}
          >
            <GlobeAltIcon className="w-5 h-5" />
          </button>

          {/* Find my location button */}
          <button
            onClick={handleFindMyLocation}
            disabled={locating}
            className="w-[44px] h-[44px] flex items-center justify-center bg-surface-raised hover:bg-muted text-foreground transition-colors border-t border-border disabled:opacity-50"
            title={locating ? t("locating") : t("findMyLocation")}
          >
            <MapPinIcon className={`w-5 h-5 ${locating ? "animate-pulse" : ""}`} />
          </button>
        </div>
      )}

      {/* Bottom right: Attribution with toggle - min 44px touch target */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        {attributionExpanded && (
          <div className="font-mono text-[9px] text-secondary tracking-wide bg-surface-raised/70 px-2 py-1 rounded-sm hidden sm:block">
            <a
              href="https://source.coop/vida/google-microsoft-osm-open-buildings"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-hover transition-colors"
            >
              SOURCE.COOP
            </a>
            {" "}
            <span className="text-muted">|</span>
            {" "}
            <a
              href="https://www.argentina.gob.ar/habitat/renabap"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              RENABAP
            </a>
            {" "}
            <span className="text-muted">|</span>
            {" "}
            <a
              href="https://protomaps.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              PROTOMAPS
            </a>
            {" "}
            <span className="text-muted">&copy;</span>
            {" "}
            <a
              href="https://openstreetmap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              OSM
            </a>
          </div>
        )}
        <button
          onClick={() => setAttributionExpanded(!attributionExpanded)}
          className="w-11 h-11 flex items-center justify-center bg-surface-raised/90 backdrop-blur-sm border border-border hover:border-secondary text-secondary hover:text-foreground transition-all rounded-none"
          title={attributionExpanded ? t("hideAttribution") : t("showAttribution")}
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
