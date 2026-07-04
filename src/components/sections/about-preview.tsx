"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, X, Coffee, Award, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutPreview() {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  return (
    <>
      <section id="about" className="relative py-24 bg-[#0F0F0F] overflow-hidden">
        {/* Handcrafted SVG Coffee Wave Divider Top */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none opacity-25">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 text-[#1A1A1A] fill-current">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,0 L0,0 Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Story Image Composition */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative golden accent offset frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="absolute -inset-3 rounded-3xl border border-accent/30 translate-x-3 translate-y-3 -z-10"
                />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-accent/15 blur-3xl -z-10" />

                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-accent/20 bg-secondary group">
                  <Image
                    src="/images/about-story.png"
                    alt="Velvet Roast Master Barista Pouring Espresso"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-xs uppercase tracking-widest text-accent font-medium">The Artisan Protocol</span>
                    <h4 className="font-serif text-xl text-cream">Crafted by Master Roasters</h4>
                  </div>
                </div>

                {/* Floating Experience Badge with Spring Pop */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="absolute -top-6 -left-6 glass-panel px-6 py-4 rounded-2xl border border-accent/30 shadow-2xl flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-primary font-serif font-bold text-xl shadow-md">
                    14
                  </div>
                  <div>
                    <div className="text-xs text-cream/60 uppercase tracking-wider">Years of Excellence</div>
                    <div className="font-serif text-base text-cream font-medium">Award-Winning Café</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: Editorial Typography & Golden Divider */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.15 } },
              }}
              className="lg:col-span-6 space-y-6"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" /> Our Heritage
              </motion.div>

              <motion.h2
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream font-normal leading-tight"
              >
                Where Passion Meets <span className="text-gold-gradient italic">Velvety Perfection</span>
              </motion.h2>

              {/* Animated Expanding Golden Divider */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-0.5 bg-gold-gradient my-4 rounded-full"
              />

              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="text-base text-cream/80 font-light leading-relaxed"
              >
                Founded in 2012 by master roaster Julian Vance, Velvet Roast began with a singular obsession: elevating coffee from a daily routine to a sensory art form. Every single bean is ethically harvested from micro-lots across the globe and slowly roasted in small artisan batches.
              </motion.p>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="text-base text-cream/70 font-light leading-relaxed"
              >
                We believe that true luxury lies in uncompromised craftsmanship. From the temperature of our purified mineral water to the exact 9-bar pressure extraction, every element is meticulously calibrated to deliver a cup that lingers on the palate and warms the soul.
              </motion.p>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="grid grid-cols-2 gap-6 pt-4 border-t border-accent/15"
              >
                <div>
                  <h4 className="font-serif text-2xl text-cream">Ethical Sourcing</h4>
                  <p className="text-xs text-cream/60 mt-1">Direct trade partnerships ensuring fair wages for farming communities.</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-cream">Zero-Carbon Roasting</h4>
                  <p className="text-xs text-cream/60 mt-1">State-of-the-art electric infrared roasters powered by 100% clean energy.</p>
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="pt-6">
                <motion.button
                  whileHover={{ scale: 1.05, borderColor: "#C49A6C" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsStoryModalOpen(true)}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-accent/60 text-cream text-xs uppercase font-semibold tracking-widest hover:bg-accent hover:text-primary transition-colors"
                >
                  Learn Our Story
                  <ArrowRight className="w-4 h-4 text-accent group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Story Modal */}
      <AnimatePresence>
        {isStoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setIsStoryModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-3xl w-full bg-[#141414] border border-accent/30 rounded-3xl p-8 md:p-12 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsStoryModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-cream/70 hover:text-accent"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-accent font-medium">The Velvet Chronicle</span>
                <h3 className="font-serif text-4xl text-cream">The Pursuit of the Perfect Roast</h3>
                <div className="w-16 h-0.5 bg-gold-gradient" />
                <p className="text-sm text-cream/80 leading-relaxed">
                  In 2012, after spending five years apprenticing with legacy coffee producers in the highlands of Ethiopia and the volcanic slopes of Antigua, Guatemala, Julian Vance returned to the city with an uncompromising vision: a sanctuary where modern design meets ancient hospitality.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-accent/15">
                    <Coffee className="w-6 h-6 text-accent mb-2" />
                    <h4 className="font-serif text-lg text-cream">Hand-Picked Harvest</h4>
                    <p className="text-xs text-cream/60 mt-1">Only the top 1% of red coffee cherries pass our stringent visual inspection.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-accent/15">
                    <Clock className="w-6 h-6 text-accent mb-2" />
                    <h4 className="font-serif text-lg text-cream">Slow Drum Roasting</h4>
                    <p className="text-xs text-cream/60 mt-1">Roasting profiles developed over 18 minutes to unlock sweet caramel notes.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-accent/15">
                    <Award className="w-6 h-6 text-accent mb-2" />
                    <h4 className="font-serif text-lg text-cream">Water Alchemy</h4>
                    <p className="text-xs text-cream/60 mt-1">Custom 7-stage reverse osmosis water mineralized with magnesium.</p>
                  </div>
                </div>
                <p className="text-sm text-cream/80 leading-relaxed">
                  Whether you join us for a brisk morning espresso or linger over a nitro cold brew while finishing your next project, Velvet Roast is engineered to elevate your daily ritual into a truly transcendent experience.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsStoryModalOpen(false)}
                  className="px-8 py-3 rounded-full bg-gold-gradient text-primary text-xs uppercase tracking-widest font-semibold"
                >
                  Return to Experience
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
