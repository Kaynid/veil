"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { LenisProvider } from "@/components/LenisProvider";
import { Navigation } from "@/components/Navigation";
import { CustomCursor } from "@/components/CustomCursor";
import { FilmGrain } from "@/components/FilmGrain";
import { Preloader } from "@/components/Preloader";
import { Hero } from "@/components/Hero/Hero";
import { EditorialChapters } from "@/components/EditorialChapters/EditorialChapters";
import { VeilFooter } from "@/components/VeilFooter/VeilFooter";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLoaded = useCallback(() => {
    // hero images ready
  }, []);

  return (
    <LenisProvider>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader
            key="preloader"
            progress={loadProgress}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>

      <CustomCursor />
      <FilmGrain />
      <Navigation visible={!isLoading} />

      <main ref={containerRef}>
        <Hero
          onLoadProgress={setLoadProgress}
          onLoaded={handleLoaded}
          isReady={!isLoading}
        />
        <EditorialChapters />
        <VeilFooter />
      </main>
    </LenisProvider>
  );
}
