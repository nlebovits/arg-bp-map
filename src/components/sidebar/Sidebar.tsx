"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useMapStore } from "@/lib/store";
import type { Locale } from "@/i18n/routing";
import DiscrepancyLegend from "./DiscrepancyLegend";
import InfoModal from "./InfoModal";

type ModalType = "explainer" | "data" | null;

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const sidebarOpen = useMapStore((s) => s.sidebarOpen);
  const setSidebarOpen = useMapStore((s) => s.setSidebarOpen);
  const setShowTutorial = useMapStore((s) => s.setShowTutorial);
  const setTutorialActive = useMapStore((s) => s.setTutorialActive);
  const setTutorialStep = useMapStore((s) => s.setTutorialStep);

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
        className="md:hidden fixed top-4 left-4 z-50 bg-neutral-900/95 backdrop-blur-sm p-2.5 rounded-lg border border-neutral-800 shadow-xl"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <svg
          className="w-5 h-5 text-neutral-200"
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
          bg-neutral-950
          border-r border-neutral-800
          shadow-[4px_0_24px_-2px_rgba(0,0,0,0.5)]
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
          overflow-hidden
        `}
      >
        {/* Header */}
        <header className="px-6 py-6 border-b border-neutral-800">
          <h1 className="text-5xl md:text-6xl font-semibold text-neutral-100 uppercase tracking-wide leading-none">
            <span className="block">Barrios</span>
            <span className="block ml-8">Visibles</span>
          </h1>
          <p className="text-lg text-neutral-400 mt-8 leading-relaxed">
            {t("tagline")}
          </p>
          {/* Subheader links */}
          <p className="text-base text-neutral-500 mt-3">
            {t("subheader.prefix")}{" "}
            <button
              onClick={() => setActiveModal("explainer")}
              className="text-amber-500 hover:text-amber-400 underline underline-offset-2"
            >
              {t("subheader.explainer")}
            </button>
            {" "}{t("subheader.or")}{" "}
            <button
              onClick={() => setActiveModal("data")}
              className="text-amber-500 hover:text-amber-400 underline underline-offset-2"
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
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-4">
              {t("stats.header")}
            </h2>
            <div className="rounded-lg bg-neutral-900/50 border border-neutral-800 p-5">
              <p className="text-base text-neutral-400 leading-relaxed">
                {t("stats.placeholder")}
              </p>
            </div>
          </div>

          {/* About section */}
          <div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-4">
              {t("about.header")}
            </h2>
            <div className="text-base text-neutral-400 leading-relaxed space-y-3">
              <p>{t("about.description")}</p>
              <p className="text-sm text-neutral-500">
                {t("about.credits")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Language toggle + Tutorial */}
        <footer className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => router.replace(pathname, { locale: "es" })}
              className={`transition-colors ${
                locale === "es"
                  ? "text-neutral-100 font-medium"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              ES
            </button>
            <span className="text-neutral-600">|</span>
            <button
              onClick={() => router.replace(pathname, { locale: "en" })}
              className={`transition-colors ${
                locale === "en"
                  ? "text-neutral-100 font-medium"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              EN
            </button>
          </div>
          <button
            onClick={handleReplayTutorial}
            className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-full transition-colors"
            title={t("replayTutorial")}
            aria-label={t("replayTutorial")}
          >
            <span className="text-sm font-medium">?</span>
          </button>
        </footer>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Info modals */}
      <InfoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
}
