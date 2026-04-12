"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useGeocode, type GeocodeSuggestion } from "@/hooks/useGeocode";
import { useMapStore } from "@/lib/store";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { suggestions, isLoading, clear } = useGeocode(query);
  const flyTo = useMapStore((s) => s.flyTo);

  // Show dropdown when we have suggestions
  useEffect(() => {
    setIsOpen(suggestions.length > 0);
    setHighlightedIndex(-1);
  }, [suggestions]);

  const handleSelect = useCallback(
    (suggestion: GeocodeSuggestion) => {
      flyTo(suggestion.lng, suggestion.lat);
      setQuery(suggestion.name);
      setIsOpen(false);
      clear();
      inputRef.current?.blur();
    },
    [flyTo, clear]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(suggestions[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, suggestions, highlightedIndex, handleSelect]
  );

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setIsOpen(false), 150);
          }}
          placeholder="Search address..."
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2
                     font-mono text-sm text-neutral-200 placeholder:text-neutral-500
                     focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50
                     transition-colors"
          aria-label="Search for an address"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-suggestions"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-neutral-900 border border-neutral-700
                     rounded shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              role="option"
              aria-selected={index === highlightedIndex}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-3 py-2 cursor-pointer font-mono text-sm transition-colors
                ${
                  index === highlightedIndex
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
            >
              <div className="font-medium truncate">{suggestion.name}</div>
              <div className="text-xs text-neutral-500 truncate">
                {suggestion.displayName}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
