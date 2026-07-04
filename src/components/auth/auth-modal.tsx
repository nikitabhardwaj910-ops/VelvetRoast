"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/app-context";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useApp();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  const [email, setEmail] = useState("alexander@velvetroast.com");
  const [password, setPassword] = useState("velvetroast2026");
  const [name, setName] = useState("Alexander Wright");
  const [phone, setPhone] = useState("+91 98200 11223");
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required credentials");
      return;
    }
    setError("");

    // Authenticate user profile
    login({
      id: `usr-${Date.now()}`,
      name: activeTab === "signup" ? name : name || "VIP Member",
      email: email,
      phone: phone || "+91 98000 00000",
    });
  };

  const handleQuickDemoLogin = () => {
    login({
      id: "usr-vip-001",
      name: "Alexander Wright",
      email: "alexander@velvetroast.com",
      phone: "+91 98200 11223",
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          transition={{ type: "spring", damping: 22, stiffness: 350 }}
          className="relative w-full max-w-md bg-[#141414] border border-accent/40 rounded-3xl p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-cream/70 hover:text-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold block mb-1">
              Sanctuary Access Protocol
            </span>
            <h3 className="font-serif text-3xl text-cream">
              {activeTab === "signin" ? "Sign In to Velvet Roast" : "Create VIP Account"}
            </h3>
            <p className="text-xs text-cream/60 mt-1">
              {activeTab === "signin"
                ? "Sign in to place food orders, reserve tables, & track loyalty."
                : "Join our artisanal coffee sanctuary for instant ordering privileges."}
            </p>
          </div>

          {/* Tab switches */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-secondary mb-6 border border-accent/20">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setError("");
              }}
              className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeTab === "signin"
                  ? "bg-gold-gradient text-primary shadow-md font-bold"
                  : "text-cream/70 hover:text-cream"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setError("");
              }}
              className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeTab === "signup"
                  ? "bg-gold-gradient text-primary shadow-md font-bold"
                  : "text-cream/70 hover:text-cream"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <div>
                <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-cream/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-accent/20 text-cream text-sm focus:border-accent outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cream/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@velvetroast.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-accent/20 text-cream text-sm focus:border-accent outline-none"
                />
              </div>
            </div>

            {activeTab === "signup" && (
              <div>
                <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-cream/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-accent/20 text-cream text-sm focus:border-accent outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cream/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-accent/20 text-cream text-sm focus:border-accent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gold-gradient text-primary font-bold text-xs tracking-widest uppercase shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4" />
              {activeTab === "signin" ? "Sign In & Continue" : "Create Account & Continue"}
            </button>
          </form>

          {/* Quick Demo button */}
          <div className="mt-6 pt-4 border-t border-accent/15 text-center">
            <span className="text-[10px] text-cream/40 uppercase tracking-widest block mb-2">Or One-Click Access</span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-xl bg-secondary/80 border border-accent/30 text-xs text-cream hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-accent" /> Quick Demo Login as VIP Member
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
