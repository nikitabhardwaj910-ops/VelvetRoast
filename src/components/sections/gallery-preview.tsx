"use client";

import Image from "next/image";
import { useApp } from "@/context/app-context";
import { Sparkles, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";

export default function GalleryPreview() {
  const { setActiveLightboxImg } = useApp();

  const galleryItems = [
    {
      title: "Architectural Interior & Velvet Lounge",
      category: "Flagship Sanctuary",
      image: "/images/gallery-1.png",
      span: "md:col-span-2 md:row-span-2 aspect-[4/3]",
    },
    {
      title: "Fresh Roasted Micro-Lot Coffee Beans",
      category: "Roastery Floor",
      image: "/images/gallery-2.png",
      span: "md:col-span-1 aspect-[3/4]",
    },
    {
      title: "Artisan Flaky Almond Croissant",
      category: "Bakery Kitchen",
      image: "/images/gallery-3.png",
      span: "md:col-span-1 aspect-square",
    },
    {
      title: "Gold Dust Latte Art Protocol",
      category: "Barista Station",
      image: "/images/menu-cappuccino.png",
      span: "md:col-span-1 aspect-square",
    },
    {
      title: "Nitro Infused Cold Brew Extraction",
      category: "Slow Bar",
      image: "/images/menu-cold-brew.png",
      span: "md:col-span-2 aspect-[16/9]",
    },
  ];

  return (
    <section id="gallery" className="relative py-28 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Visual Tapestry
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream font-normal">
            Moments at <span className="text-gold-gradient italic">Velvet Roast</span>
          </h2>
          <p className="text-base text-cream/70 font-light">
            Explore our architectural flagship roastery, exquisite latte art creations, and morning bakery rituals. Click any photograph to view full resolution.
          </p>
        </motion.div>

        {/* Pinterest-Style Masonry Grid with Staggered Framer Motion */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {galleryItems.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{ hidden: { opacity: 0, scale: 0.95, y: 30 }, show: { opacity: 1, scale: 1, y: 0 } }}
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3 } }}
              onClick={() => setActiveLightboxImg(item.image)}
              className={`relative rounded-3xl overflow-hidden bg-secondary border border-accent/20 cursor-pointer group shadow-xl ${item.span}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-primary mb-3 shadow-lg">
                  <ZoomIn className="w-5 h-5" />
                </div>
                <span className="text-xs uppercase tracking-widest text-accent font-medium">
                  {item.category}
                </span>
                <h3 className="font-serif text-2xl text-cream">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
