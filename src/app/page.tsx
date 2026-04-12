"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { TutorialModal } from "@/components/tutorial/TutorialModal";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  const { tutorialSeen, showTutorial, setShowTutorial } = useStore();

  // Show tutorial on first visit (after hydration)
  useEffect(() => {
    if (!tutorialSeen) {
      setShowTutorial(true);
    }
  }, [tutorialSeen, setShowTutorial]);

  return (
    <div className="flex flex-1 min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main map area placeholder */}
      <main className="flex-1 ml-64">
        <div className="h-full flex items-center justify-center text-zinc-600">
          <div className="text-center">
            <p className="font-mono text-lg">Map viewport</p>
            <p className="text-sm mt-2">Building footprints will render here</p>
          </div>
        </div>
      </main>

      {/* Tutorial modal */}
      <AnimatePresence>
        {showTutorial && <TutorialModal />}
      </AnimatePresence>
    </div>
  );
}
