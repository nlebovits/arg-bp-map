"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, ChevronUpIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useMapStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";

interface RawRow {
  d: string; // departamento
  p: string; // provincia
  u: boolean; // is_urban
  b: number; // building_count
  r: number; // renabap_families
  e: number; // estimated_families (building_count * 1.1)
}

export default function DiscrepancyTable() {
  const t = useTranslations("discrepancyTable");

  const { populationMultiplier, occupationRate } = useMapStore(
    useShallow((s) => ({
      populationMultiplier: s.populationMultiplier,
      occupationRate: s.occupationRate,
    }))
  );

  const [rawData, setRawData] = useState<RawRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);

  // Filter
  const [deptFilter, setDeptFilter] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch static JSON once on mount
  useEffect(() => {
    fetch("/data/discrepancy-by-area.json?v=2")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log("Loaded discrepancy data:", json?.rows?.length, "rows");
        if (json?.rows?.length > 0) {
          setRawData(json.rows);
        } else {
          setError("Empty data");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load discrepancy data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Calculate aggregated data based on current params
  // Formula matches PopulationComparison: (estimated_families * occ * mult) - (renabap_families * mult)
  const data = useMemo(() => {
    if (rawData.length === 0) {
      console.log("No raw data");
      return [];
    }

    const result = rawData
      .map((r) => {
        const estPop = r.e * occupationRate * populationMultiplier;
        const renabapPop = r.r * populationMultiplier;
        return {
          departamento: r.d,
          provincia: r.p,
          isUrban: r.u,
          difference: Math.round(estPop - renabapPop),
        };
      })
      .filter((r) => r.difference > 0)
      .sort((a, b) => b.difference - a.difference);

    console.log("Computed data:", result.length, "rows with positive diff");
    return result;
  }, [rawData, occupationRate, populationMultiplier]);

  // Extract unique departamentos for filter
  const departamentos = useMemo(() => {
    const unique = [...new Set(data.map((d) => d.departamento))].sort();
    return unique;
  }, [data]);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!deptFilter) return [];
    const lower = deptFilter.toLowerCase();
    return departamentos.filter((d) => d.toLowerCase().includes(lower)).slice(0, 5);
  }, [departamentos, deptFilter]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!deptFilter) return data;
    // Exact match filter
    const exactMatch = departamentos.find(
      (d) => d.toLowerCase() === deptFilter.toLowerCase()
    );
    if (exactMatch) {
      return data.filter((r) => r.departamento === exactMatch);
    }
    return data;
  }, [data, deptFilter, departamentos]);

  const displayData = expanded ? filteredData : filteredData.slice(0, 10);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toLocaleString("es-AR");
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.1em] font-bold text-foreground">
            {t("header")}
          </h2>
        </div>
        <p className="text-xs text-secondary">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.1em] font-bold text-foreground">
            {t("header")}
          </h2>
        </div>
        <p className="text-xs text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header with info toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-secondary uppercase tracking-widest">
          {t("header")}
        </h2>
        <button
          onClick={() => setInfoExpanded(!infoExpanded)}
          className="w-11 h-11 -mr-2 flex items-center justify-center text-secondary hover:text-foreground transition-colors rounded hover:bg-muted"
          aria-label={infoExpanded ? t("hideInfo") : t("showInfo")}
          aria-expanded={infoExpanded}
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Expandable info panel */}
      <div className={`expandable-panel ${infoExpanded ? "expanded" : ""}`}>
        <div>
          <p className="text-sm text-secondary leading-relaxed pb-2">
            {t("info")}
          </p>
        </div>
      </div>

      {/* Department filter with autocomplete */}
      <div className="relative">
        <input
          type="text"
          value={deptFilter}
          onChange={(e) => {
            setDeptFilter(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={t("departamento")}
          className="w-full px-2 py-1.5 font-mono text-xs bg-background border border-border rounded-none text-foreground placeholder:text-secondary min-h-[36px] focus:outline-none focus:border-accent"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-background border border-border rounded-none shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((d) => (
              <li
                key={d}
                onMouseDown={() => {
                  setDeptFilter(d);
                  setShowSuggestions(false);
                }}
                className="px-2 py-1.5 font-mono text-xs text-foreground hover:bg-hinted cursor-pointer"
              >
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <p className="text-xs text-secondary">{t("noData")}</p>
      ) : (
        <>
          {/* Mobile: stacked rows */}
          <div className="md:hidden border-y border-border">
            {displayData.map((row) => (
              <div
                key={`m-${row.departamento}-${row.provincia}-${row.isUrban}`}
                className="flex flex-col py-3 px-2 border-b border-border last:border-b-0"
              >
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-foreground text-sm">{row.departamento}</span>
                  <span className="font-mono font-bold text-accent-text whitespace-nowrap">
                    +{formatNumber(row.difference)}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-secondary mt-0.5">
                  {row.provincia} · {row.isUrban ? t("urban") : t("rural")}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block max-h-[240px] overflow-y-auto border border-border focus:outline-none focus:ring-1 focus:ring-accent" tabIndex={0}>
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-background border-b border-border">
                <tr>
                  <th className="text-left px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] font-bold text-foreground">
                    {t("departamento")}
                  </th>
                  <th className="text-right px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] font-bold text-foreground">
                    {t("difference")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, i) => (
                  <tr
                    key={`d-${row.departamento}-${row.provincia}-${row.isUrban}`}
                    className={i % 2 === 0 ? "bg-hinted/30" : ""}
                  >
                    <td className="px-2 py-1.5">
                      <div className="font-bold text-foreground">{row.departamento}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.04em] text-secondary">
                        {row.provincia} · {row.isUrban ? t("urban") : t("rural")}
                      </div>
                    </td>
                    <td className="text-right px-2 py-1.5 font-mono font-bold text-accent-text whitespace-nowrap">
                      +{formatNumber(row.difference)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Show more/less toggle */}
      {filteredData.length > 10 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-secondary hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUpIcon className="w-3 h-3" />
              {t("showLess")}
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-3 h-3" />
              {t("showMore", { count: filteredData.length })}
            </>
          )}
        </button>
      )}
    </div>
  );
}
