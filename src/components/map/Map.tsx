"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from "@/lib/store";

// Argentina bounding box center (Buenos Aires area)
const INITIAL_CENTER: [number, number] = [-58.4, -34.6];
const INITIAL_ZOOM = 11;

export function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const setMap = useMapStore((s) => s.setMap);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    mapRef.current = map;
    setMap(map);

    return () => {
      map.remove();
      mapRef.current = null;
      setMap(null);
    };
  }, [setMap]);

  return <div ref={containerRef} className="h-full w-full" />;
}
