"use client";

import { useState, memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useMapStore } from "@/lib/store";
import type { Locale } from "@/i18n/routing";
import { Bars3Icon, XMarkIcon, InformationCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import PopulationComparison from "./PopulationComparison";
import DiscrepancyTable from "./DiscrepancyTable";
import InfoModal from "./InfoModal";

type ModalType = "explainer" | "data" | null;

function SidebarComponent() {
  const t = useTranslations("sidebar");
  const tPop = useTranslations("sidebar.population");
  const tAttr = useTranslations("sidebar.attribution");
  const tDisc = useTranslations("discrepancyTable");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [paramsExpanded, setParamsExpanded] = useState(false);
  const [multiplierInfoExpanded, setMultiplierInfoExpanded] = useState(false);
  const [occupationInfoExpanded, setOccupationInfoExpanded] = useState(false);

  // Optimized store selectors
  const {
    sidebarOpen,
    setSidebarOpen,
    setShowTutorial,
    setTutorialActive,
    setTutorialStep,
    populationMultiplier,
    setPopulationMultiplier,
    occupationRate,
    setOccupationRate,
  } = useMapStore(
    useShallow((s) => ({
      sidebarOpen: s.sidebarOpen,
      setSidebarOpen: s.setSidebarOpen,
      setShowTutorial: s.setShowTutorial,
      setTutorialActive: s.setTutorialActive,
      setTutorialStep: s.setTutorialStep,
      populationMultiplier: s.populationMultiplier,
      setPopulationMultiplier: s.setPopulationMultiplier,
      occupationRate: s.occupationRate,
      setOccupationRate: s.setOccupationRate,
    }))
  );

  const handleReplayTutorial = () => {
    setTutorialStep(0);
    setTutorialActive(true);
    setShowTutorial(true);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile header bar - shows when sidebar closed; respects safe-area-inset-top */}
      {!sidebarOpen && (
        <div
          className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 flex items-center justify-between pt-[env(safe-area-inset-top)]"
          style={{ height: "calc(56px + env(safe-area-inset-top))" }}
        >
{/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/barrios-visibles-mark-white.svg"
            alt="Barrios Visibles"
            className="h-8 w-auto"
          />
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-foreground"
            aria-label={t("openSidebar")}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:relative z-40
          w-[92vw] max-w-[420px] md:w-1/3 md:min-w-[320px] md:max-w-[480px] h-full
          bg-surface
          border-r border-border
          shadow-[4px_0_24px_-2px_rgba(0,0,0,0.5)]
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
          overflow-hidden
          pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        `}
      >
        {/* Header */}
        <header className="relative px-6 py-6 border-b border-border">
          {/* Radiant Earth attribution */}
          <p className="mb-3 font-mono text-[11px] tracking-[0.02em] text-secondary">
            Barrios Visibles is a{" "}
            <a
              href="https://radiant.earth"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Radiant Earth
            </a>{" "}
            project
          </p>

          {/* Mobile close X — inside sidebar top-right */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-foreground"
            aria-label={t("closeSidebar")}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

{/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/barrios-visibles-lockup-white.svg"
            alt="Barrios Visibles"
            className="h-28 sm:h-32 md:h-40 w-auto"
          />
          <p className="text-lg text-secondary mt-8 leading-relaxed">
            {t("tagline")}{" "}
            {t("subheader.prefix")}{" "}
            <button
              onClick={() => setActiveModal("explainer")}
              className="underline underline-offset-2 hover:text-foreground"
            >
              {t("subheader.explainer")}
            </button>
            {" "}{t("subheader.or")}{" "}
            <button
              onClick={() => setActiveModal("data")}
              className="underline underline-offset-2 hover:text-foreground"
            >
              {t("subheader.data")}
            </button>
            .
          </p>
        </header>

        {/* Main content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
          {/* Population comparison - lead number */}
          <PopulationComparison />

          {/* Collapsible estimate parameters */}
          <div className="space-y-2">
            {/* Toggle header */}
            <button
              onClick={() => setParamsExpanded(!paramsExpanded)}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] font-bold text-secondary hover:text-foreground transition-colors w-full"
            >
              {paramsExpanded ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
              {tDisc("adjustEstimates")}
            </button>

            {/* Collapsible content */}
            <div className={`expandable-panel ${paramsExpanded ? "expanded" : ""}`}>
              <div className="space-y-4 pt-2">
                {/* Population multiplier */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm text-secondary">
                      {tPop("multiplier")}
                    </label>
                    <button
                      onClick={() => setMultiplierInfoExpanded(!multiplierInfoExpanded)}
                      className="w-11 h-11 flex items-center justify-center text-secondary hover:text-foreground transition-colors -my-2"
                      aria-label={multiplierInfoExpanded ? tPop("hideInfo") : tPop("showInfo")}
                      aria-expanded={multiplierInfoExpanded}
                    >
                      <InformationCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={`expandable-panel ${multiplierInfoExpanded ? "expanded" : ""}`}>
                    <div>
                      <p className="text-xs text-secondary leading-relaxed mb-2">
                        {tPop("multiplierInfo")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPopulationMultiplier(2.8)}
                      className={`flex-1 px-3 py-2 min-h-[44px] font-mono text-xs uppercase tracking-[0.04em] border transition-colors ${
                        populationMultiplier === 2.8
                          ? "bg-accent/20 border-accent text-foreground"
                          : "bg-hinted/50 border-border text-secondary hover:border-accent/50"
                      }`}
                    >
                      {tPop("multiplierINDEC")}
                    </button>
                    <button
                      onClick={() => setPopulationMultiplier(3.35)}
                      className={`flex-1 px-3 py-2 min-h-[44px] font-mono text-xs uppercase tracking-[0.04em] border transition-colors ${
                        populationMultiplier === 3.35
                          ? "bg-accent/20 border-accent text-foreground"
                          : "bg-hinted/50 border-border text-secondary hover:border-accent/50"
                      }`}
                    >
                      {tPop("multiplierRENABAP")}
                    </button>
                  </div>
                </div>

                {/* Occupation rate */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm text-secondary">
                      {tPop("occupation")}
                    </label>
                    <button
                      onClick={() => setOccupationInfoExpanded(!occupationInfoExpanded)}
                      className="w-11 h-11 flex items-center justify-center text-secondary hover:text-foreground transition-colors -my-2"
                      aria-label={occupationInfoExpanded ? tPop("hideInfo") : tPop("showInfo")}
                      aria-expanded={occupationInfoExpanded}
                    >
                      <InformationCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={`expandable-panel ${occupationInfoExpanded ? "expanded" : ""}`}>
                    <div>
                      <p className="text-xs text-secondary leading-relaxed mb-2">
                        {tPop("occupationInfo")}{" "}
                        <a
                          href="https://nlebovits.github.io/posts/writing/informal-settlements-argentina/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-foreground"
                        >
                          {tPop("occupationInfoLink")}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {([0.85, 0.9, 0.95, 1.0] as const).map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setOccupationRate(rate)}
                        className={`flex-1 px-2 py-2 min-h-[44px] font-mono text-xs border transition-colors ${
                          occupationRate === rate
                            ? "bg-accent/20 border-accent text-foreground"
                            : "bg-hinted/50 border-border text-secondary hover:border-accent/50"
                        }`}
                      >
                        {Math.round(rate * 100)}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Discrepancy by area table */}
          <DiscrepancyTable />

          {/* Attribution - inside scroll area */}
          <div className="font-mono text-xs leading-relaxed tracking-[0.02em] text-secondary pt-4">
          {tAttr("builtBy")}{" "}
          <a
            href="https://nlebovits.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Nissim Lebovits
          </a>{" "}
          {tAttr("withDataFrom")}{" "}
          <a
            href="https://source.coop/vida/google-microsoft-osm-open-buildings"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Google-Microsoft-OSM building footprints
          </a>{" "}
          {tAttr("and")}{" "}
          <a
            href="https://www.argentina.gob.ar/habitat/renabap"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            RENABAP
          </a>.
          </div>
        </div>

        {/* Footer - Language toggle (segmented) + Tutorial */}
        <footer className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center font-mono text-[11px] uppercase tracking-[0.08em]">
            <button
              onClick={() => router.replace(pathname, { locale: "es" })}
              className={`w-9 h-7 border min-h-[44px] md:min-h-0 transition-colors ${
                locale === "es"
                  ? "bg-transparent text-foreground border-foreground"
                  : "bg-transparent text-secondary border-border hover:text-foreground"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => router.replace(pathname, { locale: "en" })}
              className={`w-9 h-7 border border-l-0 min-h-[44px] md:min-h-0 transition-colors ${
                locale === "en"
                  ? "bg-transparent text-foreground border-foreground"
                  : "bg-transparent text-secondary border-border hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>
          <button
            onClick={handleReplayTutorial}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-secondary hover:text-foreground transition-colors"
            title={t("replayTutorial")}
            aria-label={t("replayTutorial")}
          >
            <span className="w-7 h-7 border border-current rounded-full flex items-center justify-center text-sm font-medium">
              ?
            </span>
          </button>
        </footer>
      </aside>

      {/* Mobile overlay - CSS opacity transition instead of mount/unmount */}
      <div
        className={`md:hidden fixed inset-0 bg-background/85 backdrop-blur-md z-30 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Info modals */}
      <InfoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
}

export default memo(SidebarComponent);
