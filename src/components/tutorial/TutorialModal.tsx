"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  GlobeAltIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useMapStore, TUTORIAL_STEPS } from "@/lib/store";

// Step indicator dots - compact visual with reasonable tap targets
function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
  goToStepLabel,
}: {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  goToStepLabel: (step: number) => string;
}) {
  return (
    <div className="flex gap-0 justify-center">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <button
          key={index}
          onClick={() => onStepClick(index)}
          className="w-8 h-10 flex items-center justify-center"
          aria-label={goToStepLabel(index + 1)}
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              index === currentStep
                ? "bg-accent w-5 h-1.5"
                : index < currentStep
                  ? "bg-accent/50 hover:bg-accent/70 w-1.5 h-1.5"
                  : "bg-muted hover:bg-secondary w-1.5 h-1.5"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// Stat comparison block used in steps 2, 3, 4
function StatComparison({
  label1,
  value1,
  sub1,
  label2,
  value2,
  sub2,
  conclusion,
}: {
  label1: string;
  value1: string;
  sub1?: string;
  label2: string;
  value2: string;
  sub2?: string;
  conclusion?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Official data */}
        <div className="bg-hinted/50 p-4 border border-border">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] font-bold text-secondary mb-1">
            {label1}
          </p>
          <p className="font-mono text-2xl font-bold text-foreground/80">
            {value1}
          </p>
          {sub1 && (
            <p className="text-sm text-secondary mt-1">{sub1}</p>
          )}
        </div>

        {/* Satellite data */}
        <div className="bg-accent-muted p-4 border border-accent/30">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] font-bold text-accent-text/70 mb-1">
            {label2}
          </p>
          <p className="font-mono text-2xl font-bold text-accent-text">
            {value2}
          </p>
          {sub2 && (
            <p className="text-sm text-accent-text/70 mt-1">{sub2}</p>
          )}
        </div>
      </div>

      {conclusion && (
        <p className="text-base text-foreground/80 leading-relaxed bg-cp-red/10 border border-cp-red/20 p-3">
          {conclusion}
        </p>
      )}
    </div>
  );
}

// Step 1: The Hook
function Step1Content() {
  const t = useTranslations("tutorial.step1");

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-accent-muted rounded-full flex items-center justify-center">
        <GlobeAltIcon className="w-8 h-8 text-accent" />
      </div>

      <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground">
        {t("title")}
      </h2>

      <p className="text-secondary leading-relaxed whitespace-pre-line max-w-sm mx-auto">
        {t("description")}
      </p>
    </div>
  );
}

// Step 2: La Plata case study
function Step2Content() {
  const t = useTranslations("tutorial.step2");

  return (
    <div className="space-y-5">
      <h2 className="font-sans text-xl font-bold tracking-tight text-foreground text-center">
        {t("title")}
      </h2>

      <StatComparison
        label1={t("stat1Label")}
        value1={t("stat1Value")}
        sub1={t("stat1Sub")}
        label2={t("stat2Label")}
        value2={t("stat2Value")}
        sub2={t("stat2Sub")}
        conclusion={t("conclusion")}
      />
    </div>
  );
}

// Step 3: Barrio Sin Nombre
function Step3Content() {
  const t = useTranslations("tutorial.step3");

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="font-sans text-xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="text-sm text-secondary mt-1 font-sans">
          Los Hornos, La Plata
        </p>
      </div>

      <StatComparison
        label1={t("stat1Label")}
        value1={t("stat1Value")}
        label2={t("stat2Label")}
        value2={t("stat2Value")}
      />
    </div>
  );
}

// Step 4: National scale
function Step4Content() {
  const t = useTranslations("tutorial.step4");

  return (
    <div className="space-y-5">
      <h2 className="font-sans text-xl font-bold tracking-tight text-foreground text-center">
        {t("title")}
      </h2>

      <StatComparison
        label1={t("stat1Label")}
        value1={t("stat1Value")}
        label2={t("stat2Label")}
        value2={t("stat2Value")}
        conclusion={t("conclusion")}
      />
    </div>
  );
}

// Step 5: Features + CTA
function Step5Content() {
  const t = useTranslations("tutorial.step5");

  return (
    <div className="space-y-5">
      <h2 className="font-sans text-xl font-bold tracking-tight text-foreground text-center">
        {t("title")}
      </h2>

      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-hinted/50 p-3 border border-border">
          <span className="text-lg">🔍</span>
          <span className="text-base text-foreground/80">{t("feature1")}</span>
        </div>
        <div className="flex items-center gap-3 bg-hinted/50 p-3 border border-border">
          <span className="text-lg">📊</span>
          <span className="text-base text-foreground/80">{t("feature2")}</span>
        </div>
        <div className="flex items-center gap-3 bg-hinted/50 p-3 border border-border">
          <span className="text-lg">🗺️</span>
          <span className="text-base text-foreground/80">{t("feature3")}</span>
        </div>
      </div>

    </div>
  );
}

