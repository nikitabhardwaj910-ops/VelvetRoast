"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Key,
  Sparkles,
  ArrowRight,
  LogOut,
  Building2,
  Award,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Coffee,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
  clearanceLevel: string;
  loginTime: string;
}

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminSession | null>(null);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [role, setRole] = useState("Master Roaster & Beverage Director");
  const [masterCode, setMasterCode] = useState("VR-SANCTUARY-2026");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("velvet_admin_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAdminUser(parsed);
      }
    } catch (err) {
      console.error("Error loading admin session:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both corporate email and executive password.");
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      // Validate or allow flexible executive sign in
      if (password.length < 4) {
        setErrorMsg("Executive password must be at least 4 characters.");
        return;
      }

      const newSession: AdminSession = {
        id: `admin-${Date.now()}`,
        name: email.includes("admin") || email.includes("alexander") ? "Alexander Wright" : email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        role: email.includes("chef") ? "Executive Culinary Chef" : "Master Roaster & Beverage Director",
        clearanceLevel: "Level 5 (Supreme Executive)",
        loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setAdminUser(newSession);
      try {
        localStorage.setItem("velvet_admin_session", JSON.stringify(newSession));
      } catch (err) {}
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName || !signupEmail || !signupPassword) {
      setErrorMsg("Please complete all required registration fields.");
      return;
    }

    if (masterCode !== "VR-SANCTUARY-2026" && masterCode !== "VELVET2026") {
      setErrorMsg("Invalid Sanctuary Master Code. Use demo code: VR-SANCTUARY-2026");
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const newSession: AdminSession = {
        id: `admin-${Date.now()}`,
        name: fullName,
        email: signupEmail,
        role: role,
        clearanceLevel: "Level 5 (Supreme Executive)",
        loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setAdminUser(newSession);
      try {
        localStorage.setItem("velvet_admin_session", JSON.stringify(newSession));
      } catch (err) {}
    }, 600);
  };

  const handleQuickDemoFill = () => {
    setEmail("admin@velvetroast.com");
    setPassword("velvet2026");
    setErrorMsg("");
  };

  const handleSignOut = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem("velvet_admin_session");
    } catch (err) {}
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center text-cream">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mb-4" />
        <p className="text-xs tracking-[0.25em] uppercase text-accent font-semibold animate-pulse">
          Verifying Executive Security Protocol...
        </p>
      </div>
    );
  }

  // If Admin is signed in, render admin content + executive security pill
  if (adminUser) {
    return (
      <div className="relative min-h-screen bg-[#0E0E0E]">
        {children}

        {/* Floating Executive Security Badge & Sign Out Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-5 right-5 z-50 bg-[#141414]/95 border border-accent/40 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3.5 group hover:border-accent transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-gold-gradient flex items-center justify-center text-primary shadow-sm shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-cream leading-tight">{adminUser.name}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent/20 text-accent uppercase tracking-wider">
                VIP Admin
              </span>
            </div>
            <p className="text-[10px] text-cream/60 truncate max-w-[170px]">{adminUser.role}</p>
          </div>
          <div className="h-6 w-px bg-accent/20 mx-1" />
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            title="Sign out of Executive Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Portal</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Admin Not Signed In -> Show Stunning Executive Authentication Portal
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-cream flex items-center justify-center p-4 relative overflow-hidden selection:bg-accent selection:text-primary">
      {/* Background ambient luxury lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Return link to main website */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-[#141414]/80 border border-accent/30 text-xs font-semibold text-cream/80 hover:text-accent hover:border-accent transition-all backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Website</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-xl bg-[#121212]/95 border border-accent/40 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.12)] backdrop-blur-xl z-10 overflow-hidden"
      >
        {/* Top Gold Bar */}
        <div className="h-1.5 w-full bg-gold-gradient" />

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary border border-accent/40 mb-4 shadow-inner">
              <ShieldAlert className="w-7 h-7 text-accent" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
                256-Bit Encrypted Sanctuary Protocol
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-cream tracking-wide">
              Velvet Roast <span className="text-accent italic">Executive Suite</span>
            </h1>
            <p className="text-xs sm:text-sm text-cream/60 mt-2 max-w-md mx-auto leading-relaxed">
              Restricted management portal for Master Roasters, Operations Directors, & Culinary Leadership.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#181818] border border-accent/20 mb-8">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setErrorMsg("");
              }}
              className={`py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "signin"
                  ? "bg-gold-gradient text-primary shadow-lg scale-[1.01]"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setErrorMsg("");
              }}
              className={`py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "signup"
                  ? "bg-gold-gradient text-primary shadow-lg scale-[1.01]"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Access (Sign Up)</span>
            </button>
          </div>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {activeTab === "signin" ? (
              <motion.form
                key="signin-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onSubmit={handleSignIn}
                className="space-y-5"
              >
                {/* Quick Demo Credentials Bar */}
                <div className="p-3.5 rounded-2xl bg-secondary/70 border border-accent/25 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Coffee className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <span className="text-[11px] font-bold text-cream block">Demo Master Admin Credentials</span>
                      <span className="text-[10px] text-cream/60">admin@velvetroast.com / velvet2026</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickDemoFill}
                    className="py-1.5 px-3 rounded-lg bg-accent/20 hover:bg-accent text-accent hover:text-primary text-[11px] font-bold transition-all cursor-pointer shrink-0"
                  >
                    Quick Fill
                  </button>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-cream/80 mb-2">
                    Corporate Executive Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/70" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@velvetroast.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#181818] border border-accent/30 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-cream/80">
                      Master Security Password
                    </label>
                    <span className="text-[10px] text-accent/80 hover:underline cursor-pointer">
                      Forgot Protocol Key?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/70" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter executive passkey..."
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#181818] border border-accent/30 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-accent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-accent/40 bg-[#181818] text-accent focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-cream/70">Remember device for 30 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-4 rounded-xl bg-gold-gradient text-primary font-bold text-sm uppercase tracking-wider shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Unlock Executive Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                onSubmit={handleSignUp}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-cream/80 mb-1.5">
                    Executive Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/70" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Evelyn Vance"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#181818] border border-accent/30 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-cream/80 mb-1.5">
                    Corporate Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/70" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. evelyn.vance@velvetroast.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#181818] border border-accent/30 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-cream/80 mb-1.5">
                    Executive Role & Department
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/70" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#181818] border border-accent/30 text-cream text-sm focus:outline-none focus:border-accent transition-all cursor-pointer"
                    >
                      <option value="Master Roaster & Beverage Director">Master Roaster & Beverage Director</option>
                      <option value="Executive Culinary Chef">Executive Culinary Chef</option>
                      <option value="General Manager & Hospitality Lead">General Manager & Hospitality Lead</option>
                      <option value="Sommelier & Wine Curator">Sommelier & Wine Curator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-cream/80 mb-1.5">
                      Create Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/70" />
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min. 6 chars"
                        className="w-full pl-11 pr-9 py-3 rounded-xl bg-[#181818] border border-accent/30 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-accent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-cream/80 mb-1.5">
                      Sanctuary Code
                    </label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/70" />
                      <input
                        type="text"
                        value={masterCode}
                        onChange={(e) => setMasterCode(e.target.value)}
                        placeholder="VR-SANCTUARY-2026"
                        className="w-full pl-11 pr-3 py-3 rounded-xl bg-[#181818] border border-accent/30 text-accent font-mono text-xs focus:outline-none focus:border-accent transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-cream/50">
                  * Sanctuary code is required for corporate registration. Default demo code: <span className="text-accent font-mono font-bold">VR-SANCTUARY-2026</span>
                </p>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-4 rounded-xl bg-gold-gradient text-primary font-bold text-sm uppercase tracking-wider shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span>Provisioning Access...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>Register & Launch Admin Suite</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer Security Note */}
          <div className="mt-8 pt-6 border-t border-accent/15 flex items-center justify-between text-[11px] text-cream/40">
            <span>Authorized Personnel Only</span>
            <span>Velvet Roast v2.6 Enterprise</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
