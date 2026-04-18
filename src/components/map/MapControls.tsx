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
      {/* Top left: Search bar - hidden during tutorial */}
      {!tutorialActive && (
        <div className="absolute top-4 left-4 z-20 w-72">
          <SearchInput placeholder={tSidebar("search.placeholder")} />
        </div>
      )}

      {/* Top right: Reset + Location buttons (below zoom controls) - hidden during tutorial */}
      {!tutorialActive && (
        <div className="absolute top-[90px] right-[10px] z-20 flex flex-col bg-surface-raised border border-border rounded-lg overflow-hidden">
          {/* Reset view button */}
          <button
            onClick={handleResetView}
            className="w-[36px] h-[36px] flex items-center justify-center bg-surface-raised hover:bg-muted text-foreground transition-colors"
            title={t("resetView")}
          >
            <GlobeAltIcon className="w-5 h-5" />
          </button>

          {/* Find my location button */}
          <button
            onClick={handleFindMyLocation}
            disabled={locating}
            className="w-[36px] h-[36px] flex items-center justify-center bg-surface-raised hover:bg-muted text-foreground transition-colors border-t border-border disabled:opacity-50"
            title={locating ? t("locating") : t("findMyLocation")}
          >
            <MapPinIcon className={`w-5 h-5 ${locating ? "animate-pulse" : ""}`} />
          </button>
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
          <InformationCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
