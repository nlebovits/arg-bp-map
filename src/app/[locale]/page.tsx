"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import Sidebar from "@/components/sidebar/Sidebar";
import { TutorialModal } from "@/components/tutorial/TutorialModal";
import { useMapStore, hydrateStore } from "@/lib/store";

// Dynamic import for Map to avoid SSR issues with MapLibre
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
        <div className="flex items-center gap-3 text-neutral-400">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono">Loading map...</span>
        </div>
      </div>
    );
  },
});

export default function Home() {
  // Hydrate store from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    hydrateStore();
  }, []);

  const mapLoading = useMapStore((s) => s.mapLoading);
  const showTutorial = useMapStore((s) => s.showTutorial);
  const t = useTranslations("common");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950">
      {showTutorial && <TutorialModal />}
      <Sidebar />

      <div className="relative flex-1 h-full">
        <Map />

        {/* Loading indicator */}
        {mapLoading && (
          <div className="absolute top-4 right-4 z-10 bg-neutral-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-neutral-300 font-mono">{t("loading")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
