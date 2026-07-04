"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  UtensilsCrossed,
  Users,
  CreditCard,
  BarChart3,
  Image as ImageIcon,
  Gift,
  UserCheck,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export interface AdminNavItem {
  id: string;
  title: string;
  icon: any;
  subItems?: { id: string; title: string }[];
  badge?: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "Dashboard", title: "Dashboard", icon: LayoutDashboard },
  {
    id: "Orders",
    title: "Orders",
    icon: Package,
    badge: "Active",
    subItems: [
      { id: "Online Orders", title: "Online Orders" },
      { id: "Dine-In Orders", title: "Dine-In Orders" },
      { id: "Upcoming Orders", title: "Upcoming Orders" },
      { id: "Order History", title: "Order History" },
    ],
  },
  {
    id: "Reservations",
    title: "Reservations",
    icon: CalendarDays,
    subItems: [
      { id: "Calendar", title: "Calendar" },
      { id: "Table Management", title: "Table Management" },
      { id: "Waitlist", title: "Waitlist" },
    ],
  },
  {
    id: "Menu",
    title: "Menu",
    icon: UtensilsCrossed,
    subItems: [
      { id: "Categories", title: "Categories" },
      { id: "Items", title: "Items" },
      { id: "Combos", title: "Combos" },
      { id: "Inventory", title: "Inventory" },
    ],
  },
  {
    id: "Customers",
    title: "Customers",
    icon: Users,
    subItems: [
      { id: "Loyalty", title: "Loyalty" },
      { id: "Reviews", title: "Reviews" },
      { id: "Memberships", title: "Memberships" },
    ],
  },
  { id: "Payments", title: "Payments", icon: CreditCard },
  { id: "Analytics", title: "Analytics", icon: BarChart3 },
  { id: "Gallery", title: "Gallery", icon: ImageIcon },
  { id: "Promotions", title: "Promotions", icon: Gift },
  { id: "Employees", title: "Employees", icon: UserCheck },
  { id: "Notifications", title: "Notifications", icon: Bell, badge: "3" },
  { id: "Settings", title: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  activeModule: string;
  setActiveModule: (mod: string) => void;
  activeSubModule: string;
  setActiveSubModule: (sub: string) => void;
}

export default function AdminSidebar({
  activeModule,
  setActiveModule,
  activeSubModule,
  setActiveSubModule,
}: AdminSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    Orders: true,
    Reservations: true,
    Menu: true,
    Customers: true,
  });

  const toggleExpand = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <aside className="w-64 bg-[#111111] border-r border-accent/20 flex flex-col h-screen sticky top-0 shrink-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-accent/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center text-primary font-serif font-bold text-lg shadow-lg">
            V
          </div>
          <div>
            <span className="font-serif text-lg text-cream font-bold tracking-wide block leading-none">
              Velvet Roast
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">Executive Suite</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          const isExpanded = expandedModules[item.id];
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.id} className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveModule(item.id);
                  if (hasSubItems) {
                    toggleExpand(item.id);
                    if (!isActive && item.subItems?.[0]) {
                      setActiveSubModule(item.subItems[0].id);
                    }
                  } else {
                    setActiveSubModule(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-accent/20 text-accent border border-accent/30 shadow-md"
                    : "text-cream/70 hover:bg-secondary/60 hover:text-cream"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-cream/50"}`} />
                  <span>{item.title}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-accent text-primary">
                      {item.badge}
                    </span>
                  )}
                  {hasSubItems && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(item.id);
                      }}
                      className="p-0.5 text-cream/40 hover:text-cream"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </div>
              </button>

              {/* Sub items */}
              <AnimatePresence>
                {hasSubItems && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-7 pr-2 space-y-1"
                  >
                    {item.subItems!.map((sub) => {
                      const isSubActive = isActive && activeSubModule === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setActiveModule(item.id);
                            setActiveSubModule(sub.id);
                          }}
                          className={`w-full text-left py-1.5 px-3 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center justify-between ${
                            isSubActive
                              ? "bg-gold-gradient text-primary font-bold shadow-sm"
                              : "text-cream/60 hover:text-cream hover:bg-secondary/40"
                          }`}
                        >
                          <span>{sub.title}</span>
                          {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer Return & Logout */}
      <div className="p-4 border-t border-accent/20 space-y-2 bg-[#141414]">
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.removeItem("velvet_admin_session");
              window.location.reload();
            } catch (e) {}
          }}
          className="w-full py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out Portal
        </button>
        <Link
          href="/"
          className="w-full py-2 px-3 rounded-xl bg-secondary/80 border border-accent/20 text-cream/80 hover:text-accent text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
        </Link>
      </div>
    </aside>
  );
}
