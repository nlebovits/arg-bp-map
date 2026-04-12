"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useMapStore } from "@/lib/store";
import type { Locale } from "@/i18n/routing";
import { SearchInput } from "./SearchInput";

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const sidebarOpen = useMapStore((s) => s.sidebarOpen);
  const setSidebarOpen = useMapStore((s) => s.setSidebarOpen);
  const showBuildings = useMapStore((s) => s.showBuildings);
  const setShowBuildings = useMapStore((s) => s.setShowBuildings);
  const showSatellite = useMapStore((s) => s.showSatellite);
  const setShowSatellite = useMapStore((s) => s.setShowSatellite);

  const toggleLocale = () => {
    const newLocale: Locale = locale === "es" ? "en" : "es";
    router.replace(pathname, { locale: newLocale });
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
          w-[340px] h-full
          bg-neutral-950
          border-r border-neutral-800
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

        {/* Search */}
        <div className="px-6 py-5 border-b border-neutral-800">
          <SearchInput placeholder={t("search.placeholder")} />
        </div>

        {/* Layer controls */}
        <div className="px-6 py-5 border-b border-neutral-800">
          <h2 className="font-mono text-[10px] font-medium text-neutral-500 uppercase tracking-[0.2em] mb-5">
            {t("layers.header")}
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={showSatellite}
                  onChange={(e) => setShowSatellite(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-sm border border-neutral-600 bg-transparent peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                  {showSatellite && (
                    <svg
                      className="w-2.5 h-2.5 text-neutral-950"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-mono text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors">
                {t("layers.satellite")}
              </span>
            </label>

            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={showBuildings}
                  onChange={(e) => setShowBuildings(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-sm border border-neutral-600 bg-transparent peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                  {showBuildings && (
                    <svg
                      className="w-2.5 h-2.5 text-neutral-950"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors">
                  {t("layers.buildings")}
                </span>
                <span className="font-mono px-2 py-0.5 text-[10px] font-medium bg-amber-500/15 text-amber-400 rounded tracking-wide">
                  33.8M
                </span>
              </div>
            </label>
          </div>
        </div>

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

        {/* Footer with language toggle */}
        <footer className="px-6 py-4 border-t border-neutral-800">
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
