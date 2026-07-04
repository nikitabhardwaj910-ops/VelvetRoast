"use client";

import { useState } from "react";
import { useApp } from "@/context/app-context";
import { Sparkles, Calendar, Music, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReservationCTA() {
  const { setIsReservationOpen } = useApp();
  const [isEventsOpen, setIsEventsOpen] = useState(false);

  const events = [
    {
      title: "Private Single-Origin Cupping Masterclass",
      date: "Every Saturday • 10:00 AM",
      desc: "An intimate sensory exploration of 6 micro-lot Ethiopian & Colombian roasts guided by our Head Roaster.",
    },
    {
      title: "Live Jazz & Velvet Espresso Nights",
      date: "Friday Evenings • 8:00 PM",
      desc: "Unwind to live acoustic jazz quartet performances accompanied by signature nitro espresso martinis.",
    },
    {
      title: "Latte Art & Milk Steaming Workshop",
      date: "Sunday Afternoons • 2:00 PM",
      desc: "Hands-on barista training mastering silky microfoam texture and classic rosetta patterns.",
    },
  ];

  return (
    <>
      <section id="reservation" className="relative py-32 overflow-hidden flex items-center justify-center text-center bg-grain">
        {/* Background dark animated gradient and breathing bokeh overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A120B] via-[#0F0F0F] to-[#121212] -z-20" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/15 rounded-full blur-[160px] -z-10"
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          className="max-w-4xl mx-auto px-6 md:px-12 space-y-8 relative z-10"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-accent/30 text-xs uppercase tracking-[0.25em] text-accent font-medium shadow-lg">
              <Sparkles className="w-3.5 h-3.5" /> VIP Sanctuary
            </div>
          </motion.div>

          <motion.h2
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl text-cream font-normal leading-tight"
          >
            Reserve Your Perfect <span className="text-gold-gradient italic block sm:inline">Coffee Moment</span>
          </motion.h2>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="text-base md:text-xl text-cream/75 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Whether hosting an executive morning meeting or seeking quiet solace with a pour-over brew, secure your reserved velvet table ahead of arrival.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="flex flex-col sm:flex-row justify-center gap-5 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(196, 154, 108, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReservationOpen(true)}
              className="px-10 py-5 rounded-full bg-gold-gradient text-primary font-semibold text-xs uppercase tracking-widest shadow-2xl shadow-accent/30 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Reserve Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: "#C49A6C", backgroundColor: "rgba(196, 154, 108, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEventsOpen(true)}
              className="px-10 py-5 rounded-full glass-panel border border-accent/40 text-cream text-xs uppercase font-semibold tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Music className="w-4 h-4 text-accent" /> View Events
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* View Events Modal */}
      <AnimatePresence>
        {isEventsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setIsEventsOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-2xl w-full bg-[#141414] border border-accent/30 rounded-3xl p-8 md:p-10 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-accent/20">
                <div>
                  <span className="text-xs uppercase tracking-widest text-accent font-medium">Velvet Calendar</span>
                  <h3 className="font-serif text-3xl text-cream">Upcoming Experiences</h3>
                </div>
                <button
                  onClick={() => setIsEventsOpen(false)}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-cream/70 hover:text-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {events.map((ev, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-2xl bg-secondary/60 border border-accent/15 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-xl text-cream font-medium">{ev.title}</h4>
                      <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">{ev.date}</span>
                    </div>
                    <p className="text-sm text-cream/70">{ev.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsEventsOpen(false);
                  setIsReservationOpen(true);
                }}
                className="w-full py-4 rounded-full bg-gold-gradient text-primary font-semibold uppercase tracking-widest text-xs shadow-xl"
              >
                Book Event Access
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
