import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "es" | "en";

interface AppState {
  // Tutorial state
  tutorialSeen: boolean;
  setTutorialSeen: (seen: boolean) => void;

  // Locale state
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Tutorial modal visibility (separate from "seen" for re-triggering)
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Tutorial - persisted
      tutorialSeen: false,
      setTutorialSeen: (seen) => set({ tutorialSeen: seen }),

      // Locale - persisted
      locale: "es",
      setLocale: (locale) => set({ locale }),

      // Tutorial visibility - not persisted (handled by partialize)
      showTutorial: false,
      setShowTutorial: (show) => set({ showTutorial: show }),
    }),
    {
      name: "arg-bp-map-storage",
      partialize: (state) => ({
        tutorialSeen: state.tutorialSeen,
        locale: state.locale,
      }),
    }
  )
);
