"use client";

import { useState, memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useMapStore } from "@/lib/store";
import type { Locale } from "@/i18n/routing";
import DiscrepancyLegend from "./DiscrepancyLegend";
import InfoModal from "./InfoModal";

type ModalType = "explainer" | "data" | null;

function SidebarComponent() {
  const t = useTranslations("sidebar");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Optimized store selectors
  const {
    sidebarOpen,
    setSidebarOpen,
    setShowTutorial,
    setTutorialActive,
    setTutorialStep,
  } = useMapStore(
    useShallow((s) => ({
      sidebarOpen: s.sidebarOpen,
      setSidebarOpen: s.setSidebarOpen,
      setShowTutorial: s.setShowTutorial,
      setTutorialActive: s.setTutorialActive,
      setTutorialStep: s.setTutorialStep,
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
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <svg
          className="w-5 h-5 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
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
            {t("tagline")}
          </p>
          {/* Subheader links */}
          <p className="text-base text-secondary/80 mt-3">
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
          {/* Discrepancy Legend */}
          <DiscrepancyLegend />

          {/* Stats section */}
          <div>
            <h2 className="text-sm font-medium text-secondary uppercase tracking-widest mb-4">
              {t("stats.header")}
            </h2>
            <div className="rounded-lg bg-hinted/50 border border-border p-5">
              <p className="text-base text-secondary leading-relaxed">
                {t("stats.placeholder")}
              </p>
            </div>
          </div>

          {/* About section */}
          <div>
            <h2 className="text-sm font-medium text-secondary uppercase tracking-widest mb-4">
              {t("about.header")}
            </h2>
            <div className="text-base text-secondary leading-relaxed space-y-3">
              <p>{t("about.description")}</p>
              <p className="text-sm text-secondary/70">
                {t("about.credits")}
              </p>
            </div>
          </div>
        </div>

        {/* Attribution */}
        <div className="px-6 py-2 text-sm text-secondary">
          Built by{" "}
          <a
            href="https://nlebovits.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground/80"
          >
            Nissim Lebovits
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
