"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { Sparkles } from "lucide-react";

interface ParallaxTextProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxTextProps) {
  const baseX = useRef(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  useAnimationFrame((t, delta) => {
    let moveBy = baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      moveBy += moveBy * velocityFactor.get();
    } else if (velocityFactor.get() > 0) {
      moveBy += moveBy * velocityFactor.get();
    }

    baseX.current += moveBy;
    // Keep within -50% to 0% for seamless wrap
    if (baseX.current <= -50) {
      baseX.current = 0;
    } else if (baseX.current > 0) {
      baseX.current = -50;
    }
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap py-4 border-y border-[#D4AF37]/20 bg-[#121212]/80 backdrop-blur-md">
      <motion.div
        className="font-serif text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] font-normal flex flex-nowrap gap-10 items-center select-none text-gold-gradient"
        style={{ x: useTransform(() => `${baseX.current}%`) }}
      >
        <span>{children}</span>
        <span>{children}</span>
        <span>{children}</span>
        <span>{children}</span>
      </motion.div>
    </div>
  );
}

export default function ScrollVelocityMarquee() {
  return (
    <section className="relative py-8 z-30 overflow-hidden">
      <div className="space-y-4">
        <ParallaxText baseVelocity={-4}>
          ★ 100% ORGANIC ARABICA ★ FRESH ROASTED DAILY AT 5 AM ★ GOLD DUST CAPPUCCINO ★ TRUFFLE AVOCADO TOAST ★ WAGYU SMASH BURGERS ★ CEREMONIAL MATCHA ★
        </ParallaxText>
        <ParallaxText baseVelocity={4}>
          • SINGLE ORIGIN MICRO-LOTS • 24H NITRO COLD BREW • ARTISAN SOURDOUGH • ETHIOPIAN & COLOMBIAN BEANS • VELVET CREMA • LUXURY CAFE SANCTUARY •
        </ParallaxText>
      </div>
    </section>
  );
}
