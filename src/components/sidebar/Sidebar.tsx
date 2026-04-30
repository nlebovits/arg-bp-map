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
          <h1 className="font-sans font-bold text-base tracking-tight text-foreground">
            Barrios Visibles
          </h1>
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
          {/* CNG attribution eyebrow */}
          <div className="flex items-center gap-2 mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-secondary">
            <svg
              viewBox="0 0 96 96"
              className="h-3 w-3"
              aria-hidden="true"
              focusable="false"
            >
              <path fill="#FFF" d="M0 0h96v96H0z" />
              <path
                fill="#2126F7"
                d="M58.094 11.56a2.47 2.47 0 0 0-1.57-.56h-8.495c-.432 0-.86.095-1.251.275L18.722 24.23a3.37 3.37 0 0 0-1.934 2.682l-3.765 33.725a3.7 3.7 0 0 0 1.333 3.276l25 20.525c.445.364.998.563 1.573.563h7.64c.432 0 .862-.095 1.254-.275L78.46 71.468a3.17 3.17 0 0 0 1.813-2.517L83.97 35.55a4.73 4.73 0 0 0-1.703-4.178zM48.387 31c8.231 2.122 12.683 9.195 12.612 16.613-.066 7.076-4.464 14.363-12.455 16.387-16.944-4.6-16.453-28.356-.157-33"
              />
            </svg>
            <span>A Radiant Earth × CNG project</span>
          </div>

          {/* Mobile close X — inside sidebar top-right */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-foreground"
            aria-label={t("closeSidebar")}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <h1 className="font-sans font-bold text-[44px] sm:text-5xl md:text-6xl text-foreground tracking-[-0.025em] leading-[0.95]">
            <span className="block">BARRIOS</span>
            <span className="block ml-8">VISIBLES</span>
          </h1>
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
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-secondary border-border hover:text-foreground"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => router.replace(pathname, { locale: "en" })}
              className={`w-9 h-7 border border-l-0 min-h-[44px] md:min-h-0 transition-colors ${
                locale === "en"
                  ? "bg-accent text-white border-accent"
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
