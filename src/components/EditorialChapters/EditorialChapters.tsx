"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAMES_PER_CHAPTER = 50;

const chapters = [
  {
    id: 1,
    folder: "chapter1",
    eyebrow: "Chapter One",
    headline: "HIDDEN IN\nPLAIN SIGHT.",
    body: [
      "Every silhouette begins as an idea before it becomes a garment.",
      "VEIL explores the space between identity and expression,",
      "where every movement reveals another layer.",
    ],
    layout: "media-left" as const,
  },
  {
    id: 2,
    folder: "chapter2",
    eyebrow: "Chapter Two",
    headline: "CRAFTED TO\nBE DISCOVERED.",
    body: [
      "Luxury is not decoration.",
      "It is precision.",
      "Every fold, stitch and proportion is considered until nothing unnecessary remains.",
    ],
    layout: "media-right" as const,
  },
  {
    id: 3,
    folder: "chapter3",
    eyebrow: "Chapter Three",
    headline: "MOTION\nDEFINES FORM.",
    body: [
      "Garments should never be experienced standing still.",
      "Every frame captures a different perspective.",
      "Movement completes the design.",
    ],
    layout: "media-left" as const,
  },
  {
    id: 4,
    folder: "chapter4",
    eyebrow: "Chapter Four",
    headline: "LESS NOISE.\nMORE PRESENCE.",
    body: [
      "The strongest designs never compete for attention.",
      "They quietly command it.",
      "Confidence exists in restraint.",
    ],
    layout: "media-right" as const,
  },
  {
    id: 5,
    folder: "chapter5",
    eyebrow: "Chapter Five",
    headline: "THE COLLECTION\nIS THE STORY.",
    body: [
      "Every interaction reveals another chapter.",
      "Nothing appears immediately.",
      "Discovery becomes part of the experience.",
    ],
    layout: "media-left" as const,
  },
  {
    id: 6,
    folder: "chapter1", // reuse chapter1 frames for chapter 6 as bonus
    eyebrow: "Chapter Six",
    headline: "NOTHING\nENDS HERE.",
    body: [
      "The campaign becomes the collection.",
      "The collection becomes the archive.",
      "Every scroll leads to another beginning.",
    ],
    layout: "media-right" as const,
  },
];

// ── Single Chapter Panel ───────────────────────────────────────────────────────
function ChapterPanel({ chapter }: { chapter: typeof chapters[0] }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ current: 0 });
  const [framesReady, setFramesReady] = useState(false);
  const isInView = useInView(panelRef, { once: false, margin: "-10%" });

  // Draw frame
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img) return;

    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.naturalWidth / img.naturalHeight;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (imgAspect > canvasAspect) {
      sw = img.naturalHeight * canvasAspect;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / canvasAspect;
      sy = (img.naturalHeight - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  }, []);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      if (imagesRef.current[Math.round(frameRef.current.current)]) {
        drawFrame(Math.round(frameRef.current.current));
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  // Sequential preload — first frame unlocks, rest load quietly
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    const first = new Image();
    first.src = `/images/${chapter.folder}/ezgif-frame-001.jpg`;
    first.onload = () => {
      images[0] = first;
      imagesRef.current = images;
      setFramesReady(true);
      drawFrame(0);

      let idx = 2;
      const loadNext = () => {
        if (idx > FRAMES_PER_CHAPTER) return;
        const img = new Image();
        img.src = `/images/${chapter.folder}/ezgif-frame-${String(idx).padStart(3, "0")}.jpg`;
        const done = () => { idx++; setTimeout(loadNext, 8); };
        img.onload = () => { images[idx - 1] = img; done(); };
        img.onerror = done;
      };
      loadNext();
    };
    first.onerror = () => setFramesReady(true);
  }, [chapter.folder, drawFrame]);

  // GSAP scroll scrub per panel
  useGSAP(
    () => {
      if (!framesReady || !panelRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.6,
        },
      });

      tl.to(frameRef.current, {
        current: FRAMES_PER_CHAPTER - 1,
        ease: "none",
        onUpdate: () => drawFrame(Math.round(frameRef.current.current)),
      });
    },
    { scope: panelRef, dependencies: [framesReady] }
  );

  const isMediaLeft = chapter.layout === "media-left";

  return (
    <motion.div
      ref={panelRef}
      className="chapter-panel-grid"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Media Panel */}
      <div
        className="chapter-media-panel"
        style={{
          order: isMediaLeft ? 1 : 2,
        }}
      >
        {/* Outer bezel */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "4px",
          background: "rgba(61, 21, 32, 0.3)",
          border: "1px solid rgba(196, 192, 188, 0.08)",
          zIndex: 2,
          pointerEvents: "none",
        }} />
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            borderRadius: "4px",
          }}
        />
        {/* Bottom gradient for integration */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to top, rgba(10, 5, 6, 0.6), transparent)",
          zIndex: 3,
          pointerEvents: "none",
        }} />

        {/* Chapter eyebrow inside panel */}
        <div style={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 4,
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(196, 192, 188, 0.6)",
        }}>
          {chapter.eyebrow}
        </div>
      </div>

      {/* Typography Panel */}
      <div
        className="chapter-text-panel"
        style={{
          order: isMediaLeft ? 2 : 1,
        }}
      >
        {/* Hairline accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            height: "1px",
            width: "48px",
            background: "rgba(196, 192, 188, 0.4)",
            marginBottom: "32px",
            transformOrigin: "left center",
          }}
        />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 5vw, 80px)",
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            whiteSpace: "pre-line",
            marginBottom: "clamp(24px, 3vh, 48px)",
          }}
        >
          {chapter.headline}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          {chapter.body.map((line, i) => (
            <p key={i} style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(14px, 1.1vw, 17px)",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "rgba(138, 131, 133, 0.9)",
            }}>
              {line}
            </p>
          ))}
        </motion.div>

        {/* Chapter number — large ghost */}
        <div style={{
          position: "absolute",
          [isMediaLeft ? "right" : "left"]: "-2vw",
          bottom: "-20px",
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(80px, 12vw, 180px)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "rgba(61, 21, 32, 0.25)",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}>
          0{chapter.id}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Editorial Chapters Component ─────────────────────────────────────────
export function EditorialChapters() {
  return (
    <section
      id="chapters"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 30%, var(--bg-primary) 100%)",
        paddingTop: "clamp(80px, 12vh, 160px)",
        paddingBottom: "clamp(80px, 12vh, 160px)",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric lighting — matches hero */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(61, 21, 32, 0.35) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      {/* Bottom atmospheric fade */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "200px",
        background: "linear-gradient(to top, rgba(10, 5, 6, 0.8), transparent)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Section intro */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          marginBottom: "clamp(80px, 12vh, 140px)",
          padding: "0 4vw",
        }}
      >
        <div style={{
          display: "inline-block",
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(196, 192, 188, 0.5)",
          marginBottom: "24px",
          padding: "8px 20px",
          border: "1px solid rgba(196, 192, 188, 0.12)",
          borderRadius: "999px",
        }}>
          SS26 Campaign
        </div>
        <h2 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(14px, 2vw, 28px)",
          fontWeight: 400,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(245, 240, 236, 0.4)",
        }}>
          The Editorial
        </h2>
      </motion.div>

      {/* Chapters */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        {chapters.map((chapter) => (
          <ChapterPanel key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </section>
  );
}
