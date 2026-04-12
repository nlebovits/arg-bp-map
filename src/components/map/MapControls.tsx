"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMapStore } from "@/lib/store";

export default function MapControls() {
  const [layersExpanded, setLayersExpanded] = useState(false);
  const t = useTranslations("map");

  const showSatellite = useMapStore((s) => s.showSatellite);
  const setShowSatellite = useMapStore((s) => s.setShowSatellite);
  const showBuildings = useMapStore((s) => s.showBuildings);
  const setShowBuildings = useMapStore((s) => s.setShowBuildings);

  return (
    <>
      {/* Bottom center: MAP LAYERS button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
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
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-neutral-900/95 backdrop-blur-sm border border-neutral-700 rounded-sm p-3 min-w-[180px]">
              <div className="space-y-2">
                <button
                  onClick={() => setShowSatellite(!showSatellite)}
                  className="flex items-center gap-3 w-full group"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                      showSatellite
                        ? "border-amber-500 bg-amber-500"
                        : "border-neutral-500 bg-transparent group-hover:border-neutral-400"
                    }`}
                  >
                    {showSatellite && (
                      <span className="w-1 h-1 rounded-full bg-neutral-950" />
                    )}
                  </span>
                  <span className="font-mono text-[11px] text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-wide">
                    {t("satellite")}
                  </span>
                </button>

                <button
                  onClick={() => setShowBuildings(!showBuildings)}
                  className="flex items-center gap-3 w-full group"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                      showBuildings
                        ? "border-amber-500 bg-amber-500"
                        : "border-neutral-500 bg-transparent group-hover:border-neutral-400"
                    }`}
                  >
                    {showBuildings && (
                      <span className="w-1 h-1 rounded-full bg-neutral-950" />
                    )}
                  </span>
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
