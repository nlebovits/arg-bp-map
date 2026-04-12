"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type Locale } from "@/lib/store";

interface SlideContent {
  title: string;
  description: string;
  illustration: string;
}

const SLIDES: Record<Locale, SlideContent[]> = {
  es: [
    {
      title: "Bienvenido",
      description:
        "Explora las huellas de edificios en asentamientos informales de Argentina.",
      illustration: "map",
    },
    {
      title: "Cómo usar",
      description:
        "Alterna capas, busca ubicaciones y haz zoom para ver los edificios en detalle.",
      illustration: "layers",
    },
    {
      title: "Los datos",
      description:
        "33.8M de edificios detectados por imágenes satelitales vs datos oficiales de RENABAP.",
      illustration: "data",
    },
    {
      title: "Comienza",
      description:
        "Haz zoom en cualquier asentamiento para comenzar a explorar.",
      illustration: "start",
    },
  ],
  en: [
    {
      title: "Welcome",
      description:
        "Explore building footprints in informal settlements across Argentina.",
      illustration: "map",
    },
    {
      title: "How to use",
      description:
        "Toggle layers, search locations, and zoom in to see buildings in detail.",
      illustration: "layers",
    },
    {
      title: "The data",
      description:
        "33.8M buildings detected from satellite imagery vs official RENABAP data.",
      illustration: "data",
    },
    {
      title: "Get started",
      description: "Zoom into any settlement to begin exploring.",
      illustration: "start",
    },
  ],
};

const BUTTON_LABELS: Record<Locale, { next: string; skip: string; start: string; dontShow: string }> = {
  es: {
    next: "Siguiente",
    skip: "Omitir",
    start: "Comenzar",
    dontShow: "No mostrar de nuevo",
  },
  en: {
    next: "Next",
    skip: "Skip",
    start: "Get Started",
    dontShow: "Don't show again",
  },
};

function SlideIllustration({ type }: { type: string }) {
  const iconClasses = "w-16 h-16 text-amber-500";

  switch (type) {
    case "map":
      return (
        <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case "layers":
      return (
        <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case "data":
      return (
        <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "start":
      return (
        <svg className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
        </svg>
      );
    default:
      return null;
  }
}

export function TutorialModal() {
  const { locale, setTutorialSeen, setShowTutorial } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);

  const slides = SLIDES[locale];
  const labels = BUTTON_LABELS[locale];
  const isLastSlide = currentSlide === slides.length - 1;

  const handleClose = useCallback(() => {
    if (dontShowAgain) {
      setTutorialSeen(true);
    }
    setShowTutorial(false);
  }, [dontShowAgain, setTutorialSeen, setShowTutorial]);

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      handleClose();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [isLastSlide, handleClose]);

  const handleSkip = useCallback(() => {
    setTutorialSeen(true);
    setShowTutorial(false);
  }, [setTutorialSeen, setShowTutorial]);

  const currentContent = slides[currentSlide];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md mx-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-amber-500"
                  : "bg-zinc-600 hover:bg-zinc-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide content */}
        <div className="px-8 pt-12 pb-6 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              {/* Illustration */}
              <div className="mb-6 p-4 bg-zinc-800/50 rounded-full">
                <SlideIllustration type={currentContent.illustration} />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-mono font-semibold text-zinc-100 mb-3">
                {currentContent.title}
              </h2>

              {/* Description */}
              <p className="text-zinc-400 leading-relaxed">
                {currentContent.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 space-y-4">
          {/* Don't show again checkbox - only on last slide */}
          {isLastSlide && (
            <label className="flex items-center justify-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
              />
              <span>{labels.dontShow}</span>
            </label>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {!isLastSlide && (
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {labels.skip}
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2.5 text-sm font-medium bg-amber-600 hover:bg-amber-500 text-zinc-900 rounded-lg transition-colors"
            >
              {isLastSlide ? labels.start : labels.next}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
