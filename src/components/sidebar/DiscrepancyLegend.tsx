"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export default function DiscrepancyLegend() {
  const t = useTranslations("legend");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Section header with expand button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-secondary uppercase tracking-widest">
          {t("header")}
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-7 h-7 flex items-center justify-center text-secondary hover:text-foreground transition-colors rounded hover:bg-muted"
          aria-label={expanded ? t("hideInfo") : t("showInfo")}
          aria-expanded={expanded}
        >
          <svg
            className="w-4 h-4 transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Gradient bar with border */}
      <div
        className="h-4 w-full rounded border border-muted"
        style={{
          background: 'linear-gradient(to right, #808080, #ea9755)'
        }}
      />

      {/* Labels */}
      <div className="flex justify-between text-base text-secondary">
        <span>{t("match")}</span>
        <span>{t("undercount")}</span>
      </div>

      {/* Expandable info panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-border">
              <p className="text-base text-secondary leading-relaxed">
                {t("info")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
