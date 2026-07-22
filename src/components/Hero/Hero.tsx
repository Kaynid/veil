"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { RevealCanvas } from "./RevealCanvas";

interface HeroProps {
  onLoadProgress: (progress: number) => void;
  onLoaded: () => void;
  isReady: boolean;
}

export function Hero({ onLoadProgress, onLoaded, isReady }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring-smoothed mouse for typography parallax
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  // Typography parallax transforms
  const veilX = useTransform(springX, [0, 1], [10, -10]);
  const veilY = useTransform(springY, [0, 1], [5, -5]);
  const headlineX = useTransform(springX, [0, 1], [-5, 5]);
  const headlineY = useTransform(springY, [0, 1], [-3, 3]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  return (
    <section
      ref={containerRef}
      className="hero"
      onMouseMove={handleMouseMove}
      id="hero"
    >
      {/* WebGL Reveal Canvas */}
      <div className="hero-canvas-container">
        <RevealCanvas
          onLoadProgress={onLoadProgress}
          onLoaded={onLoaded}
        />
      </div>

      {/* Giant VEIL text — architecture */}
      <motion.div
        className="hero-typography"
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="hero-veil-text"
          style={{ x: veilX, y: veilY }}
        >
          VEIL.
        </motion.div>

        {/* Secondary architectural text */}
        <motion.div
          style={{
            position: "absolute",
            left: "5vw",
            top: "50%",
            transform: "translateY(-50%)",
            x: headlineX,
            y: headlineY,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: isReady ? 0.06 : 0,
              y: isReady ? 0 : 40,
            }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(60px, 8vw, 120px)",
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              textTransform: "uppercase" as const,
              color: "var(--text-primary)",
              userSelect: "none" as const,
            }}
          >
            DESIGNED
            <br />
            TO
            <br />
            BE
            <br />
            DISCOVERED
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Hero copy */}
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: isReady ? 1 : 0,
          y: isReady ? 0 : 30,
        }}
        transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="hero-headline">
          DESIGNED TO
          <br />
          BE REVEALED.
        </h1>
        <p className="hero-description">
          Every garment begins as mystery.
          <br />
          Every movement uncovers another layer.
          <br />
          A digital exhibition exploring fashion through interaction.
        </p>
        <div className="hero-ctas">
          <MagneticButton>
            <a href="#collections" className="btn-primary">
              <span>Explore Collection</span>
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href="#archive" className="btn-secondary">
              <span>View Archive</span>
              <span style={{ fontSize: 16 }}>→</span>
            </a>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}

/* ---- Magnetic Button Component ---- */
function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: "inline-block" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
