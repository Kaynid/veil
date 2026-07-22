"use client";

import { useEffect, useRef } from "react";

interface RevealCanvasProps {
  onLoadProgress: (progress: number) => void;
  onLoaded: () => void;
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 vUv;
  
  void main() {
    vUv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 vUv;
  
  uniform sampler2D u_frontImage;
  uniform sampler2D u_backImage;
  uniform vec2 u_mousePos;
  uniform float u_mouseActive;
  uniform vec2 u_resolution;
  uniform vec2 u_imageResolution;
  
  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / u_resolution.y;
    
    vec2 adjustedUV = vec2(uv.x * aspect, uv.y);
    vec2 adjustedMouse = vec2(u_mousePos.x * aspect, u_mousePos.y);
    
    float dist = distance(adjustedUV, adjustedMouse);
    float radius = 0.25; // Large, clean lens
    float softness = 0.08;
    
    // Circular mask
    float mask = smoothstep(radius, radius - softness, dist) * u_mouseActive;
    
    // Object-fit: cover logic for UVs
    vec2 ratio = vec2(
      min((u_resolution.x / u_resolution.y) / (u_imageResolution.x / u_imageResolution.y), 1.0),
      min((u_resolution.y / u_resolution.x) / (u_imageResolution.y / u_imageResolution.x), 1.0)
    );
    
    vec2 coverUV = vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    
    vec3 front = texture2D(u_frontImage, coverUV).rgb;
    vec3 back = texture2D(u_backImage, coverUV).rgb;
    
    // Pure, clean blend (no distortion)
    vec3 finalColor = mix(front, back, mask);
    
    // Very subtle vignette
    float vignette = 1.0 - smoothstep(0.4, 1.2, length((uv - 0.5) * vec2(1.2, 1.0)));
    finalColor *= mix(0.85, 1.0, vignette);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string
): WebGLProgram | null {
  const vert = createShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

function loadImageTexture(
  gl: WebGLRenderingContext,
  src: string
): Promise<{ texture: WebGLTexture; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Safari requires crossOrigin to be set for WebGL texImage2D
    img.crossOrigin = "";
    img.onload = () => {
      try {
        const tex = gl.createTexture();
        if (!tex) return reject(new Error("Failed to create texture"));
        
        // FIX: Flip image vertically to prevent upside-down textures
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        
        gl.bindTexture(gl.TEXTURE_2D, tex);
        
        // Safari fix: set texture parameters BEFORE uploading pixel data
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        resolve({ texture: tex, width: img.width, height: img.height });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export function RevealCanvas({ onLoadProgress, onLoaded }: RevealCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    
    if (!gl) {
      console.error("WebGL not supported");
      onLoadProgress(100);
      onLoaded();
      return;
    }

    let program: WebGLProgram | null = null;
    let frontTex: WebGLTexture | null = null;
    let backTex: WebGLTexture | null = null;
    let imageResolution = { width: 1920, height: 1080 }; // Default fallback
    let posBuffer: WebGLBuffer | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };

    const init = async () => {
      program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);

      if (!program) {
        onLoadProgress(100);
        onLoaded();
        return;
      }

      posBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      onLoadProgress(30);

      try {
        const frontResult = await loadImageTexture(gl, "/images/hero-front.jpg");
        frontTex = frontResult.texture;
        imageResolution = { width: frontResult.width, height: frontResult.height };
        
        onLoadProgress(65);
        
        const backResult = await loadImageTexture(gl, "/images/hero-back.jpg");
        backTex = backResult.texture;
        
        onLoadProgress(100);
        onLoaded();
      } catch (err) {
        console.error("Failed to load hero images:", err);
        onLoadProgress(100);
        onLoaded();
        return;
      }

      resize();
      window.addEventListener("resize", resize);
      render(0);
    };

    const render = (time: number) => {
      animFrameRef.current = requestAnimationFrame(render);

      if (!program || !frontTex || !backTex) return;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, frontTex);
      gl.uniform1i(gl.getUniformLocation(program, "u_frontImage"), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, backTex);
      gl.uniform1i(gl.getUniformLocation(program, "u_backImage"), 1);

      // WebGL expects y to grow upwards, so we invert the y axis from client coords
      gl.uniform2f(
        gl.getUniformLocation(program, "u_mousePos"),
        mouseRef.current.x,
        1.0 - mouseRef.current.y
      );
      gl.uniform1f(
        gl.getUniformLocation(program, "u_mouseActive"),
        mouseRef.current.active ? 1.0 : 0.0
      );
      gl.uniform2f(
        gl.getUniformLocation(program, "u_resolution"),
        canvas.width,
        canvas.height
      );
      gl.uniform2f(
        gl.getUniformLocation(program, "u_imageResolution"),
        imageResolution.width,
        imageResolution.height
      );

      const posLoc = gl.getAttribLocation(program, "a_position");
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!canvas || !e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.touches[0].clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.touches[0].clientY - rect.top) / rect.height;
    };

    const onMouseEnter = () => (mouseRef.current.active = true);
    const onMouseLeave = () => (mouseRef.current.active = false);

    const onTouchStart = (e: TouchEvent) => {
      mouseRef.current.active = true;
      onTouchMove(e);
    };
    const onTouchEnd = () => (mouseRef.current.active = false);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    init();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);

      if (frontTex) gl.deleteTexture(frontTex);
      if (backTex) gl.deleteTexture(backTex);
      if (program) gl.deleteProgram(program);
      if (posBuffer) gl.deleteBuffer(posBuffer);
    };
  }, [onLoadProgress, onLoaded]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
