"use client";

import { useState, useEffect } from "react";
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

// Fullscreen icons
function ExpandIcon({ className }: { className?: string }) {
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
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
      />
    </svg>
  );
}

function ShrinkIcon({ className }: { className?: string }) {
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
        d="M9 9L4 4m0 0v4m0-4h4m6 6l5 5m0 0v-4m0 4h-4M9 15l-5 5m0 0v-4m0 4h4m6-6l5-5m0 0v4m0-4h-4"
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
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Sync fullscreen state when user presses Escape
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <>
      {/* Top left: Search bar - hidden during tutorial */}
      {!tutorialActive && (
        <div className="absolute top-4 left-4 z-20 w-72">
          <SearchInput placeholder={tSidebar("search.placeholder")} />
        </div>
      )}

      {/* Bottom left: MAP LAYERS button + Reset + Fullscreen - hidden during tutorial */}
      {!tutorialActive && (
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
          {/* Reset view button */}
          <button
            onClick={handleResetView}
            className="p-2 bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-neutral-100 transition-all rounded-sm"
            title="Reset to Argentina"
          >
            <GlobeIcon className="w-4 h-4" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-neutral-100 transition-all rounded-sm"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <ShrinkIcon className="w-4 h-4" />
            ) : (
              <ExpandIcon className="w-4 h-4" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setLayersExpanded(!layersExpanded)}
              className="font-mono text-[11px] tracking-wider uppercase px-4 py-2 bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-neutral-100 transition-all rounded-sm flex items-center gap-2"
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
              <div className="absolute bottom-full mb-2 left-0 bg-neutral-900/95 backdrop-blur-sm border border-neutral-700 rounded-sm p-3 min-w-[200px]">
                <div className="space-y-2">
                  {/* Satellite toggle */}
                  <button
                    onClick={() => setShowSatellite(!showSatellite)}
                    className="flex items-center gap-3 w-full group"
                  >
                    {showSatellite ? (
                      <EyeIcon className="w-4 h-4 text-amber-500" />
                    ) : (
                      <EyeOffIcon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-400 transition-colors" />
                    )}
                    <span className="font-mono text-[11px] text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-wide">
                      {t("satellite")}
                    </span>
                  </button>

                  {/* Buildings toggle */}
                  <button
                    onClick={() => setShowBuildings(!showBuildings)}
                    className="flex items-center gap-3 w-full group"
                  >
                    {showBuildings ? (
                      <EyeIcon className="w-4 h-4 text-amber-500" />
                    ) : (
                      <EyeOffIcon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-400 transition-colors" />
                    )}
                    <span className="font-mono text-[11px] text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-wide">
                      {t("buildings")}
                    </span>
                  </button>

                  {/* Settlements (RENABAP) toggle */}
                  <button
                    onClick={() => setShowSettlements(!showSettlements)}
                    className="flex items-center gap-3 w-full group"
                  >
                    {showSettlements ? (
                      <EyeIcon className="w-4 h-4 text-red-500" />
                    ) : (
                      <EyeOffIcon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-400 transition-colors" />
                    )}
                    <span className="font-mono text-[11px] text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-wide">
                      {t("settlements")}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom right: Attribution */}
      <div className="absolute bottom-2 right-2 z-10">
        <div className="font-mono text-[9px] text-neutral-500 tracking-wide">
          <a
            href="https://source.coop/vida/google-microsoft-osm-open-buildings"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors"
          >
            SOURCE.COOP
          </a>
          {" "}
          <span className="text-neutral-600">|</span>
          {" "}
          <a
            href="https://www.argentina.gob.ar/habitat/renabap"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            RENABAP
          </a>
          {" "}
          <span className="text-neutral-600">|</span>
          {" "}
          <a
            href="https://protomaps.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            PROTOMAPS
          </a>
          {" "}
          <span className="text-neutral-600">&copy;</span>
          {" "}
          <a
            href="https://openstreetmap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            OSM
          </a>
        </div>
      </div>
    </>
  );
}
