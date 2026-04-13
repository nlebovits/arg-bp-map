"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useMapStore } from "@/lib/store";
import type { Locale } from "@/i18n/routing";
import DiscrepancyLegend from "./DiscrepancyLegend";

// Replay icon
function ReplayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const sidebarOpen = useMapStore((s) => s.sidebarOpen);
  const setSidebarOpen = useMapStore((s) => s.setSidebarOpen);
  const setShowTutorial = useMapStore((s) => s.setShowTutorial);
  const setTutorialActive = useMapStore((s) => s.setTutorialActive);
  const setTutorialStep = useMapStore((s) => s.setTutorialStep);

  const handleReplayTutorial = () => {
    setTutorialStep(0);
    setTutorialActive(true);
    setShowTutorial(true);
    // Close sidebar on mobile when starting tutorial
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
        {/* Utility bar */}
        <div className="px-4 py-2 border-b border-neutral-800/50 flex items-center justify-between">
          {/* Language toggle */}
          <div className="flex font-mono text-[10px]">
            <button
              onClick={() => router.replace(pathname, { locale: "es" })}
              className={`px-2 py-1 rounded-l border transition-all ${
                locale === "es"
                  ? "bg-amber-500 text-neutral-950 border-amber-500 font-medium"
                  : "bg-transparent text-neutral-500 border-neutral-700 hover:text-neutral-300 hover:border-neutral-600"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => router.replace(pathname, { locale: "en" })}
              className={`px-2 py-1 rounded-r border-t border-r border-b transition-all ${
                locale === "en"
                  ? "bg-amber-500 text-neutral-950 border-amber-500 font-medium"
                  : "bg-transparent text-neutral-500 border-neutral-700 hover:text-neutral-300 hover:border-neutral-600"
              }`}
            >
              EN
            </button>
          </div>

          {/* Replay tutorial icon */}
          <button
            onClick={handleReplayTutorial}
            className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded transition-colors"
            title={t("replayTutorial")}
            aria-label={t("replayTutorial")}
          >
            <ReplayIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Header */}
        <header className="px-6 py-5 border-b border-neutral-800">
          <h1 className="font-mono text-lg font-medium text-neutral-100 tracking-wide">
            Barrios Visibles
          </h1>
          <p className="font-mono text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
            {t("tagline")}
          </p>
        </header>

        {/* Main content */}
        <div className="flex-1 px-6 py-5 overflow-y-auto space-y-6">
          {/* Discrepancy Legend */}
          <DiscrepancyLegend />

          {/* Stats section */}
          <div>
            <h2 className="font-mono text-[10px] font-medium text-neutral-500 uppercase tracking-[0.2em] mb-4">
              {t("stats.header")}
            </h2>
            <div className="rounded-md bg-neutral-900/50 border border-neutral-800 p-4">
              <p className="font-mono text-xs text-neutral-500 leading-relaxed">
                {t("stats.placeholder")}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
