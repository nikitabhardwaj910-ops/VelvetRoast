"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Coffee, Sparkles, Circle } from "lucide-react";

export default function ScrollFloatingElements() {
  const { scrollYProgress } = useScroll();

  // Parallax transformations for 8 floating elements spread down the webpage
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -1200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 900]);
  const y3 = useTransform(scrollYProgress, [0, 1], [200, -800]);
  const y4 = useTransform(scrollYProgress, [0, 1], [-100, 1400]);
  const y5 = useTransform(scrollYProgress, [0, 1], [300, -1500]);
  const y6 = useTransform(scrollYProgress, [0, 1], [0, 1100]);

  const rot1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rot2 = useTransform(scrollYProgress, [0, 1], [0, -540]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* 1. Floating Golden Coffee Bean Top-Left */}
      <motion.div
        style={{ y: y1, rotate: rot1 }}
        className="absolute top-[15%] left-[6%] w-12 h-12 rounded-full bg-secondary/80 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]/40 shadow-[0_0_25px_rgba(212,175,55,0.15)] backdrop-blur-sm"
      >
        <Coffee className="w-5 h-5" />
      </motion.div>

      {/* 2. Floating Golden Ring Top-Right */}
      <motion.div
        style={{ y: y2, rotate: rot2 }}
        className="absolute top-[25%] right-[8%] w-16 h-16 rounded-full border-2 border-dashed border-[#D4AF37]/20 flex items-center justify-center"
      >
        <Sparkles className="w-4 h-4 text-[#D4AF37]/30" />
      </motion.div>

      {/* 3. Floating Sparkle Mid-Left */}
      <motion.div
        style={{ y: y3, rotate: rot2 }}
        className="absolute top-[45%] left-[10%] w-10 h-10 rounded-2xl bg-[#141414]/90 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]/40 shadow-lg"
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>

      {/* 4. Floating Coffee Bean Mid-Right */}
      <motion.div
        style={{ y: y4, rotate: rot1 }}
        className="absolute top-[60%] right-[6%] w-14 h-14 rounded-full bg-secondary/80 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]/40 shadow-xl"
      >
        <Coffee className="w-6 h-6" />
      </motion.div>

      {/* 5. Floating Ambient Ring Lower-Left */}
      <motion.div
        style={{ y: y5, rotate: rot1 }}
        className="absolute top-[78%] left-[8%] w-20 h-20 rounded-full border border-[#D4AF37]/15 flex items-center justify-center"
      >
        <Circle className="w-6 h-6 text-[#D4AF37]/20" />
      </motion.div>

      {/* 6. Floating Sparkle Lower-Right */}
      <motion.div
        style={{ y: y6, rotate: rot2 }}
        className="absolute top-[88%] right-[12%] w-12 h-12 rounded-full bg-[#1A1A1A]/80 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]/40 shadow-lg"
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>
    </div>
  );
}
