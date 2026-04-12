"use client";

import { useMapStore } from "@/lib/store";

export default function Sidebar() {
  const sidebarOpen = useMapStore((s) => s.sidebarOpen);
  const setSidebarOpen = useMapStore((s) => s.setSidebarOpen);
  const showBuildings = useMapStore((s) => s.showBuildings);
  const setShowBuildings = useMapStore((s) => s.setShowBuildings);
  const showSatellite = useMapStore((s) => s.showSatellite);
  const setShowSatellite = useMapStore((s) => s.setShowSatellite);
  const locale = useMapStore((s) => s.locale);
  const setLocale = useMapStore((s) => s.setLocale);

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
            {locale === "es"
              ? "Asentamientos Informales"
              : "Informal Settlements"}
          </h1>
          <p className="font-mono text-xs text-neutral-500 mt-2 tracking-wider uppercase">
            Argentina
          </p>
        </header>

        {/* Search */}
        <div className="px-6 py-5 border-b border-neutral-800">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={
                locale === "es" ? "Buscar ubicación..." : "Search location..."
              }
              className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md text-sm text-neutral-200 placeholder-neutral-500 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
            />
          </div>
        </div>

        {/* Layer controls */}
        <div className="px-6 py-5 border-b border-neutral-800">
          <h2 className="font-mono text-[10px] font-medium text-neutral-500 uppercase tracking-[0.2em] mb-5">
            {locale === "es" ? "Capas" : "Layers"}
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
                {locale === "es" ? "Imagen satelital" : "Satellite imagery"}
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
                  {locale === "es" ? "Edificios detectados" : "Detected buildings"}
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
            {locale === "es" ? "Estadísticas" : "Statistics"}
          </h2>

          <div className="rounded-md bg-neutral-900/50 border border-neutral-800 p-5">
            <p className="font-mono text-xs text-neutral-500 leading-relaxed">
              {locale === "es"
                ? "Zoom a un asentamiento para ver estadísticas detalladas."
                : "Zoom to a settlement to view detailed statistics."}
            </p>
          </div>
        </div>

        {/* Footer with language toggle */}
        <footer className="px-6 py-4 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.15em]">
              {locale === "es" ? "Idioma" : "Language"}
            </span>
            <div className="flex font-mono text-xs">
              <button
                onClick={() => setLocale("es")}
                className={`px-3 py-1.5 rounded-l-md border transition-all ${
                  locale === "es"
                    ? "bg-amber-500 text-neutral-950 border-amber-500 font-medium"
                    : "bg-transparent text-neutral-500 border-neutral-700 hover:text-neutral-300 hover:border-neutral-600"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLocale("en")}
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
