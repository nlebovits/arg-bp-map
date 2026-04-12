"use client";

import { useStore } from "@/lib/store";

export function Sidebar() {
  const { locale, setLocale, setShowTutorial } = useStore();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <h1 className="font-mono text-lg font-semibold text-zinc-100">
          Argentina BP Map
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          {locale === "es"
            ? "Huellas de edificios"
            : "Building footprints"}
        </p>
      </div>

      {/* Main content area - placeholder */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-sm text-zinc-400">
          {locale === "es" ? "Capas y controles" : "Layers and controls"}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800 space-y-3">
        {/* Language toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setLocale("es")}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              locale === "es"
                ? "bg-amber-600 text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            ES
          </button>
          <button
            onClick={() => setLocale("en")}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              locale === "en"
                ? "bg-amber-600 text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            EN
          </button>
        </div>

        {/* Help button */}
        <button
          onClick={() => setShowTutorial(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          <span>{locale === "es" ? "Ayuda" : "Help"}</span>
        </button>
      </div>
    </aside>
  );
}
