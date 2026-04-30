"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
      <ArrowTopRightOnSquareIcon className="inline-block w-3 h-3 ml-0.5 -mt-0.5" />
    </a>
  );
}

function FootnoteRef({ id }: { id: number }) {
  return (
    <sup>
      <a
        href={`#fn-${id}`}
        className="font-mono text-secondary hover:text-foreground no-underline ml-0.5"
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
      <span className="font-mono text-secondary mr-1">[{id}]</span>
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
        <p className="text-secondary leading-relaxed">
          {t("intro")}{" "}
          <ExternalLink href="https://nlebovits.github.io/posts/writing/informal-settlements-argentina/">
            {t("introLink")}
          </ExternalLink>
        </p>
      </section>

      {/* The Problem */}
      <section>
        <h3 className="font-sans font-bold text-2xl tracking-tight text-foreground mb-3">
          {t("problem.title")}
        </h3>
        <p className="text-secondary leading-relaxed mb-3">
          {t("problem.p1")}
        </p>
        <p className="text-secondary leading-relaxed">
          {t("problem.p2")}<FootnoteRef id={2} />
        </p>
      </section>

      {/* Key Findings */}
      <section>
        <h3 className="font-sans font-bold text-2xl tracking-tight text-foreground mb-4">
          {t("findings.title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stat 1: Official vs Actual */}
          <div className="bg-hinted/80 border border-border p-4 text-center">
            <div className="font-mono text-3xl font-bold text-foreground mb-1">+83%</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-secondary mb-2">{t("findings.stat1Label")}</div>
            <p className="text-sm text-secondary">{t("findings.stat1")}</p>
          </div>
          {/* Stat 2: Missing People */}
          <div className="bg-accent/10 border border-accent/30 p-4 text-center">
            <div className="font-mono text-3xl font-bold text-foreground mb-1">2.9–3.4M</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-secondary mb-2">{t("findings.stat2Label")}</div>
            <p className="text-sm text-secondary">{t("findings.stat2")}</p>
          </div>
          {/* Stat 3: Population Share */}
          <div className="bg-hinted/80 border border-border p-4 text-center">
            <div className="font-mono text-3xl font-bold text-foreground mb-1">6–7%</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-secondary mb-2">{t("findings.stat3Label")}</div>
            <p className="text-sm text-secondary">{t("findings.stat3")}</p>
          </div>
        </div>
        <p className="text-sm text-secondary mt-4 italic">
          {t("findings.source")}<FootnoteRef id={6} />
        </p>
      </section>

      {/* Methodology */}
      <section>
        <h3 className="font-sans font-bold text-2xl tracking-tight text-foreground mb-3">
          {t("methodology.title")}
        </h3>
        <p className="text-secondary leading-relaxed mb-3">
          {t("methodology.p1")}
        </p>
        <p className="text-secondary leading-relaxed">
          {t("methodology.p2")}
        </p>
        <p className="text-secondary leading-relaxed">
          {t("methodology.p2cont")}<FootnoteRef id={1} />
        </p>
      </section>

      {/* Why This Matters */}
      <section className="bg-accent/5 border border-accent/20 p-4">
        <h3 className="font-sans font-bold text-2xl tracking-tight text-foreground mb-3">
          {t("why.title")}
        </h3>
        <p className="text-secondary leading-relaxed mb-3">
          {t("why.p1")}
        </p>
        <p className="text-secondary leading-relaxed">
          {t("why.p2")}
        </p>
      </section>

      {/* Caveats */}
      <section>
        <h3 className="font-sans font-bold text-2xl tracking-tight text-foreground mb-3">
          {t("caveats.title")}
        </h3>
        <ul className="space-y-2 text-secondary text-sm leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1">•</span>
            <span>{t("caveats.item1")}</span>
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
        <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] font-bold text-foreground mb-3">
          {t("footnotes.title")}
        </h4>
        <ol className="space-y-2 list-none">
          <FootnoteItem id={1}>
            <ExternalLink href="https://doi.org/10.3390/urbansci5020048">
              Thomson et al. (2021)
            </ExternalLink>
            {" — "}{t("footnotes.fn1")}
          </FootnoteItem>
          <FootnoteItem id={2}>
            <ExternalLink href="https://www.argentina.gob.ar/sites/default/files/manual-para-la-conformacion-y-actualizacion-del-renabap.pdf">
              SISU (2023)
            </ExternalLink>
            {" — "}{t("footnotes.fn2")}
          </FootnoteItem>
          <FootnoteItem id={3}>
            <ExternalLink href="https://doi.org/10.1016/j.habitatint.2024.103056">
              Breuer et al. (2024)
            </ExternalLink>
            {" — "}{t("footnotes.fn3")}
          </FootnoteItem>
          <FootnoteItem id={4}>
            <ExternalLink href="https://doi.org/10.1038/s41467-022-29094-x">
              Boo et al. (2022)
            </ExternalLink>
            {" — "}{t("footnotes.fn4")}
          </FootnoteItem>
          <FootnoteItem id={5}>
            <ExternalLink href="https://censo.gob.ar/wp-content/uploads/2023/11/censo2022_condiciones_habitacionales.pdf">
              INDEC (2023)
            </ExternalLink>
            {"; "}
            <ExternalLink href="https://www.argentina.gob.ar/sites/default/files/informe_final-barrios_populares.pdf">
              SIEMPRO (2021)
            </ExternalLink>
            {" — "}{t("footnotes.fn5")}
          </FootnoteItem>
          <FootnoteItem id={6}>
            <ExternalLink href="https://ssrn.com/abstract=6588819">
              Lebovits (2026)
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
      <p className="text-secondary leading-relaxed">
        {t("intro")}
      </p>

      {/* Building Footprints */}
      <div className="bg-hinted/80 border border-border p-4">
        <h3 className="font-sans font-bold text-xl tracking-tight text-foreground mb-2">
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
      <div className="bg-hinted/80 border border-border p-4">
        <h3 className="font-sans font-bold text-xl tracking-tight text-foreground mb-2">
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
        <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] font-bold text-foreground mb-3">
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
  const tCommon = useTranslations("common");

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
          className="relative w-[90vw] md:w-[50vw] max-h-[80vh] bg-surface border border-border md:shadow-[4px_4px_0_var(--border)] overflow-hidden flex flex-col"
        >
          {/* Header - fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
            <h2 className="font-sans font-bold text-2xl tracking-tight text-foreground">
              {t(`${type}.title`)}
            </h2>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-secondary hover:text-foreground transition-colors"
              aria-label={tCommon("close")}
            >
              <XMarkIcon className="w-5 h-5" />
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
