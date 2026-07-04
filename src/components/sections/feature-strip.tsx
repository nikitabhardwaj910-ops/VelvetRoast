"use client";

import { Flame, Award, Wifi, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureStrip() {
  const features = [
    {
      icon: Flame,
      title: "Fresh Roasted Daily",
      description: "Artisanal micro-batch roasting conducted in-house every morning at 5:00 AM for peak aromatic complexity.",
    },
    {
      icon: Award,
      title: "Premium Arabica Beans",
      description: "100% organic, shade-grown beans sourced directly from award-winning high-altitude estates in Ethiopia & Colombia.",
    },
    {
      icon: Wifi,
      title: "Free High-Speed WiFi",
      description: "Symmetrical gigabit fiber optic connectivity designed specifically for creative professionals and digital executives.",
    },
    {
      icon: Heart,
      title: "Pet Friendly Lounge",
      description: "Our heated outdoor velvet terrace welcomes your four-legged companions with complimentary gourmet pupacinos.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.75, y: 60 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 20 } },
  };

  return (
    <section id="features" className="relative py-16 z-20 -mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -12, transition: { duration: 0.3, ease: "easeOut" } }}
                className="glass-card p-8 rounded-3xl relative overflow-hidden group shadow-xl"
              >
                {/* Subtle top golden line glow on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  className="w-14 h-14 rounded-2xl bg-secondary border border-accent/20 flex items-center justify-center mb-6 group-hover:border-accent/60 group-hover:bg-accent/10 transition-colors shadow-lg"
                >
                  <Icon className="w-6 h-6 text-accent" />
                </motion.div>

                <h3 className="font-serif text-2xl text-cream font-medium mb-3 group-hover:text-accent transition-colors">
                  {f.title}
                </h3>
                
                <p className="text-sm text-cream/70 font-light leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
