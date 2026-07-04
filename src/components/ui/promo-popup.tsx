"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, X, ArrowRight, Coffee, Award } from "lucide-react";
import { useApp } from "@/context/app-context";

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsReservationOpen } = useApp();

  useEffect(() => {
    // Check session storage so it doesn't annoy user on every single refresh immediately, or pop up after 2.5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleClaim = () => {
    setIsOpen(false);
    setIsReservationOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
            {/* Backdrop blur when open */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            />

            {/* Popup Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-lg bg-[#141414] border-2 border-[#D4AF37]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.25)] pointer-events-auto overflow-hidden"
            >
              {/* Background ambient golden glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#1F1F1F] border border-[#D4AF37]/30 flex items-center justify-center text-cream/70 hover:text-[#D4AF37] hover:scale-110 transition-all shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Badge */}
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-10 h-10 rounded-2xl bg-gold-gradient flex items-center justify-center text-[#0F0F0F] shadow-lg"
                >
                  <Gift className="w-5 h-5" />
                </motion.div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                    VIP Welcome Privilege
                  </span>
                  <h3 className="font-serif text-2xl text-cream font-medium">
                    Artisan Tasting Voucher
                  </h3>
                </div>
              </div>

              {/* Golden divider */}
              <div className="w-full h-[1px] bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37]/10 to-transparent my-4" />

              <p className="text-sm text-cream/80 font-light leading-relaxed mb-6">
                Receive a complimentary <strong className="text-[#D4AF37]">Gold Dust Flaky Croissant</strong> or a glass of <strong className="text-[#D4AF37]">24h Nitro Cold Brew</strong> when you reserve a VIP tasting table or order above ₹499 today.
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1A1A1A] border border-[#D4AF37]/20">
                  <Coffee className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs text-cream/90 font-medium">Fresh Baked 5 AM</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1A1A1A] border border-[#D4AF37]/20">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs text-cream/90 font-medium">100% Organic Arabica</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClaim}
                  className="flex-1 py-3.5 px-6 rounded-full bg-gold-gradient text-[#0F0F0F] font-semibold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Claim VIP Voucher
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(212,175,55,0.15)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsOpen(false)}
                  className="py-3.5 px-6 rounded-full border border-[#D4AF37]/40 text-cream/80 text-xs uppercase tracking-widest font-medium transition-colors"
                >
                  Maybe Later
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Re-open Trigger Button when dismissed */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-[#141414] border border-[#D4AF37] text-[#D4AF37] p-3.5 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center gap-2 group"
          title="Open VIP Perk"
        >
          <motion.div
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <Gift className="w-5 h-5" />
          </motion.div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-cream max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            VIP Voucher Available
          </span>
        </motion.button>
      )}
    </>
  );
}
