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

// Step indicator dots
function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <button
          key={index}
          onClick={() => onStepClick(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentStep
              ? "bg-accent w-6"
              : index < currentStep
                ? "bg-accent/50 hover:bg-accent/70"
                : "bg-muted hover:bg-secondary"
          }`}
          aria-label={`Go to step ${index + 1}`}
        />
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
        <div className="bg-hinted/50 rounded-lg p-4 border border-muted">
          <p className="text-sm font-sans uppercase tracking-wider text-secondary mb-1">
            {label1}
          </p>
          <p className="text-2xl font-sans font-bold text-foreground/80">
            {value1}
          </p>
          {sub1 && (
            <p className="text-sm text-secondary mt-1">{sub1}</p>
          )}
        </div>

        {/* Satellite data */}
        <div className="bg-accent-muted rounded-lg p-4 border border-accent/30">
          <p className="text-sm font-sans uppercase tracking-wider text-accent/70 mb-1">
            {label2}
          </p>
          <p className="text-2xl font-sans font-bold text-accent">
            {value2}
          </p>
          {sub2 && (
            <p className="text-sm text-accent/70 mt-1">{sub2}</p>
          )}
        </div>
      </div>

      {conclusion && (
        <p className="text-base text-foreground/80 leading-relaxed bg-cp-red/10 border border-cp-red/20 rounded-lg p-3">
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

      <h2 className="text-2xl font-sans font-semibold text-foreground">
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
      <h2 className="text-xl font-sans font-semibold text-foreground text-center">
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
        <h2 className="text-xl font-sans font-semibold text-foreground">
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
      <h2 className="text-xl font-sans font-semibold text-foreground text-center">
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
      <h2 className="text-xl font-sans font-semibold text-foreground text-center">
        {t("title")}
      </h2>

      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-hinted/50 rounded-lg p-3 border border-muted">
          <span className="text-lg">🔍</span>
          <span className="text-base text-foreground/80">{t("feature1")}</span>
        </div>
        <div className="flex items-center gap-3 bg-hinted/50 rounded-lg p-3 border border-muted">
          <span className="text-lg">📊</span>
          <span className="text-base text-foreground/80">{t("feature2")}</span>
        </div>
        <div className="flex items-center gap-3 bg-hinted/50 rounded-lg p-3 border border-muted">
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
        className="relative w-full max-w-md mx-4 bg-surface-raised/95 backdrop-blur-md border border-muted rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
      >
        {/* Close button (top right) */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-secondary hover:text-foreground/80 hover:bg-muted rounded-md transition-colors z-10"
          aria-label={t("skip")}
        >
<XMarkIcon className="w-4 h-4" />
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

        {/* Footer */}
        <div className="px-6 pb-5 space-y-4">
          {/* Step indicator */}
          <StepIndicator
            currentStep={tutorialStep}
            totalSteps={TUTORIAL_STEPS}
            onStepClick={handleStepClick}
          />

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-4">
            {!isFirstStep && (
              <button
                onClick={handleBack}
                className="w-9 h-9 flex items-center justify-center text-secondary hover:text-foreground border border-muted hover:border-secondary rounded-lg transition-colors"
                aria-label={t("back")}
              >
<ChevronLeftIcon className="w-4 h-4" />
              </button>
            )}
            {isLastStep ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 text-sm font-sans font-medium rounded-lg bg-accent hover:bg-accent-hover text-background transition-colors"
              >
                {t("start")}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-9 h-9 flex items-center justify-center bg-muted hover:bg-secondary text-foreground rounded-lg transition-colors"
                aria-label={t("next")}
              >
<ChevronRightIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Don't show again checkbox - only on last step */}
          {isLastStep && (
            <label className="flex items-center justify-center gap-2 text-sm text-secondary cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                onChange={(e) => {
                  if (!e.target.checked) {
                    // If unchecked, they want to see it again
                    setTutorialSeen(false);
                  }
                }}
                className="w-3.5 h-3.5 rounded border-muted bg-hinted text-accent focus:ring-accent focus:ring-offset-0"
              />
              <span>{t("dontShowAgain")}</span>
            </label>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
