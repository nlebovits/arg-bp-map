"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMapStore } from "@/lib/store";
import { SearchInput } from "@/components/sidebar/SearchInput";

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
  const t = useTranslations("map");
  const tSidebar = useTranslations("sidebar");

  const showSatellite = useMapStore((s) => s.showSatellite);
  const setShowSatellite = useMapStore((s) => s.setShowSatellite);
  const showBuildings = useMapStore((s) => s.showBuildings);
  const setShowBuildings = useMapStore((s) => s.setShowBuildings);

  return (
    <>
      {/* Top left: Search bar */}
      <div className="absolute top-4 left-4 z-20 w-72">
        <SearchInput placeholder={tSidebar("search.placeholder")} />
      </div>

      {/* Bottom left: MAP LAYERS button */}
      <div className="absolute bottom-6 left-6 z-20">
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
            <div className="absolute bottom-full mb-2 left-0 bg-neutral-900/95 backdrop-blur-sm border border-neutral-700 rounded-sm p-3 min-w-[180px]">
              <div className="space-y-2">
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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom right: Attribution */}
      <div className="absolute bottom-2 right-2 z-10">
        <div className="font-mono text-[9px] text-neutral-500 tracking-wide">
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
            OPENSTREETMAP
          </a>
          {" "}
          <span className="text-neutral-600">|</span>
          {" "}
          <a
            href="https://www.esri.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            ESRI
          </a>
          {" "}
          <span className="text-neutral-600">&copy;</span>
        </div>
      </div>
    </>
  );
}
