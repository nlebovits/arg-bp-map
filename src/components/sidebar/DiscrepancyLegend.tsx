"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export default function DiscrepancyLegend() {
  const t = useTranslations("legend");
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[10px] font-medium text-neutral-500 uppercase tracking-[0.2em]">
          {t("header")}
        </h2>
        <button
          onClick={() => setInfoOpen(!infoOpen)}
          className="w-5 h-5 flex items-center justify-center font-mono text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          aria-label={infoOpen ? t("hideInfo") : t("showInfo")}
          aria-expanded={infoOpen}
        >
          <motion.span
            animate={{ rotate: infoOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            +
          </motion.span>
        </button>
      </div>

      {/* Gradient bar */}
      <div className="h-2 w-full rounded-sm bg-gradient-to-r from-amber-500 to-neutral-600" />

      {/* Labels */}
      <div className="flex justify-between font-mono text-[10px] text-neutral-500">
        <span>{t("undercount")}</span>
        <span>{t("match")}</span>
      </div>

      {/* Expandable info */}
      <AnimatePresence>
        {infoOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="font-mono text-xs text-neutral-500 leading-relaxed pt-2 border-t border-neutral-800">
              {t("info")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
