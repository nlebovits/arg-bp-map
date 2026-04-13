"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type ModalType = "explainer" | "data" | null;

interface InfoModalProps {
  type: ModalType;
  onClose: () => void;
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:text-accent-hover underline underline-offset-2"
    >
      {children}
      <svg
        className="inline-block w-3 h-3 ml-0.5 -mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

function FootnoteRef({ id }: { id: number }) {
  return (
    <sup>
      <a
        href={`#fn-${id}`}
        className="text-accent hover:text-accent-hover no-underline ml-0.5"
      >
        [{id}]
      </a>
    </sup>
  );
}

function FootnoteItem({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  return (
    <li
      id={`fn-${id}`}
      className="text-sm text-secondary scroll-mt-4"
    >
      <span className="text-accent/70 mr-1">[{id}]</span>
      {children}
    </li>
  );
}

function ExplainerContent() {
  const t = useTranslations("modals.explainer");

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <section>
        <p className="text-foreground/80 leading-relaxed">
          {t("intro")}
        </p>
      </section>

      {/* The Problem */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          {t("problem.title")}
        </h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          {t("problem.p1")}
          <FootnoteRef id={1} />
          {" "}{t("problem.p1cont")}
          <FootnoteRef id={2} />
        </p>
        <p className="text-foreground/80 leading-relaxed">
          {t("problem.p2")}
          <FootnoteRef id={3} />
        </p>
      </section>

      {/* Key Findings */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          {t("findings.title")}
        </h3>
        <div className="bg-hinted/80 border border-muted rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-accent font-mono text-sm mt-0.5">63%</span>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {t("findings.stat1")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-accent font-mono text-sm mt-0.5">2.3–3.1M</span>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {t("findings.stat2")}
              <FootnoteRef id={4} />
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-accent font-mono text-sm mt-0.5">13–17%</span>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {t("findings.stat3")}
            </p>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          {t("methodology.title")}
        </h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          {t("methodology.p1")}
        </p>
        <p className="text-foreground/80 leading-relaxed">
          {t("methodology.p2")}
          <FootnoteRef id={5} />
          {" "}{t("methodology.p2cont")}
        </p>
      </section>

      {/* Caveats */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          {t("caveats.title")}
        </h3>
        <ul className="space-y-2 text-foreground/80 text-sm leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1">•</span>
            <span>{t("caveats.item1")}<FootnoteRef id={6} /></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1">•</span>
            <span>{t("caveats.item2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1">•</span>
            <span>{t("caveats.item3")}</span>
          </li>
        </ul>
      </section>

      {/* Footnotes */}
      <section className="border-t border-border pt-4 mt-6">
        <h4 className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">
          {t("footnotes.title")}
        </h4>
        <ol className="space-y-2 list-none">
          <FootnoteItem id={1}>
            <ExternalLink href="https://unstats.un.org/unsd/demographic/meetings/egm/symposium2001/docs/symposium_04.htm">
              UN Statistics Division (2001)
            </ExternalLink>
            {" — "}{t("footnotes.fn1")}
          </FootnoteItem>
          <FootnoteItem id={2}>
            <ExternalLink href="https://data.unhabitat.org/pages/housing-slums-and-informal-settlements">
              UN-Habitat Data Portal
            </ExternalLink>
            {" — "}{t("footnotes.fn2")}
          </FootnoteItem>
          <FootnoteItem id={3}>
            <ExternalLink href="https://dlab.berkeley.edu/news/where-streets-have-no-name-spatial-data-informal-settlements">
              Berkeley D-Lab
            </ExternalLink>
            {" — "}{t("footnotes.fn3")}
          </FootnoteItem>
          <FootnoteItem id={4}>
            {t("footnotes.fn4pre")}
            <ExternalLink href="https://censo.gob.ar/index.php/datos_definitivos_total_pais/">
              INDEC Censo 2022
            </ExternalLink>
            {"; "}
            <ExternalLink href="https://www.argentina.gob.ar/sites/default/files/informe_final-barrios_populares.pdf">
              Argentina.gob.ar Estudio Barrios Populares
            </ExternalLink>
          </FootnoteItem>
          <FootnoteItem id={5}>
            <ExternalLink href="https://arxiv.org/html/2508.12872">
              Okyere et al. (2025)
            </ExternalLink>
            {" — "}{t("footnotes.fn5")}
          </FootnoteItem>
          <FootnoteItem id={6}>
            <ExternalLink href="https://www.sciencedirect.com/science/article/pii/S0264275124000532">
              Vergara-Perucich et al. (2024)
            </ExternalLink>
            {" — "}{t("footnotes.fn6")}
          </FootnoteItem>
        </ol>
      </section>
    </div>
  );
}

function DataSourcesContent() {
  const t = useTranslations("modals.data");

  return (
    <div className="space-y-6">
      <p className="text-foreground/80 leading-relaxed">
        {t("intro")}
      </p>

      {/* Building Footprints */}
      <div className="bg-hinted/80 border border-muted rounded-lg p-4">
        <h3 className="text-base font-semibold text-foreground mb-2">
          {t("buildings.title")}
        </h3>
        <p className="text-sm text-secondary leading-relaxed mb-3">
          {t("buildings.description")}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <ExternalLink href="https://source.coop/vida/google-microsoft-osm-open-buildings">
            Source.Cooperative
          </ExternalLink>
          <ExternalLink href="https://sites.research.google/open-buildings/">
            Google Open Buildings
          </ExternalLink>
          <ExternalLink href="https://github.com/microsoft/GlobalMLBuildingFootprints">
            Microsoft Building Footprints
          </ExternalLink>
        </div>
      </div>

      {/* RENABAP */}
      <div className="bg-hinted/80 border border-muted rounded-lg p-4">
        <h3 className="text-base font-semibold text-foreground mb-2">
          {t("renabap.title")}
        </h3>
        <p className="text-sm text-secondary leading-relaxed mb-3">
          {t("renabap.description")}
        </p>
        <ExternalLink href="https://www.argentina.gob.ar/habitat/renabap">
          {t("renabap.link")}
        </ExternalLink>
      </div>

      {/* Technical details */}
      <div className="border-t border-border pt-4">
        <h4 className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">
          {t("technical.title")}
        </h4>
        <ul className="space-y-1 text-sm text-secondary">
          <li><span className="text-secondary">•</span> {t("technical.item1")}</li>
          <li><span className="text-secondary">•</span> {t("technical.item2")}</li>
          <li><span className="text-secondary">•</span> {t("technical.item3")}</li>
        </ul>
      </div>
    </div>
  );
}

export default function InfoModal({ type, onClose }: InfoModalProps) {
  const t = useTranslations("modals");

  if (!type) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

        {/* Modal - expanded size */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[70vh] bg-background border border-muted rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header - fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
            <h2 className="text-xl font-semibold text-foreground">
              {t(`${type}.title`)}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-secondary hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {type === "explainer" && <ExplainerContent />}
            {type === "data" && <DataSourcesContent />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
