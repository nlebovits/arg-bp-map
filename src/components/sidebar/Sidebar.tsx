"use client";

import { SearchInput } from "./SearchInput";

export function Sidebar() {
  return (
    <aside className="w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-neutral-800">
        <h1 className="font-mono text-lg font-semibold text-amber-500">
          Argentina Map
        </h1>
        <p className="font-mono text-xs text-neutral-500 mt-1">
          Buenos Aires region
        </p>
      </header>

      {/* Search */}
      <div className="p-4 border-b border-neutral-800">
        <SearchInput />
      </div>

      {/* Content area (for future features) */}
      <div className="flex-1 p-4 overflow-auto">
        <p className="font-mono text-xs text-neutral-600">
          Search for addresses to navigate the map.
        </p>
      </div>

      {/* Footer */}
      <footer className="p-4 border-t border-neutral-800">
        <p className="font-mono text-xs text-neutral-600">
          Data: OpenStreetMap
        </p>
      </footer>
    </aside>
  );
}
