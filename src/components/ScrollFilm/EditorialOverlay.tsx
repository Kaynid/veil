"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface EditorialOverlayProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

interface StoryBlock {
  eyebrow: string;
  heading: string;
  body: string[];
  position: "left" | "right" | "center";
  productCard?: {
    image: string;
    title: string;
    price: string;
  };
}

const storyBlocks: StoryBlock[] = [
  {
    eyebrow: "01 — Philosophy",
    heading: "OUR\nPHILOSOPHY",
    body: [
      "We don't design garments.",
      "We design moments between",
      "identity and expression.",
    ],
    position: "left",
    productCard: {
      image: "/tempImageNmEpvw.heic_2K_202607182217.jpeg", // Placeholder for user uploaded file
      title: "Deconstructed Blazer",
      price: "€1,890"
    }
  },
  {
    eyebrow: "02 — Craft",
    heading: "CRAFT",
    body: [
      "Every seam.",
      "Every fold.",
      "Created with precision.",
    ],
    position: "right",
    productCard: {
      image: "/tempImageRv69yI.heic_2K_202607182225.jpeg",
      title: "Sculptural Trousers",
      price: "€1,120"
    }
  },
  {
    eyebrow: "03 — Process",
    heading: "PROCESS",
    body: [
      "Nothing appears immediately.",
      "Everything unfolds.",
    ],
    position: "left",
    productCard: {
      image: "/images/frames/ezgif-frame-100.jpg",
      title: "Layered Denim Jacket",
      price: "€2,240"
    }
  },
  {
    eyebrow: "04 — Design",
    heading: "DESIGN",
    body: [
      "Fashion is temporary.",
      "Design is permanent.",
    ],
    position: "right",
    productCard: {
      image: "/images/frames/ezgif-frame-150.jpg",
      title: "Architectural Vest",
      price: "€1,460"
    }
  },
];

export function EditorialOverlay({ sectionRef }: EditorialOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!sectionRef.current || !overlayRef.current) return;

      const blocks = blockRefs.current.filter(Boolean);
      if (blocks.length === 0) return;

      // Each block occupies 25% of the scroll
      blocks.forEach((block, i) => {
        if (!block) return;

        const startPercent = i * 0.25;
        const fadeInEnd = startPercent + 0.05;
        const stayEnd = startPercent + 0.20;
        const fadeOutEnd = startPercent + 0.25;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=8000",
            scrub: 0.3,
          },
        });

        // Fade block in and out
        tl.fromTo(block, { opacity: 0 }, { opacity: 1, duration: fadeInEnd - startPercent, ease: "none" }, startPercent);
        tl.to(block, { opacity: 0, duration: fadeOutEnd - stayEnd, ease: "none" }, stayEnd);
        
        // Parallax elements inside
        const textWrapper = block.querySelector(".text-wrapper");
        const cardWrapper = block.querySelector(".card-wrapper");
        
        if (textWrapper) {
          tl.fromTo(textWrapper, { y: 60 }, { y: -30, duration: stayEnd - startPercent, ease: "none" }, startPercent);
        }
        if (cardWrapper) {
          tl.fromTo(cardWrapper, { y: 120 }, { y: -60, duration: stayEnd - startPercent, ease: "none" }, startPercent);
        }
      });
    },
    { scope: overlayRef, dependencies: [] }
  );

  return (
    <div ref={overlayRef} className="scroll-film-overlay">
      {storyBlocks.map((block, i) => (
        <div
          key={i}
          ref={(el) => { blockRefs.current[i] = el; }}
          className="editorial-block"
          style={{ 
            opacity: 0, 
            display: "flex",
            flexDirection: block.position === "left" ? "row" : "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 8vw",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none" // Allow scrubbing through
          }}
        >
          {/* Typography Side */}
          <div className="text-wrapper" style={{ flex: 1, maxWidth: 500, pointerEvents: "auto" }}>
            <div className="eyebrow" style={{ 
              marginBottom: 24, 
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>
              {block.eyebrow}
            </div>
            
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(60px, 8vw, 120px)",
              lineHeight: 0.9,
              fontWeight: 800,
              textTransform: "uppercase",
              whiteSpace: "pre-line"
            }}>
              {block.heading}
            </h2>

            <div style={{ marginTop: 32, fontSize: 18, color: "rgba(255,255,255,0.7)" }}>
              {block.body.map((line, j) => (
                <div key={j}>{line}</div>
              ))}
            </div>
          </div>

          {/* Product Card Side (Double-Bezel Architecture) */}
          {block.productCard && (
            <div className="card-wrapper" style={{ flex: 1, display: "flex", justifyContent: "center", pointerEvents: "auto" }}>
              <div style={{ width: "100%", maxWidth: 400 }}>
                {/* Outer Shell */}
                <div style={{
                  padding: "8px",
                  borderRadius: "2rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.4)"
                }}>
                  {/* Inner Core */}
                  <div style={{
                    borderRadius: "calc(2rem - 8px)",
                    background: "rgba(5, 5, 5, 0.8)",
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.15)",
                    overflow: "hidden",
                    aspectRatio: "3/4",
                    position: "relative"
                  }}>
                    <img 
                      src={block.productCard.image} 
                      alt={block.productCard.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.8, // Slightly dimmed to feel like frosted glass overlay
                        mixBlendMode: "luminosity"
                      }}
                      onError={(e) => {
                        // Fallback if image not found
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Fallback wireframe if image fails */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: -1
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                        <path d="M4 4h16v16H4z" />
                        <path d="M4 4l16 16" />
                        <path d="M20 4L4 20" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Product Meta */}
                <div style={{ marginTop: 24, paddingLeft: 8 }}>
                  <div style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 24,
                    fontWeight: 600,
                  }}>
                    {block.productCard.title}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    color: "rgba(255,255,255,0.6)",
                    marginTop: 4
                  }}>
                    {block.productCard.price}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
