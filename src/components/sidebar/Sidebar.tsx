"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useMapStore } from "@/lib/store";
import type { Locale } from "@/i18n/routing";

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
          w-[380px] h-full
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
          <h1 className="font-mono text-lg font-medium text-neutral-100 tracking-wide uppercase">
            {t("title")}
          </h1>
          <p className="font-mono text-xs text-neutral-500 mt-2 tracking-wider uppercase">
            {t("subtitle")}
          </p>
        </header>

        {/* Stats section */}
        <div className="flex-1 px-6 py-5 overflow-y-auto">
          <h2 className="font-mono text-[10px] font-medium text-neutral-500 uppercase tracking-[0.2em] mb-5">
            {t("stats.header")}
          </h2>

          <div className="rounded-md bg-neutral-900/50 border border-neutral-800 p-5">
            <p className="font-mono text-xs text-neutral-500 leading-relaxed">
              {t("stats.placeholder")}
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-neutral-800 space-y-4">
          {/* Replay tutorial button - compact */}
          <button
            onClick={handleReplayTutorial}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <ReplayIcon className="w-3 h-3" />
            {t("replayTutorial")}
          </button>

          {/* Language toggle */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.15em]">
              {t("language.label")}
            </span>
            <div className="flex font-mono text-xs">
              <button
                onClick={() => router.replace(pathname, { locale: "es" })}
                className={`px-3 py-1.5 rounded-l-md border transition-all ${
                  locale === "es"
                    ? "bg-amber-500 text-neutral-950 border-amber-500 font-medium"
                    : "bg-transparent text-neutral-500 border-neutral-700 hover:text-neutral-300 hover:border-neutral-600"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => router.replace(pathname, { locale: "en" })}
                className={`px-3 py-1.5 rounded-r-md border-t border-r border-b transition-all ${
                  locale === "en"
                    ? "bg-amber-500 text-neutral-950 border-amber-500 font-medium"
                    : "bg-transparent text-neutral-500 border-neutral-700 hover:text-neutral-300 hover:border-neutral-600"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </footer>
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
