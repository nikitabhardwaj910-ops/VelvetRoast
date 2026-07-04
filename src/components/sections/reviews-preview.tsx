"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewsPreview() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const reviews = [
    {
      quote:
        "Velvet Roast isn't just a coffee shop; it's an architectural and sensory masterpiece. Their Ethiopian espresso has the most complex flavor profile I've tasted in my ten years as a food critic.",
      author: "Eleanor Vance",
      role: "Culinary Director & Food Critic",
      rating: 5,
    },
    {
      quote:
        "As an architect, I appreciate the deliberate lighting, acoustical treatment, and matte black stoneware. The nitro cold brew keeps our entire design studio running.",
      author: "Marcus Sterling",
      role: "Principal Architect, Sterling Design",
      rating: 5,
    },
    {
      quote:
        "The warm almond croissants straight from the oven at 7 AM alongside the gold leaf cappuccino is the single most luxurious start to a workday imaginable.",
      author: "Sophia Laurent",
      role: "Editor-in-Chief, Luxe Mode",
      rating: 5,
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, reviews.length]);

  return (
    <section
      className="relative py-28 bg-[#121212] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3 mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Patron Testimonials
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream font-normal">
            Echoes of <span className="text-gold-gradient italic">Admiration</span>
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-10 md:p-16 rounded-3xl relative transition-all duration-500 shadow-2xl overflow-hidden"
          >
            {/* Animated Quote Icon */}
            <motion.div
              animate={{ rotate: [180, 185, 180], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-10 text-accent/15"
            >
              <Quote className="w-20 h-20" />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-8 relative z-10 min-h-[220px] flex flex-col justify-between"
              >
                <div className="flex gap-1">
                  {[...Array(reviews[currentIdx].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Star className="w-5 h-5 text-accent fill-accent" />
                    </motion.div>
                  ))}
                </div>

                <p className="font-serif text-2xl md:text-3xl text-cream/95 leading-relaxed italic">
                  &ldquo;{reviews[currentIdx].quote}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-accent/15">
                  <div>
                    <h4 className="font-serif text-xl text-cream font-semibold">
                      {reviews[currentIdx].author}
                    </h4>
                    <p className="text-xs uppercase tracking-wider text-accent mt-0.5">
                      {reviews[currentIdx].role}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#C49A6C", color: "#0F0F0F" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentIdx((prev) => (prev - 1 + reviews.length) % reviews.length)}
                      aria-label="Previous review"
                      className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center text-cream transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#C49A6C", color: "#0F0F0F" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentIdx((prev) => (prev + 1) % reviews.length)}
                      aria-label="Next review"
                      className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center text-cream transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIdx === i ? "w-8 bg-accent" : "w-2 bg-cream/20 hover:bg-cream/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
