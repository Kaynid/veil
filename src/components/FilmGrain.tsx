"use client";

import { useEffect, useRef } from "react";

export function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;
    const FPS = 24; // Cinematic frame rate for grain
    const interval = 1000 / FPS;

    const resize = () => {
      // Use lower resolution for performance
      canvas.width = window.innerWidth * 0.5;
      canvas.height = window.innerHeight * 0.5;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };

    const renderGrain = (timestamp: number) => {
      animationId = requestAnimationFrame(renderGrain);

      const delta = timestamp - lastTime;
      if (delta < interval) return;
      lastTime = timestamp - (delta % interval);

      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(renderGrain);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="film-grain" />;
}
