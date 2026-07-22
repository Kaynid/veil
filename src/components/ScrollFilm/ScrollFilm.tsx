"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EditorialOverlay } from "./EditorialOverlay";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TOTAL_FRAMES = 210;
const SCROLL_HEIGHT = 8000; // px of scroll for the film

interface ScrollFilmProps {
  isReady: boolean;
}

// Generate frame paths
function getFramePath(index: number): string {
  const num = String(index).padStart(3, "0");
  return `/images/frames/ezgif-frame-${num}.jpg`;
}

export function ScrollFilm({ isReady }: ScrollFilmProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ current: 0 });
  const [framesLoaded, setFramesLoaded] = useState(false);
  const progressRef = useRef(0);

  // Preload frames sequentially
  useEffect(() => {
    if (!isReady) return;

    const images: HTMLImageElement[] = [];

    // Load first frame immediately to unlock the UI
    const firstImg = new Image();
    firstImg.src = getFramePath(1);
    firstImg.onload = () => {
      images[0] = firstImg;
      imagesRef.current = images;
      setFramesLoaded(true); // Unlock UI

      // Load remaining frames sequentially in background to prevent memory/network crash
      let currentLoadIndex = 2;
      const loadNext = () => {
        if (currentLoadIndex > TOTAL_FRAMES) return;
        const img = new Image();
        img.src = getFramePath(currentLoadIndex);
        
        const handleDone = () => {
          currentLoadIndex++;
          // Small delay to allow browser to breathe
          setTimeout(loadNext, 10);
        };

        img.onload = () => {
          images[currentLoadIndex - 1] = img;
          handleDone();
        };
        img.onerror = handleDone;
      };
      loadNext();
    };
    firstImg.onerror = () => setFramesLoaded(true); // Fallback unlock
  }, [isReady]);

  // Draw a frame to canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img) return;

    // Cover-fit the image
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;

    let sx = 0,
      sy = 0,
      sw = img.width,
      sh = img.height;

    if (imgAspect > canvasAspect) {
      sw = img.height * canvasAspect;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / canvasAspect;
      sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  }, []);

  // Setup canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      // Redraw current frame
      if (imagesRef.current.length > 0) {
        drawFrame(Math.round(frameRef.current.current));
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  // GSAP ScrollTrigger for frame scrubbing
  useGSAP(
    () => {
      if (!framesLoaded || !sectionRef.current) return;

      // Draw first frame
      drawFrame(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${SCROLL_HEIGHT}`,
          pin: true,
          scrub: 0.5,
          snap: {
            snapTo: [0.05, 0.35, 0.60, 0.85], // Aligning roughly with the text stay intervals
            duration: { min: 0.2, max: 1.0 },
            delay: 0.1,
            ease: "power1.inOut"
          },
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      tl.to(
        frameRef.current,
        {
          current: TOTAL_FRAMES - 1,
          ease: "none",
          onUpdate: () => {
            drawFrame(Math.round(frameRef.current.current));
          },
        },
        0
      );

      // Brightness/contrast progression: images get cleaner as you scroll
      tl.fromTo(
        canvasRef.current,
        {
          filter: "brightness(0.85) contrast(1.05) saturate(0.9)",
        },
        {
          filter: "brightness(1.0) contrast(1.0) saturate(1.0)",
          ease: "none",
        },
        0
      );
    },
    { scope: sectionRef, dependencies: [framesLoaded] }
  );

  return (
    <section
      ref={sectionRef}
      className="scroll-film"
      id="scroll-film"
    >
      <div ref={stickyRef} className="scroll-film-sticky">
        <canvas ref={canvasRef} className="scroll-film-canvas" />

        {/* Cinematic radial shadow */}
        <div className="cinematic-shadow" />

        {/* Editorial typography overlays */}
        <EditorialOverlay sectionRef={sectionRef} />
      </div>
    </section>
  );
}
