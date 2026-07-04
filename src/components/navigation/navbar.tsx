"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/app-context";
import { Search, ShoppingBag, Menu as MenuIcon, X, Sparkles, Coffee, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, setIsCartOpen, setIsSearchOpen, setIsReservationOpen, user, setIsAuthModalOpen, logout, requireAuth } = useApp();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Menu", href: "#menu" },
    { name: "Gallery", href: "#gallery" },
    { name: "Reservations", href: "#reservation" },
    { name: "Contact", href: "#footer" },
    { name: "Blog", href: "#blog" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === "#reservation") {
      setIsReservationOpen(true);
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
          isScrolled
            ? "glass-panel py-4 border-b border-accent/20 shadow-2xl bg-[#0F0F0F]/85 backdrop-blur-xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <motion.a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-primary shadow-lg shadow-accent/20"
            >
              <Coffee className="w-5 h-5" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-cream group-hover:text-accent transition-colors">
                Velvet Roast
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-accent/80 -mt-1 font-sans">
                Luxury Café & Roastery
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                whileHover={{
                  scale: 1.15,
                  y: -4,
                  textShadow: "0 0 15px rgba(212, 175, 55, 0.9)",
                  transition: { type: "spring", stiffness: 400, damping: 15 },
                }}
                className="relative text-sm tracking-widest uppercase font-medium text-cream/80 hover:text-accent transition-colors py-1 group inline-block"
              >
                {link.name}
                <motion.span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold-gradient transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          {/* Action Icons & CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              title="Executive Admin Management Suite"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 text-accent hover:bg-gold-gradient hover:text-primary text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-accent/30"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline tracking-wider uppercase text-[10px]">Admin Panel</span>
            </Link>
            {user ? (
              <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-secondary/80 border border-accent/20">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs text-cream/90 font-medium hidden md:inline max-w-[100px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="text-cream/50 hover:text-red-400 p-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-accent/30 text-cream/90 text-xs font-semibold hover:border-accent hover:text-accent transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">Sign In</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(196,154,108,0.15)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search menu and story"
              className="w-9 h-9 rounded-full flex items-center justify-center text-cream/80 hover:text-accent transition-colors cursor-pointer"
            >
              <Search className="w-4.5 h-4.5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(196,154,108,0.15)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              aria-label="Open tasting cart"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-cream/80 hover:text-accent transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-primary text-[11px] font-bold flex items-center justify-center shadow-md"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(196,154,108,0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => requireAuth(() => setIsReservationOpen(true))}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-gradient text-primary text-xs uppercase font-semibold tracking-widest shadow-lg shadow-accent/20 transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Book Table
            </motion.button>

            {/* Hamburger Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className="lg:hidden w-10 h-10 rounded-full glass-panel flex items-center justify-center text-cream hover:text-accent transition-colors"
            >
              <MenuIcon className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Full-Screen Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-2xl flex flex-col justify-between p-8 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-6 h-6 text-accent" />
                <span className="font-serif text-2xl text-cream font-bold">Velvet Roast</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile menu"
                className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center text-cream hover:text-accent"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 my-auto">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{
                    scale: 1.05,
                    x: 12,
                    textShadow: "0 0 15px rgba(212, 175, 55, 0.8)",
                    transition: { type: "spring", stiffness: 350, damping: 20 },
                  }}
                  className="font-serif text-3xl sm:text-4xl text-cream/90 hover:text-accent transition-all flex items-center justify-between group py-2 border-b border-accent/10"
                >
                  <span>{link.name}</span>
                  <span className="text-xs font-sans text-accent/50 group-hover:text-accent tracking-widest uppercase">
                    0{idx + 1}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 pt-6 border-t border-accent/20"
            >
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsReservationOpen(true);
                }}
                className="w-full py-4 rounded-full bg-gold-gradient text-primary font-semibold uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Book VIP Table
              </button>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-full bg-[#1A1A1A] border border-accent/40 text-accent font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" /> Open Executive Admin Panel
              </Link>
              <div className="text-center text-xs text-cream/50 tracking-widest uppercase">
                Handcrafted in the Heart of the City • Est. 2012
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
