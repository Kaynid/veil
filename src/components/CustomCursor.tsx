"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    if (!cursorRef.current) return;

    // Disable on touch devices
    if ("ontouchstart" in window) {
      cursorRef.current.style.display = "none";
      return;
    }

    quickX.current = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.12,
      ease: "power3",
    });
    quickY.current = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.12,
      ease: "power3",
    });

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      quickX.current?.(e.clientX);
      quickY.current?.(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "24px",
        height: "24px",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-4px, -2px)",
        willChange: "transform",
        mixBlendMode: "difference",
      }}
    >
      {/* Arrow SVG — matches macOS default arrow shape but white */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
      >
        <path
          d="M5 2L5 19.5L9.5 15L14.5 22L17 20.5L12 13.5L18 13L5 2Z"
          fill="white"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
