"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const prevPos = useRef({ x: 0, y: 0 });
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const ringQuickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const ringQuickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    if (!cursorRef.current || !ringRef.current) return;

    // Check for touch device
    if ("ontouchstart" in window) {
      cursorRef.current.style.display = "none";
      ringRef.current.style.display = "none";
      return;
    }

    quickX.current = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.15,
      ease: "power3",
    });
    quickY.current = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.15,
      ease: "power3",
    });
    ringQuickX.current = gsap.quickTo(ringRef.current, "x", {
      duration: 0.5,
      ease: "power3",
    });
    ringQuickY.current = gsap.quickTo(ringRef.current, "y", {
      duration: 0.5,
      ease: "power3",
    });

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Calculate velocity for cursor stretching
      vel.current = {
        x: e.clientX - prevPos.current.x,
        y: e.clientY - prevPos.current.y,
      };
      prevPos.current = { x: e.clientX, y: e.clientY };

      quickX.current?.(e.clientX);
      quickY.current?.(e.clientY);
      ringQuickX.current?.(e.clientX);
      ringQuickY.current?.(e.clientY);

      // Velocity-based stretching
      const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
      const angle = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI);
      const stretch = Math.min(speed * 0.04, 0.6);

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scaleX: 1 + stretch,
          scaleY: 1 - stretch * 0.3,
          rotation: angle,
          duration: 0.15,
          ease: "power2.out",
        });
      }
    };

    // Hover state for interactive elements
    const onMouseEnterInteractive = () => {
      ringRef.current?.classList.add("hovering");
      gsap.to(cursorRef.current, {
        scale: 0.5,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onMouseLeaveInteractive = () => {
      ringRef.current?.classList.remove("hovering");
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Add hover listeners to interactive elements
    const interactives = document.querySelectorAll(
      "a, button, [role='button'], .hero-canvas-container"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterInteractive);
      el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
