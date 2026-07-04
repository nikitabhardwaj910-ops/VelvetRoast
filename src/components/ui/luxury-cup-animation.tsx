"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

interface BobaPearl {
  id: number;
  size: number;
  x: string;
  y: string;
  animClass: string;
  layer: "behind" | "front";
  parallaxFactor: number;
  opacity: number;
}

// 12 boba pearls positioned around the cup — some behind, some in front
const BOBA_PEARLS: BobaPearl[] = [
  // Behind-cup layer (lower z-index, subtler parallax)
  { id: 1, size: 42, x: "12%", y: "18%", animClass: "animate-boba-1", layer: "behind", parallaxFactor: 0.3, opacity: 0.75 },
  { id: 2, size: 28, x: "78%", y: "25%", animClass: "animate-boba-2", layer: "behind", parallaxFactor: 0.25, opacity: 0.65 },
  { id: 3, size: 18, x: "22%", y: "60%", animClass: "animate-boba-3", layer: "behind", parallaxFactor: 0.2, opacity: 0.55 },
  { id: 4, size: 35, x: "85%", y: "55%", animClass: "animate-boba-4", layer: "behind", parallaxFactor: 0.35, opacity: 0.7 },
  { id: 5, size: 22, x: "50%", y: "12%", animClass: "animate-boba-5", layer: "behind", parallaxFactor: 0.15, opacity: 0.5 },
  { id: 6, size: 15, x: "68%", y: "75%", animClass: "animate-boba-6", layer: "behind", parallaxFactor: 0.28, opacity: 0.6 },

  // Front-of-cup layer (higher z-index, stronger parallax for depth)
  { id: 7, size: 48, x: "8%", y: "38%", animClass: "animate-boba-7", layer: "front", parallaxFactor: 0.6, opacity: 0.9 },
  { id: 8, size: 32, x: "88%", y: "40%", animClass: "animate-boba-8", layer: "front", parallaxFactor: 0.55, opacity: 0.85 },
  { id: 9, size: 24, x: "18%", y: "78%", animClass: "animate-boba-1", layer: "front", parallaxFactor: 0.5, opacity: 0.8 },
  { id: 10, size: 38, x: "75%", y: "70%", animClass: "animate-boba-3", layer: "front", parallaxFactor: 0.65, opacity: 0.9 },
  { id: 11, size: 20, x: "35%", y: "85%", animClass: "animate-boba-5", layer: "front", parallaxFactor: 0.45, opacity: 0.75 },
  { id: 12, size: 14, x: "92%", y: "18%", animClass: "animate-boba-7", layer: "front", parallaxFactor: 0.4, opacity: 0.7 },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
  swirlSpeed: number;
  swirlOffset: number;
}

export default function LuxuryCupAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse tracking for 3D tilt + parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(mouseY, springConfig);
  const rotateY = useSpring(mouseX, springConfig);

  // Parallax offsets for pearl layers
  const parallaxX = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const parallaxY = useSpring(mouseY, { damping: 30, stiffness: 100 });

  // Different parallax intensities
  const behindX = useTransform(parallaxX, (v) => v * 0.4);
  const behindY = useTransform(parallaxY, (v) => v * 0.4);
  const frontX = useTransform(parallaxX, (v) => v * -0.8);
  const frontY = useTransform(parallaxY, (v) => v * -0.8);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = (e.clientX - centerX) / (rect.width / 2);
      const normY = (e.clientY - centerY) / (rect.height / 2);

      mouseX.set(normX * 12);
      mouseY.set(normY * -12);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  // Canvas steam/mist system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnParticle = () => {
      if (particles.length > 35) return;
      const cupTopY = canvas.height * 0.18;
      const cupCenterX = canvas.width * 0.5;

      particles.push({
        x: cupCenterX + (Math.random() - 0.5) * 70,
        y: cupTopY,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.8 + 0.5),
        radius: Math.random() * 18 + 12,
        alpha: 0,
        life: 0,
        maxLife: Math.random() * 130 + 100,
        swirlSpeed: Math.random() * 0.025 + 0.012,
        swirlOffset: Math.random() * Math.PI * 2,
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.25) {
        spawnParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        p.x += p.vx + Math.sin(p.life * p.swirlSpeed + p.swirlOffset) * 0.4;
        p.y += p.vy;
        p.radius += 0.18;

        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = (progress / 0.2) * 0.18;
        } else {
          p.alpha = (1 - (progress - 0.2) / 0.8) * 0.18;
        }

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(255, 243, 226, ${p.alpha})`);
        gradient.addColorStop(0.5, `rgba(196, 154, 108, ${p.alpha * 0.4})`);
        gradient.addColorStop(1, "rgba(255, 243, 226, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const behindPearls = BOBA_PEARLS.filter((p) => p.layer === "behind");
  const frontPearls = BOBA_PEARLS.filter((p) => p.layer === "front");

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[560px] md:h-[650px] flex items-center justify-center select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Background Golden Aura / Light Bloom */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
            opacity: [0.12, 0.3, 0.12],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full border border-dashed border-accent/20"
          style={{ animation: "orbit-spin 20s linear infinite" }}
        />
        <div className="absolute w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-tr from-[#C49A6C]/25 via-[#8F6B43]/12 to-transparent blur-[80px]" />
        {/* Secondary subtle bloom */}
        <div className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-b from-[#C49A6C]/8 via-transparent to-transparent blur-[100px]" />
      </div>

      {/* ═══ BEHIND-CUP BOBA PEARLS ═══ */}
      <motion.div
        style={{ x: behindX, y: behindY }}
        className="absolute inset-0 pointer-events-none z-10"
      >
        {behindPearls.map((pearl) => (
          <div
            key={pearl.id}
            className={`absolute boba-pearl ${pearl.animClass}`}
            style={{
              width: pearl.size,
              height: pearl.size,
              left: pearl.x,
              top: pearl.y,
              opacity: pearl.opacity,
            }}
          />
        ))}
      </motion.div>

      {/* ═══ MAIN CUP — 3D TILTING ═══ */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-20 w-[280px] h-[480px] sm:w-[320px] sm:h-[540px] md:w-[360px] md:h-[600px] flex items-center justify-center cursor-pointer group"
      >
        {/* Levitation Float */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotateZ: [-0.5, 0.5, -0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full h-full filter drop-shadow-[0_40px_60px_rgba(0,0,0,0.95)]"
        >
          <Image
            src="/images/luxebrew-cup-transparent.png"
            alt="Tall Luxury Transparent Iced Boba Coffee Cup with Condensation"
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 450px"
          />

          {/* Specular Glass Sheen Sweep */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-25 group-hover:opacity-50 transition-opacity duration-500">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ FRONT-OF-CUP BOBA PEARLS ═══ */}
      <motion.div
        style={{ x: frontX, y: frontY }}
        className="absolute inset-0 pointer-events-none z-30"
      >
        {frontPearls.map((pearl) => (
          <div
            key={pearl.id}
            className={`absolute boba-pearl ${pearl.animClass}`}
            style={{
              width: pearl.size,
              height: pearl.size,
              left: pearl.x,
              top: pearl.y,
              opacity: pearl.opacity,
            }}
          />
        ))}
      </motion.div>

      {/* Canvas Steam / Mist Plumes (above everything) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-40 w-full h-full"
      />
    </div>
  );
}
