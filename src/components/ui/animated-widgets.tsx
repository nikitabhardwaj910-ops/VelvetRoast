"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp, Coffee, Calendar, Search, Sparkles } from "lucide-react";
import { useApp } from "@/context/app-context";

export default function AnimatedWidgets() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
  const { setIsReservationOpen, setIsSearchOpen } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToMenu = () => {
    const el = document.getElementById("menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 1. Global Animated Scroll Progress Bar at Top Edge */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gold-gradient origin-left z-50 shadow-[0_0_15px_rgba(212,175,55,0.8)]"
      />

      {/* 2. Floating Animated Quick Actions Dock (Bottom Right) */}
      <div className="fixed bottom-20 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Dock Items */}
        <div className="flex items-center gap-2.5 bg-[#141414]/90 backdrop-blur-md p-2 rounded-full border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] pointer-events-auto">
          {/* Menu Shortcut */}
          <motion.button
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToMenu}
            title="Jump to Tasting Menu"
            className="w-10 h-10 rounded-full bg-[#1F1F1F] border border-[#D4AF37]/20 flex items-center justify-center text-cream/80 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors shadow-md"
          >
            <Coffee className="w-4 h-4" />
          </motion.button>

          {/* Search Shortcut */}
          <motion.button
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(true)}
            title="Search Menu"
            className="w-10 h-10 rounded-full bg-[#1F1F1F] border border-[#D4AF37]/20 flex items-center justify-center text-cream/80 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors shadow-md"
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Reserve Shortcut */}
          <motion.button
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsReservationOpen(true)}
            title="Book VIP Table"
            className="w-10 h-10 rounded-full bg-gold-gradient text-[#0F0F0F] flex items-center justify-center font-bold shadow-lg"
          >
            <Calendar className="w-4 h-4" />
          </motion.button>

          {/* Back to Top */}
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              title="Back to Top"
              className="w-10 h-10 rounded-full bg-[#262626] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-all shadow-md"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </>
  );
}
