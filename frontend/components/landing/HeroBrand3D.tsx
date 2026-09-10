"use client";

import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

interface HeroBrand3DProps {
  compact?: boolean;
}

export default function HeroBrand3D({ compact = false }: HeroBrand3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Smooth 3D tilt tracking with interpolation
  const [targetRotate, setTargetRotate] = useState({ x: 0, y: 0 });
  const [currentRotate, setCurrentRotate] = useState({ x: 0, y: 0 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [auraColorIndex, setAuraColorIndex] = useState(0);

  const auraGradients = [
    "from-blue-600/30 via-indigo-500/20 to-emerald-500/30",
    "from-emerald-500/30 via-cyan-500/20 to-blue-600/30",
    "from-indigo-600/30 via-purple-500/20 to-cyan-500/30",
  ];

  // Mouse move handler for smooth gyroscopic tilt & specular tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Fluid angle ranges
    const rotX = (0.5 - y) * 26;
    const rotY = (x - 0.5) * 30;

    setTargetRotate({ x: rotX, y: rotY });
    setLightPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTargetRotate({ x: 0, y: 0 });
    setLightPos({ x: 50, y: 50 });
    setIsHovered(false);
  };

  // Smooth spring damping loop for 60fps cinematic physics
  useEffect(() => {
    let animId: number;
    const updatePhysics = () => {
      setCurrentRotate((prev) => {
        const dx = targetRotate.x - prev.x;
        const dy = targetRotate.y - prev.y;
        return {
          x: prev.x + dx * 0.1,
          y: prev.y + dy * 0.1,
        };
      });
      animId = requestAnimationFrame(updatePhysics);
    };
    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [targetRotate]);

  // Click shockwave pulse
  const triggerShockwave = () => {
    setShockwaveActive(true);
    setAuraColorIndex((prev) => (prev + 1) % auraGradients.length);
    setTimeout(() => setShockwaveActive(false), 800);
  };

  // Canvas-based Cosmic Neural Dust and Light Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      hue: number;
    }> = [];

    const numParticles = compact ? 22 : 30;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        hue: Math.random() > 0.5 ? 220 : 160,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle luminous constellation threads
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.16 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw glowing particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, 0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [compact]);

  return (
    <div className="w-full max-w-md mx-auto select-none flex flex-col items-center justify-center">
      {/* 3D Perspective Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={triggerShockwave}
        className={`relative w-full ${
          compact ? "h-[320px] sm:h-[350px]" : "h-[360px] sm:h-[400px]"
        } perspective-container cursor-pointer group flex items-center justify-center`}
      >
        {/* Deep Radiant Nebula Glow */}
        <div
          className={`absolute -inset-4 rounded-full bg-gradient-to-tr ${auraGradients[auraColorIndex]} opacity-55 blur-2xl transition-all duration-1000 pointer-events-none ${
            isHovered ? "scale-110 opacity-80" : "scale-100"
          }`}
        />

        {/* Ambient Canvas Particle Field */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
        />

        {/* ================= 3D PRESERVE SPACE ================= */}
        <div
          className={`relative ${
            compact
              ? "w-[260px] h-[260px] sm:w-[290px] sm:h-[290px]"
              : "w-[290px] h-[290px] sm:w-[330px] sm:h-[330px]"
          } preserve-3d flex items-center justify-center transition-transform duration-75 ease-out`}
          style={{
            transform: `rotateX(${currentRotate.x}deg) rotateY(${currentRotate.y}deg)`,
          }}
        >
          {/* Ambient Outer Orbital Gyro Ring 1 */}
          <div
            className="absolute inset-0 rounded-full border border-accent-blue/30 animate-spin-slow-3d pointer-events-none"
            style={{
              boxShadow: "0 0 20px rgba(37, 99, 235, 0.15), inset 0 0 15px rgba(37, 99, 235, 0.1)",
            }}
          >
            {/* Luminous Orbital Satellite Dot */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-blue shadow-[0_0_12px_#2563EB] ring-2 ring-white/70" />
          </div>

          {/* Precision Gyro Ring 2 */}
          <div
            className="absolute inset-6 rounded-full border border-dashed border-emerald-500/40 animate-spin-reverse-3d pointer-events-none"
            style={{
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.15)",
            }}
          >
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981] ring-2 ring-white/70" />
          </div>

          {/* Pulsing Core Resonance Ring 3 */}
          <div
            className="absolute inset-12 rounded-full border border-indigo-400/30 animate-pulse-subtle pointer-events-none"
            style={{
              boxShadow: "inset 0 0 18px rgba(99, 102, 241, 0.2)",
            }}
          />

          {/* Interactive Click Shockwave Wavefront */}
          {shockwaveActive && (
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400/90 animate-ping pointer-events-none" />
          )}

          {/* ================= 3D SVG HOLOGRAPHIC SHIELD & ILLUMINATED LOGO ================= */}
          <div
            className="relative z-20 flex flex-col items-center justify-center preserve-3d transition-transform duration-300 group-hover:scale-105"
            style={{ transform: "translateZ(45px)" }}
          >
            {/* SVG Holographic Shield Grid & Geometric Truth Aura */}
            <svg
              className="absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)] pointer-events-none opacity-40 dark:opacity-55 animate-pulse-subtle -z-10"
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="120,24 205,66 205,174 120,216 35,174 35,66"
                stroke="url(#shieldGrad)"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              <polygon
                points="120,42 188,76 188,164 120,198 52,164 52,76"
                stroke="url(#shieldGrad2)"
                strokeWidth="1"
                opacity="0.6"
              />
              <circle cx="120" cy="120" r="62" stroke="#2563EB" strokeWidth="0.75" strokeOpacity="0.35" />
              <defs>
                <linearGradient id="shieldGrad" x1="35" y1="24" x2="205" y2="216" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="0.5" stopColor="#6366F1" />
                  <stop offset="1" stopColor="#10B981" />
                </linearGradient>
                <linearGradient id="shieldGrad2" x1="52" y1="42" x2="188" y2="198" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10B981" />
                  <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing Brand Backlight Aura */}
            <div
              className="absolute w-32 h-32 rounded-full bg-accent-blue/25 blur-xl pointer-events-none animate-pulse-subtle"
              style={{ transform: "translateZ(10px)" }}
            />

            {/* Well-proportioned, Floating Brand Logo in 3D Space */}
            <div
              className="relative z-30 flex items-center justify-center preserve-3d"
              style={{
                transform: "translateZ(35px)",
              }}
            >
              <img
                src="/logo.png"
                alt="SACHAAI Brand Logo"
                className={`${
                  compact ? "h-11 sm:h-13" : "h-13 sm:h-15 md:h-16"
                } w-auto object-contain dark:hidden drop-shadow-[0_10px_20px_rgba(0,122,255,0.28)] transition-transform duration-300`}
              />
              <img
                src="/logo-dark.png"
                alt="SACHAAI Brand Logo"
                className={`${
                  compact ? "h-11 sm:h-13" : "h-13 sm:h-15 md:h-16"
                } w-auto object-contain hidden dark:block drop-shadow-[0_12px_28px_rgba(37,99,235,0.5)] transition-transform duration-300`}
              />
            </div>
          </div>

          {/* Floating Orbiting Satellite Badges in 3D Depth */}
          <div
            className="absolute -top-1 -right-0.5 p-2 rounded-xl bg-card/85 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg text-accent-blue preserve-3d animate-float-slow"
            style={{
              transform: "translateZ(60px)",
              animationDuration: "5s",
            }}
          >
            <ShieldCheck className="h-4 w-4 text-accent-blue" />
          </div>

          <div
            className="absolute -bottom-0.5 -left-0.5 p-2 rounded-xl bg-card/85 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg text-emerald-500 preserve-3d animate-float-slow"
            style={{
              transform: "translateZ(55px)",
              animationDuration: "6s",
              animationDelay: "1s",
            }}
          >
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
