"use client";

import { useApp } from "@/context/app-context";
import { Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import LuxuryCupAnimation from "@/components/ui/luxury-cup-animation";

export default function HeroSection() {
  const { setIsReservationOpen } = useApp();
  const { scrollYProgress } = useScroll();

  // Scroll parallax depth effects
  const textY = useTransform(scrollYProgress, [0, 0.25], [0, -160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.1]);
  const cupScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.9]);
  const cupY = useTransform(scrollYProgress, [0, 0.25], [0, 80]);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 pb-12 flex flex-col items-center justify-center overflow-hidden bg-[#000000]"
    >
      {/* Background: Pitch Black with Subtle Radial Studio Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_var(--tw-gradient-stops))] from-[#1F160E] via-[#0A0A0A] to-[#000000] -z-20" />

      {/* ─── Large Serif Typography ── layered behind & around the cup ─── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Huge Gold Serif Typography — the centerpiece text behind the cup */}
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] font-normal tracking-wider text-gold-gradient leading-none select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]">
            THE ART OF THE ROAST
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-cream/70 font-light tracking-wide max-w-2xl mx-auto pt-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
            Hand-picked single-origin micro-lots, cold-steeped to velvet perfection at 9-bar pressure.
          </p>
        </motion.div>
      </div>

      {/* ─── CENTERED 3D CUP + FLOATING BOBA PEARLS (Background Layer) ─── */}
      <motion.div style={{ scale: cupScale, y: cupY }} className="absolute inset-0 z-5 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <LuxuryCupAnimation />
        </div>
      </motion.div>

      {/* ─── Action Buttons ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-4 pointer-events-auto"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(196, 154, 108, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsReservationOpen(true)}
          className="px-8 py-4 rounded-full bg-gold-gradient text-primary font-semibold text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Reserve VIP Table
        </motion.button>
        <motion.a
          whileHover={{ scale: 1.05, borderColor: "#C49A6C", backgroundColor: "rgba(196, 154, 108, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          href="#menu"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-8 py-4 rounded-full glass-panel border border-accent/40 text-cream text-xs uppercase font-semibold tracking-widest transition-all duration-300 block"
        >
          Explore Tasting Menu
        </motion.a>
      </motion.div>

      {/* ─── Scroll to Explore Indicator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-auto"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
          SCROLL TO EXPLORE
        </span>
      </motion.div>
    </section>
  );
}
