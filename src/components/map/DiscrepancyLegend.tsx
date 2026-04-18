"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  Squares2X2Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useMapStore } from "@/lib/store";

export default function DiscrepancyLegend() {
  const t = useTranslations("legend");
  const [discrepancyInfoExpanded, setDiscrepancyInfoExpanded] = useState(false);
  const [sizeInfoExpanded, setSizeInfoExpanded] = useState(false);
  const [legendExpanded, setLegendExpanded] = useState(true);

  const currentZoom = useMapStore((s) => s.currentZoom);
  const showSettlements = useMapStore((s) => s.showSettlements);
  const setShowSettlements = useMapStore((s) => s.setShowSettlements);
  const showBuildings = useMapStore((s) => s.showBuildings);
  const setShowBuildings = useMapStore((s) => s.setShowBuildings);

  // Start collapsed on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setLegendExpanded(false);
    }
  }, []);

  // Show dot size legend only at low zoom (when dots are visible, not polygons)
  const showDotSize = currentZoom <= 8;

  // Collapsed state - just show toggle button
  if (!legendExpanded) {
    return (
      <button
        onClick={() => setLegendExpanded(true)}
        className="absolute bottom-4 left-4 z-20 w-11 h-11 flex items-center justify-center bg-surface-raised/90 backdrop-blur-sm border border-muted rounded-lg text-secondary hover:text-foreground transition-colors"
        aria-label={t("showLegend")}
      >
        <Squares2X2Icon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-20 bg-surface-raised/90 backdrop-blur-sm border border-muted rounded-sm px-3 sm:px-4 py-3 w-56 sm:w-64 space-y-3">
      {/* Collapse button - mobile only */}
      <button
        onClick={() => setLegendExpanded(false)}
        className="md:hidden absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-muted rounded-full text-secondary hover:text-foreground transition-colors"
        aria-label={t("hideLegend")}
      >
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {/* SETTLEMENTS SECTION */}
      <div>
        {/* Header with visibility + info toggles - min 44px touch targets */}
        <div className="flex items-center justify-between gap-1 mb-3">
          <span className="font-mono text-xs text-secondary uppercase tracking-wider">
            {t("settlementsHeader")}
          </span>
          <div className="flex items-center -mr-2">
            <button
              onClick={() => setShowSettlements(!showSettlements)}
              className="w-11 h-11 flex items-center justify-center text-secondary hover:text-foreground transition-colors rounded hover:bg-muted"
              aria-label={showSettlements ? t("hideLayer") : t("showLayer")}
            >
              {showSettlements ? (
                <EyeIcon className="w-5 h-5 text-accent" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setDiscrepancyInfoExpanded(!discrepancyInfoExpanded)}
              className="w-11 h-11 flex items-center justify-center text-secondary hover:text-foreground transition-colors rounded hover:bg-muted"
              aria-label={discrepancyInfoExpanded ? t("hideInfo") : t("showInfo")}
              aria-expanded={discrepancyInfoExpanded}
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expandable info panel */}
        <div className={`expandable-panel ${discrepancyInfoExpanded ? "expanded" : ""}`}>
          <div>
            <p className="text-xs text-secondary leading-relaxed pb-3">
              {t("info")}
            </p>
          </div>
        </div>

        {/* Color scale */}
        <div
          className="h-3 w-full rounded-sm"
          style={{
            background: 'linear-gradient(to right, var(--secondary), var(--accent))'
          }}
        />
        <div className="flex justify-between font-mono text-[10px] text-secondary mt-1">
          <span>{t("match")}</span>
          <span>{t("undercount")}</span>
        </div>

        {/* Size scale - only at low zoom */}
        {showDotSize && (
          <div className="mt-3">
            <div
              className="w-full h-3 rounded-sm"
              style={{
                background: 'var(--secondary)',
                clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 75%)'
              }}
            />
            <div className="flex justify-between font-mono text-[10px] text-secondary mt-1">
              <span>{t("low")}</span>
              <span>{t("high")}</span>
            </div>
          </div>
        )}
      </div>

      {/* BUILDINGS SECTION */}
      <div className="pt-3 border-t border-muted">
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono text-xs text-secondary uppercase tracking-wider">
            {t("buildingsHeader")}
          </span>
          <div className="flex items-center -mr-2">
            <button
              onClick={() => setShowBuildings(!showBuildings)}
              className="w-11 h-11 flex items-center justify-center text-secondary hover:text-foreground transition-colors rounded hover:bg-muted"
              aria-label={showBuildings ? t("hideLayer") : t("showLayer")}
            >
              {showBuildings ? (
                <EyeIcon className="w-5 h-5 text-accent" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setSizeInfoExpanded(!sizeInfoExpanded)}
              className="w-11 h-11 flex items-center justify-center text-secondary hover:text-foreground transition-colors rounded hover:bg-muted"
              aria-label={sizeInfoExpanded ? t("hideInfo") : t("showInfo")}
              aria-expanded={sizeInfoExpanded}
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expandable info panel */}
        <div className={`expandable-panel ${sizeInfoExpanded ? "expanded" : ""}`}>
          <div>
            <p className="text-xs text-secondary leading-relaxed pt-2">
              {t("buildingsInfo")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
