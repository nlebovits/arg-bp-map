"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface GeocodeSuggestion {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
}

// Argentina bounding box for biasing results
const ARGENTINA_VIEWBOX = "-73.6,-55.0,-53.6,-21.8";

// Simple in-memory cache for geocoding results (avoids re-fetching same queries)
const geocodeCache = new Map<string, GeocodeSuggestion[]>();
const CACHE_MAX_SIZE = 50;

export function useGeocode(query: string, debounceMs = 300) {
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Check cache first
    const cached = geocodeCache.get(trimmed);
    if (cached) {
      setSuggestions(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        format: "json",
        addressdetails: "1",
        limit: "5",
        viewbox: ARGENTINA_VIEWBOX,
        bounded: "0", // Prefer but don't restrict to viewbox
        countrycodes: "ar",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          headers: {
            "User-Agent": "ArgBPMapSearch/1.0",
          },
          signal: abortRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`Nominatim error: ${response.status}`);
      }

      const results: NominatimResult[] = await response.json();

      const mapped = results.map((r) => ({
        id: String(r.place_id),
        name: r.name || r.display_name.split(",")[0],
        displayName: r.display_name,
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
      }));

      // Cache the result (with LRU eviction)
      if (geocodeCache.size >= CACHE_MAX_SIZE) {
        const firstKey = geocodeCache.keys().next().value;
        if (firstKey) geocodeCache.delete(firstKey);
      }
      geocodeCache.set(trimmed, mapped);

      setSuggestions(mapped);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return; // Ignore aborted requests
      }
      setError(err instanceof Error ? err.message : "Search failed");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the search
    timeoutRef.current = setTimeout(() => {
      search(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs, search]);

  const clear = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return { suggestions, isLoading, error, clear };
}
