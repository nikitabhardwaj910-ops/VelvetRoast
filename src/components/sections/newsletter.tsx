"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C49A6C", "#F6F2EC", "#8F6B43"],
    });

    setSubscribed(true);
  };

  return (
    <section id="blog" className="relative py-24 bg-[#0F0F0F] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-10 md:p-16 rounded-3xl relative overflow-hidden border border-accent/30 shadow-2xl"
        >
          {/* Subtle breathing golden corner highlight */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-accent/15 rounded-full blur-3xl pointer-events-none"
          />

          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent flex items-center justify-center mx-auto text-accent shadow-lg shadow-accent/20 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-cream font-medium">
                  Welcome to the Velvet Club
                </h3>
                <p className="text-sm text-cream/75 max-w-md mx-auto">
                  Your private invitation to micro-lot releases, tasting notes, and secret roastery evenings has been dispatched to <span className="text-accent font-medium">{email}</span>.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
              >
                <div className="lg:col-span-7 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-medium">
                    <Sparkles className="w-3.5 h-3.5" /> Exclusive Society
                  </div>
                  <h2 className="font-serif text-4xl sm:text-5xl text-cream font-normal">
                    Join the Velvet Club
                  </h2>
                  <p className="text-sm text-cream/70 font-light leading-relaxed max-w-md">
                    Receive bi-weekly roasting journals, early priority booking for cupping masterclasses, and complimentary birthday pastry credits.
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/60" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        className="w-full pl-12 pr-4 py-4 rounded-full bg-secondary/80 border border-accent/30 text-cream placeholder-cream/40 text-sm focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(196, 154, 108, 0.4)" }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="w-full py-4 rounded-full bg-gold-gradient text-primary font-semibold text-xs tracking-widest uppercase shadow-xl flex items-center justify-center gap-2 group"
                    >
                      Subscribe Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </form>
                  <span className="text-[10px] text-cream/40 block text-center mt-2.5 uppercase tracking-wider">
                    We respect your privacy. Unsubscribe at any time.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
