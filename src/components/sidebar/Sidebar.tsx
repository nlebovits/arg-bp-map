"use client";

import { useState, memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useMapStore } from "@/lib/store";
import type { Locale } from "@/i18n/routing";
import { Bars3Icon, XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import PopulationComparison from "./PopulationComparison";
import InfoModal from "./InfoModal";

type ModalType = "explainer" | "data" | null;

function SidebarComponent() {
  const t = useTranslations("sidebar");
  const tPop = useTranslations("sidebar.population");
  const tAttr = useTranslations("sidebar.attribution");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
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
      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-surface-raised/95 backdrop-blur-sm p-2.5 rounded-lg border border-border shadow-xl"
        aria-label={sidebarOpen ? t("closeSidebar") : t("openSidebar")}
      >
        {sidebarOpen ? (
          <XMarkIcon className="w-5 h-5 text-foreground" />
        ) : (
          <Bars3Icon className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:relative z-40
          w-[85vw] md:w-1/3 md:min-w-[320px] md:max-w-[480px] h-full
          bg-background
          border-r border-border
          shadow-[4px_0_24px_-2px_rgba(0,0,0,0.5)]
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
          overflow-hidden
        `}
      >
        {/* Header */}
        <header className="px-6 py-6 border-b border-border">
          <h1 className="text-5xl md:text-6xl font-semibold text-foreground uppercase tracking-wide leading-none">
            <span className="block">Barrios</span>
            <span className="block ml-8">Visibles</span>
          </h1>
          <p className="text-lg text-secondary mt-8 leading-relaxed">
            {t("tagline")}{" "}
            {t("subheader.prefix")}{" "}
            <button
              onClick={() => setActiveModal("explainer")}
              className="underline underline-offset-2 hover:text-foreground/80"
            >
              {t("subheader.explainer")}
            </button>
            {" "}{t("subheader.or")}{" "}
            <button
              onClick={() => setActiveModal("data")}
              className="underline underline-offset-2 hover:text-foreground/80"
            >
              {t("subheader.data")}
            </button>
            .
          </p>
        </header>

        {/* Main content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto space-y-8">
          {/* Population comparison - lead number */}
          <PopulationComparison />

          {/* Estimate parameters */}
          <div className="space-y-4">
            {/* Header */}
            <h2 className="text-sm font-medium text-secondary uppercase tracking-widest">
              {tPop("header")}
            </h2>

            {/* Population multiplier */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <label className="text-sm text-secondary">
                  {tPop("multiplier")}
                </label>
                <button
                  onClick={() => setMultiplierInfoExpanded(!multiplierInfoExpanded)}
                  className="w-5 h-5 flex items-center justify-center text-secondary/70 hover:text-foreground transition-colors rounded hover:bg-muted"
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
                  className={`flex-1 px-3 py-2 text-sm rounded border transition-colors ${
                    populationMultiplier === 2.8
                      ? "bg-accent/20 border-accent text-foreground"
                      : "bg-hinted/50 border-border text-secondary hover:border-accent/50"
                  }`}
                >
                  {tPop("multiplierINDEC")}
                </button>
                <button
                  onClick={() => setPopulationMultiplier(3.35)}
                  className={`flex-1 px-3 py-2 text-sm rounded border transition-colors ${
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
              <div className="flex items-center gap-1.5 mb-2">
                <label className="text-sm text-secondary">
                  {tPop("occupation")}
                </label>
                <button
                  onClick={() => setOccupationInfoExpanded(!occupationInfoExpanded)}
                  className="w-5 h-5 flex items-center justify-center text-secondary/70 hover:text-foreground transition-colors rounded hover:bg-muted"
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
                      className="underline underline-offset-2 hover:text-foreground/80"
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
                    className={`flex-1 px-2 py-2 text-sm rounded border transition-colors ${
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

        {/* Attribution */}
        <div className="px-6 py-2 text-sm text-secondary leading-relaxed">
          {tAttr("builtBy")}{" "}
          <a
            href="https://nlebovits.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground/80"
          >
            Nissim Lebovits
          </a>{" "}
          {tAttr("withDataFrom")}{" "}
          <a
            href="https://source.coop/vida/google-microsoft-osm-open-buildings"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground/80"
          >
            Google-Microsoft-OSM building footprints
          </a>{" "}
          {tAttr("and")}{" "}
          <a
            href="https://www.argentina.gob.ar/habitat/renabap"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground/80"
          >
            RENABAP
          </a>.
        </div>

        {/* Footer - Language toggle + Tutorial */}
        <footer className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => router.replace(pathname, { locale: "es" })}
              className={`transition-colors ${
                locale === "es"
                  ? "text-foreground font-medium"
                  : "text-secondary hover:text-foreground/80"
              }`}
            >
              ES
            </button>
            <span className="text-secondary/50">|</span>
            <button
              onClick={() => router.replace(pathname, { locale: "en" })}
              className={`transition-colors ${
                locale === "en"
                  ? "text-foreground font-medium"
                  : "text-secondary hover:text-foreground/80"
              }`}
            >
              EN
            </button>
          </div>
          <button
            onClick={handleReplayTutorial}
            className="w-7 h-7 flex items-center justify-center text-secondary hover:text-foreground/80 hover:bg-muted rounded-full transition-colors"
            title={t("replayTutorial")}
            aria-label={t("replayTutorial")}
          >
            <span className="text-sm font-medium">?</span>
          </button>
        </footer>
      </aside>

      {/* Mobile overlay - CSS opacity transition instead of mount/unmount */}
      <div
        className={`md:hidden fixed inset-0 bg-background/70 backdrop-blur-sm z-30 transition-opacity duration-300 ${
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
