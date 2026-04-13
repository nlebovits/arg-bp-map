"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
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
              ? "bg-amber-500 w-6"
              : index < currentStep
                ? "bg-amber-500/50 hover:bg-amber-500/70"
                : "bg-neutral-600 hover:bg-neutral-500"
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
  conclusion: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Official data */}
        <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
          <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
            {label1}
          </p>
          <p className="text-2xl font-mono font-bold text-neutral-300">
            {value1}
          </p>
          {sub1 && (
            <p className="text-xs text-neutral-500 mt-1">{sub1}</p>
          )}
        </div>

        {/* Satellite data */}
        <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
          <p className="text-[10px] font-mono uppercase tracking-wider text-amber-500/70 mb-1">
            {label2}
          </p>
          <p className="text-2xl font-mono font-bold text-amber-500">
            {value2}
          </p>
          {sub2 && (
            <p className="text-xs text-amber-500/70 mt-1">{sub2}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-neutral-300 leading-relaxed bg-red-500/10 border border-red-500/20 rounded-lg p-3">
        {conclusion}
      </p>
    </div>
  );
}

// Step 1: The Hook
function Step1Content() {
  const t = useTranslations("tutorial.step1");

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-amber-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-mono font-semibold text-neutral-100">
        {t("title")}
      </h2>

      <p className="text-neutral-400 leading-relaxed whitespace-pre-line max-w-sm mx-auto">
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
      <h2 className="text-xl font-mono font-semibold text-neutral-100 text-center">
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
        <h2 className="text-xl font-mono font-semibold text-neutral-100">
          {t("title")}
        </h2>
        <p className="text-xs text-neutral-500 mt-1 font-mono">
          Los Hornos, La Plata
        </p>
      </div>

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

// Step 4: National scale
function Step4Content() {
  const t = useTranslations("tutorial.step4");

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-mono font-semibold text-neutral-100 text-center">
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
      <h2 className="text-xl font-mono font-semibold text-neutral-100 text-center">
        {t("title")}
      </h2>

      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
          <span className="text-lg">🔍</span>
          <span className="text-sm text-neutral-300">{t("feature1")}</span>
        </div>
        <div className="flex items-center gap-3 bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
          <span className="text-lg">📊</span>
          <span className="text-sm text-neutral-300">{t("feature2")}</span>
        </div>
        <div className="flex items-center gap-3 bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
          <span className="text-lg">🗺️</span>
          <span className="text-sm text-neutral-300">{t("feature3")}</span>
        </div>
      </div>

      {/* Source.Cooperative attribution */}
      <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 rounded-lg p-4 border border-amber-500/20">
        <p className="text-xs text-neutral-400 text-center">
          {t("dataSource")}{" "}
          <a
            href="https://source.coop/vida/google-microsoft-osm-open-buildings"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 font-medium underline underline-offset-2"
          >
            {t("sourceCoopLink")}
          </a>
        </p>
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
        className="relative w-full max-w-md mx-4 bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
      >
        {/* Close button (top right) */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-md transition-colors z-10"
          aria-label={t("skip")}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
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
                className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-200 border border-neutral-700 hover:border-neutral-500 rounded-lg transition-colors"
                aria-label={t("back")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {isLastStep ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 text-sm font-mono font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-900 transition-colors"
              >
                {t("start")}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-9 h-9 flex items-center justify-center bg-neutral-700 hover:bg-neutral-600 text-neutral-100 rounded-lg transition-colors"
                aria-label={t("next")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Don't show again checkbox - only on last step */}
          {isLastStep && (
            <label className="flex items-center justify-center gap-2 text-xs text-neutral-500 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                onChange={(e) => {
                  if (!e.target.checked) {
                    // If unchecked, they want to see it again
                    setTutorialSeen(false);
                  }
                }}
                className="w-3.5 h-3.5 rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
              />
              <span>{t("dontShowAgain")}</span>
            </label>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
