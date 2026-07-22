"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PreloaderProps {
  progress: number;
  onComplete: () => void;
}

export function Preloader({ progress, onComplete }: PreloaderProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    // Smooth the progress counter
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        const target = Math.min(progress, 100);
        const diff = target - prev;
        if (diff <= 0) return prev;
        return prev + Math.max(1, diff * 0.1);
      });
    }, 30);

    return () => clearInterval(timer);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      // Allow a brief pause at 100% before transitioning
      const timeout = setTimeout(() => {
        setShouldExit(true);
        setTimeout(onComplete, 1200); // Wait for exit animation
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 1.2, ease: [0.85, 0, 0.15, 1] },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="preloader-text">VEIL.</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
      >
        <div className="preloader-bar-track">
          <div
            className="preloader-bar-fill"
            style={{ width: `${Math.round(displayProgress)}%` }}
          />
        </div>
        <div className="preloader-percentage">
          {String(Math.round(displayProgress)).padStart(3, "0")}
        </div>
      </motion.div>
    </motion.div>
  );
}