// Main tutorial modal component
export function TutorialModal() {
  const t = useTranslations("tutorial");

  const tutorialStep = useMapStore((s) => s.tutorialStep);
  const setTutorialStep = useMapStore((s) => s.setTutorialStep);
  const setTutorialSeen = useMapStore((s) => s.setTutorialSeen);
  const setShowTutorial = useMapStore((s) => s.setShowTutorial);
  const setTutorialActive = useMapStore((s) => s.setTutorialActive);
  const tutorialFlyTo = useMapStore((s) => s.tutorialFlyTo);

  const isFirstStep = tutorialStep === 0;
  const isLastStep = tutorialStep === TUTORIAL_STEPS - 1;

  // Fly to location when step changes
  useEffect(() => {
    tutorialFlyTo(tutorialStep);
  }, [tutorialStep, tutorialFlyTo]);

  const handleClose = useCallback(
    (markAsSeen: boolean) => {
      if (markAsSeen) {
        setTutorialSeen(true);
      }
      setShowTutorial(false);
      setTutorialActive(false);
      setTutorialStep(0);
    },
    [setTutorialSeen, setShowTutorial, setTutorialActive, setTutorialStep]
  );

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleClose(true);
    } else {
      setTutorialStep(tutorialStep + 1);
    }
  }, [isLastStep, handleClose, setTutorialStep, tutorialStep]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setTutorialStep(tutorialStep - 1);
    }
  }, [isFirstStep, setTutorialStep, tutorialStep]);

  const handleSkip = useCallback(() => {
    handleClose(true);
  }, [handleClose]);

  const handleStepClick = useCallback(
    (step: number) => {
      setTutorialStep(step);
    },
    [setTutorialStep]
  );

  // Render step content
  const renderStepContent = () => {
    switch (tutorialStep) {
      case 0:
        return <Step1Content />;
      case 1:
        return <Step2Content />;
      case 2:
        return <Step3Content />;
      case 3:
        return <Step4Content />;
      case 4:
        return <Step5Content />;
      default:
        return <Step1Content />;
    }
  };

  // Position card based on step:
  // - Steps 0 & 4 (hook & features): centered
  // - Steps 1, 2, 3 (map views): bottom-right corner so map is visible
  const isMapViewStep = tutorialStep >= 1 && tutorialStep <= 3;
  const positionClasses = isMapViewStep
    ? "items-end justify-end p-6" // bottom-right corner
    : "items-center justify-center"; // centered

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex pointer-events-none md:left-[380px] ${positionClasses}`}
    >
      {/* Tutorial card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md mx-4 bg-surface/95 backdrop-blur-md border border-border md:shadow-[4px_4px_0_var(--border)] overflow-hidden pointer-events-auto"
      >
        {/* Close button (top right) - min 44px touch target */}
        <button
          onClick={handleSkip}
          className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center text-secondary hover:text-foreground transition-colors z-10"
          aria-label={t("skip")}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Step content */}
        <div className="px-6 pt-8 pb-4 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={tutorialStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer - compact nav row: [←] [dots] [→] */}
        <div className="px-6 pb-5 space-y-3">
          {/* Navigation row with step indicator */}
          <div className="flex items-center justify-center">
            {/* Back arrow - subtle icon only, invisible on first step */}
            <button
              onClick={handleBack}
              disabled={isFirstStep}
              className={`w-11 h-11 flex items-center justify-center transition-colors ${
                isFirstStep
                  ? "text-transparent cursor-default"
                  : "text-secondary/40 hover:text-foreground"
              }`}
              aria-label={t("back")}
              aria-hidden={isFirstStep}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            {/* Step indicator dots */}
            <StepIndicator
              currentStep={tutorialStep}
              totalSteps={TUTORIAL_STEPS}
              onStepClick={handleStepClick}
              goToStepLabel={(step) => t("goToStep", { step })}
            />

            {/* Next arrow - subtle icon only, hidden on last step */}
            {!isLastStep ? (
              <button
                onClick={handleNext}
                className="w-11 h-11 flex items-center justify-center text-secondary/40 hover:text-foreground transition-colors"
                aria-label={t("next")}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-11" /> // Spacer for alignment
            )}
          </div>

          {/* Start button - only on last step */}
          {isLastStep && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 font-mono text-xs uppercase tracking-[0.1em] font-bold bg-accent hover:bg-accent-hover text-white transition-colors"
              >
                {t("start")}
              </button>
              <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setTutorialSeen(false);
                    }
                  }}
                  className="w-3.5 h-3.5 rounded-none border-border bg-hinted text-accent focus:ring-accent focus:ring-offset-0"
                />
                <span>{t("dontShowAgain")}</span>
              </label>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
