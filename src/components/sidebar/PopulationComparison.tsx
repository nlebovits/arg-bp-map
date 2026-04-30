"use client";

import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useMapStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import { useTranslations } from "next-intl";

// RENABAP official count (fixed)
const RENABAP_FAMILIES = 1_240_000;

// Base households at 100% occupation (from building analysis)
const BASE_HOUSEHOLDS = 2_265_499;

export default function PopulationComparison() {
  const t = useTranslations("sidebar.comparison");
  const [infoExpanded, setInfoExpanded] = useState(false);

  const { occupationRate, populationMultiplier } = useMapStore(
    useShallow((s) => ({
      occupationRate: s.occupationRate,
      populationMultiplier: s.populationMultiplier,
    }))
  );

  // Population estimates (households × multiplier)
  const renabapPopulation = Math.round(RENABAP_FAMILIES * populationMultiplier);
  const estimatedPopulation = Math.round(BASE_HOUSEHOLDS * occupationRate * populationMultiplier);

  // Max for scaling (100% occupation × max multiplier = full width)
  const maxPopulation = BASE_HOUSEHOLDS * populationMultiplier;

  // Bar widths proportional to max
  const renabapWidth = Math.round((renabapPopulation / maxPopulation) * 100);
  const estimateWidth = Math.round((estimatedPopulation / maxPopulation) * 100);

  // Format numbers
  const formatMillions = (n: number) => (n / 1_000_000).toFixed(2) + "M";

  return (
    <div className="space-y-2">
      {/* Header with info toggle - min 44px touch target */}
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.1em] font-bold text-foreground">
          {t("header")}
        </h2>
        <button
          onClick={() => setInfoExpanded(!infoExpanded)}
          className="w-11 h-11 -mr-2 flex items-center justify-center text-secondary hover:text-foreground transition-colors rounded hover:bg-muted"
          aria-label={infoExpanded ? t("hideInfo") : t("showInfo")}
          aria-expanded={infoExpanded}
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Expandable info panel */}
      <div className={`expandable-panel ${infoExpanded ? "expanded" : ""}`}>
        <div>
          <p className="text-sm text-secondary leading-relaxed pb-2">
            {t("info")}
          </p>
        </div>
      </div>

      {/* Two bars - RENABAP (fixed) vs Estimate (scales) */}
      <div className="space-y-2">
        {/* RENABAP official - scales with multiplier */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-secondary font-mono uppercase tracking-[0.04em]">{t("renabap")}</span>
            <span className="font-mono font-bold text-secondary">{formatMillions(renabapPopulation)}</span>
          </div>
          <div
            className="h-3 transition-all duration-300"
            style={{ width: `${renabapWidth}%`, background: 'var(--secondary)' }}
          />
        </div>

        {/* Our estimate - scales with occupation and multiplier */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-accent-text font-mono font-bold text-xs uppercase tracking-[0.04em]">{t("estimated")}</span>
            <span className="text-accent-text font-mono font-bold text-xs">{formatMillions(estimatedPopulation)}</span>
          </div>
          <div
            className="h-3 transition-all duration-300"
            style={{ width: `${estimateWidth}%`, background: 'var(--accent)' }}
          />
        </div>
      </div>
    </div>
  );
}
