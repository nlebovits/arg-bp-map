"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useGeocode, type GeocodeSuggestion } from "@/hooks/useGeocode";
import { useMapStore } from "@/lib/store";

interface SearchInputProps {
  placeholder?: string;
}

export function SearchInput({ placeholder = "Search address..." }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [dismissedForQuery, setDismissedForQuery] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { suggestions, isLoading, clear } = useGeocode(query);
  const flyTo = useMapStore((s) => s.flyTo);

  // Derive isOpen from state (no useEffect needed)
  const isOpen = suggestions.length > 0 && query !== dismissedForQuery;

  // Handle query change - reset highlight
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setHighlightedIndex(-1);
    // Clear dismissal when user types new characters
    if (newQuery !== dismissedForQuery) {
      setDismissedForQuery(null);
    }
  }, [dismissedForQuery]);

  const handleSelect = useCallback(
    (suggestion: GeocodeSuggestion) => {
      flyTo(suggestion.lng, suggestion.lat);
      setQuery(suggestion.name);
      setDismissedForQuery(suggestion.name);
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
          setDismissedForQuery(query);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, suggestions, highlightedIndex, handleSelect, query]
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
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none"
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
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setDismissedForQuery(null)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setDismissedForQuery(query), 150);
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 bg-surface-raised border border-muted rounded-md
                     font-mono text-sm text-foreground placeholder:text-secondary
                     focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50
                     transition-all"
          role="combobox"
          aria-label="Search for an address"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-surface-raised border border-muted
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
                    ? "bg-accent-muted text-accent-hover"
                    : "text-foreground/80 hover:bg-hinted"
                }`}
            >
              <div className="font-medium truncate">{suggestion.name}</div>
              <div className="text-xs text-secondary truncate">
                {suggestion.displayName}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
