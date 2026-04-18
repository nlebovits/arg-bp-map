"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import Sidebar from "@/components/sidebar/Sidebar";
import { useMapStore, hydrateStore } from "@/lib/store";

// Dynamic imports for heavy components
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-surface-raised">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const TutorialModal = dynamic(
  () => import("@/components/tutorial/TutorialModal").then((m) => m.TutorialModal),
  { ssr: false }
);

export default function Home() {
  // Hydrate store from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    hydrateStore();
  }, []);

  const mapLoading = useMapStore((s) => s.mapLoading);
  const showTutorial = useMapStore((s) => s.showTutorial);
  const t = useTranslations("common");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {showTutorial && <TutorialModal />}
      <Sidebar />

      <main className="relative flex-1 h-full">
        <Map />

        {/* Loading indicator */}
        {mapLoading && (
          <div className="absolute top-4 right-4 z-10 bg-surface-raised/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-foreground/80 font-mono">{t("loading")}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
