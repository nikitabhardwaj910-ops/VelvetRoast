"use client";

import { useState, useEffect } from "react";
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
  Search,
  RefreshCw,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Coffee,
  DollarSign,
  Star,
  Award,
  Filter,
  Download,
  Trash2,
  Edit3,
  ShieldCheck,
  ChevronRight,
  Truck,
  Utensils,
  Eye,
} from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function MasterAdminSuite() {
  const [activeModule, setActiveModule] = useState<string>("Dashboard");
  const [activeSubModule, setActiveSubModule] = useState<string>("Dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sample local state for dynamic toggles
  const [inventoryItems, setInventoryItems] = useState([
    { id: "inv-1", name: "Ethiopian Yirgacheffe Single-Origin Beans", stock: 85, unit: "kg", status: "Optimal" },
    { id: "inv-2", name: "Belgian Dark Cocoa Mass (72%)", stock: 18, unit: "kg", status: "Low Stock" },
    { id: "inv-3", name: "Organic Barista Oat Milk", stock: 120, unit: "liters", status: "Optimal" },
    { id: "inv-4", name: "White Alba Truffle Oil", stock: 5, unit: "bottles", status: "Critical" },
  ]);

  const [menuItems, setMenuItems] = useState([
    { id: "m-1", name: "Velvet Signature Espresso", category: "Espresso Bar", price: 349, available: true },
    { id: "m-2", name: "Belgian Dark Chocolate Croissant", category: "Artisanal Pastries", price: 289, available: true },
    { id: "m-3", name: "Truffle Mushroom Brioche", category: "Savory Brunch", price: 549, available: true },
    { id: "m-4", name: "Gold Dust Iced Cappuccino", category: "Signature Roasts", price: 449, available: false },
  ]);

  const [promos, setPromos] = useState([
    { id: "p-1", code: "VELVET20", discount: "20% OFF", usage: 142, status: "Active" },
    { id: "p-2", code: "VIPBRUNCH", discount: "₹500 OFF on Tables", usage: 89, status: "Active" },
    { id: "p-3", code: "SUNDAYGOLD", discount: "Complimentary Dessert", usage: 34, status: "Expired" },
  ]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const resp = await fetch("/api/orders");
      const data = await resp.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeSubModule === "Online Orders" && o.orderType !== "Delivery") return false;
    if (activeSubModule === "Dine-In Orders" && o.orderType !== "DineIn") return false;
    if (activeSubModule === "Order History" && o.status !== "Completed") return false;
    if (activeSubModule === "Upcoming Orders" && o.status === "Completed") return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.tableNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#0E0E0E]">
      {/* Sidebar */}
      <AdminSidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeSubModule={activeSubModule}
        setActiveSubModule={setActiveSubModule}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-accent/20 px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
              <span>Velvet Roast OS</span>
              <span>/</span>
              <span>{activeModule}</span>
              {activeSubModule !== activeModule && (
                <>
                  <span>/</span>
                  <span className="text-cream">{activeSubModule}</span>
                </>
              )}
            </div>
            <h1 className="font-serif text-2xl text-cream font-bold mt-0.5">{activeSubModule} Suite</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-cream/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeSubModule}...`}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1a1a1a] border border-accent/20 text-cream text-xs focus:border-accent outline-none"
              />
            </div>

            <button
              onClick={fetchOrders}
              title="Refresh Live Data"
              className="p-2.5 rounded-xl bg-secondary border border-accent/20 text-cream/70 hover:text-accent transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? "animate-spin" : ""}`} />
            </button>

            <div className="flex items-center gap-3.5 pl-4 border-l border-accent/20">
              <div className="text-right hidden md:block">
                <span className="text-xs font-bold text-cream block leading-none">Concierge Master</span>
                <span className="text-[10px] text-emerald-400 font-semibold">● System Online</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent text-accent font-serif font-bold flex items-center justify-center text-sm">
                M
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 space-y-8 max-w-7xl">
          {/* ======================================================== */}
          {/* 1. DASHBOARD OVERVIEW */}
          {/* ======================================================== */}
          {activeModule === "Dashboard" && (
            <div className="space-y-8 animate-fade-in">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="glass-panel p-6 rounded-3xl border border-accent/30 bg-gradient-to-br from-[#181614] to-[#111111]">
                  <div className="flex items-center justify-between text-cream/60 text-xs font-semibold mb-3">
                    <span>Daily Revenue</span>
                    <DollarSign className="w-4 h-4 text-accent" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-cream">₹48,920</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs previous Friday
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-accent/30 bg-gradient-to-br from-[#181614] to-[#111111]">
                  <div className="flex items-center justify-between text-cream/60 text-xs font-semibold mb-3">
                    <span>Active Kitchen Orders</span>
                    <Package className="w-4 h-4 text-accent" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-cream">
                    {orders.filter((o) => o.status !== "Completed").length || 6}
                  </div>
                  <div className="text-[11px] text-amber-400 font-medium mt-2">● Routing directly to Master Kitchen</div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-accent/30 bg-gradient-to-br from-[#181614] to-[#111111]">
                  <div className="flex items-center justify-between text-cream/60 text-xs font-semibold mb-3">
                    <span>Sanctuary Occupancy</span>
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-cream">84%</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-2">8 of 10 VIP Tables Reserved</div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-accent/30 bg-gradient-to-br from-[#181614] to-[#111111]">
                  <div className="flex items-center justify-between text-cream/60 text-xs font-semibold mb-3">
                    <span>VIP Member Check-Ins</span>
                    <Award className="w-4 h-4 text-accent" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-cream">24</div>
                  <div className="text-[11px] text-cream/60 font-medium mt-2">Loyalty points tier active</div>
                </div>
              </div>

              {/* Quick Actions & Live Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-accent/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-cream font-bold">Live Order & Kitchen Feed</h3>
                    <button
                      onClick={() => {
                        setActiveModule("Orders");
                        setActiveSubModule("Dine-In Orders");
                      }}
                      className="text-xs text-accent font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All Orders <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 4).map((ord, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-secondary/70 border border-accent/15 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                              ord.orderType === "DineIn"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-blue-500/20 text-blue-300"
                            }`}
                          >
                            {ord.orderType === "DineIn" ? <Utensils className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-semibold text-cream text-sm">
                              {ord.customerName} ({ord.orderNumber})
                            </div>
                            <div className="text-xs text-cream/50">
                              {ord.orderType === "DineIn" ? ord.tableNumber : ord.deliveryAddress?.slice(0, 35) + "..."}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-serif font-bold text-accent text-sm block">₹{ord.totalAmount}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-accent/20 space-y-4">
                  <h3 className="font-serif text-lg text-cream font-bold">Executive Actions</h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setActiveModule("Reservations");
                        setActiveSubModule("Table Management");
                      }}
                      className="w-full p-4 rounded-2xl bg-secondary/80 border border-accent/20 hover:border-accent text-left transition-all group cursor-pointer"
                    >
                      <div className="font-bold text-cream text-xs flex items-center justify-between">
                        <span>Modify Table Allocations</span>
                        <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-[11px] text-cream/50 mt-0.5">Adjust capacity for Fireplace & Terrace tables</p>
                    </button>

                    <button
                      onClick={() => {
                        setActiveModule("Menu");
                        setActiveSubModule("Inventory");
                      }}
                      className="w-full p-4 rounded-2xl bg-secondary/80 border border-accent/20 hover:border-accent text-left transition-all group cursor-pointer"
                    >
                      <div className="font-bold text-cream text-xs flex items-center justify-between">
                        <span>Review Critical Stock</span>
                        <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-[11px] text-cream/50 mt-0.5">Truffle oil & dark cocoa supplies low</p>
                    </button>

                    <button
                      onClick={() => {
                        setActiveModule("Promotions");
                      }}
                      className="w-full p-4 rounded-2xl bg-secondary/80 border border-accent/20 hover:border-accent text-left transition-all group cursor-pointer"
                    >
                      <div className="font-bold text-cream text-xs flex items-center justify-between">
                        <span>Generate VIP Promo Code</span>
                        <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-[11px] text-cream/50 mt-0.5">Create custom vouchers for loyalty members</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. ORDERS MODULE */}
          {/* ======================================================== */}
          {activeModule === "Orders" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary/60 p-4 rounded-2xl border border-accent/20">
                <div className="flex gap-2">
                  {["Online Orders", "Dine-In Orders", "Upcoming Orders", "Order History"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSubModule(tab)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeSubModule === tab
                          ? "bg-gold-gradient text-primary shadow-md"
                          : "text-cream/60 hover:text-cream bg-secondary"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-accent font-semibold font-mono">
                  Showing {filteredOrders.length} records
                </span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 glass-panel rounded-3xl border border-accent/20">
                  <Package className="w-12 h-12 text-cream/30 mx-auto mb-3" />
                  <h3 className="font-serif text-xl text-cream">No matching orders found in {activeSubModule}</h3>
                  <p className="text-xs text-cream/60 mt-1">Orders matching this filter criteria will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((ord) => {
                    const isDineIn = ord.orderType === "DineIn";
                    return (
                      <div
                        key={ord.id}
                        className="glass-panel rounded-3xl border border-accent/25 p-6 flex flex-col justify-between bg-[#151312]"
                      >
                        <div>
                          <div className="flex justify-between items-start border-b border-accent/15 pb-3 mb-3">
                            <div>
                              <span className="font-mono text-accent font-bold text-sm">{ord.orderNumber}</span>
                              <div className="font-serif font-bold text-cream text-lg mt-0.5">{ord.customerName}</div>
                              <div className="text-xs text-cream/50">{ord.phone}</div>
                            </div>
                            <div className="text-right">
                              <span className="font-serif font-bold text-accent text-lg block">₹{ord.totalAmount}</span>
                              <span className="text-[10px] uppercase font-bold text-emerald-400">Paid Razorpay</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-secondary/80 border border-accent/15 mb-3 text-xs">
                            {isDineIn ? (
                              <div className="flex items-center gap-2">
                                <Utensils className="w-3.5 h-3.5 text-accent" />
                                <span className="text-cream font-bold">{ord.tableNumber}</span>
                              </div>
                            ) : (
                              <div className="flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                <span className="text-cream/90 line-clamp-2">{ord.deliveryAddress}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5 mb-4 max-h-36 overflow-y-auto">
                            {ord.items?.map((item: any, idx: number) => (
                              <div key={idx} className="p-2 rounded bg-black/40 border border-accent/10 text-xs">
                                <div className="flex justify-between text-cream font-medium">
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="text-accent">₹{item.price * item.quantity}</span>
                                </div>
                                {item.specialInstructions && (
                                  <div className="text-[10px] text-amber-400 italic mt-0.5">Note: {item.specialInstructions}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-accent/15 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent">
                            {ord.status}
                          </span>

                          {ord.status !== "Completed" && (
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(
                                  ord.id,
                                  ord.status === "Received"
                                    ? "Preparing"
                                    : ord.status === "Preparing"
                                    ? isDineIn
                                      ? "DeliveredToTable"
                                      : "OutForDelivery"
                                    : "Completed"
                                )
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-gold-gradient text-primary text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all cursor-pointer"
                            >
                              Advance Status
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. RESERVATIONS MODULE */}
          {/* ======================================================== */}
          {activeModule === "Reservations" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex gap-2 bg-secondary/60 p-3 rounded-2xl border border-accent/20 w-fit">
                {["Calendar", "Table Management", "Waitlist"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubModule(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeSubModule === sub ? "bg-gold-gradient text-primary" : "text-cream/60 hover:text-cream"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {activeSubModule === "Calendar" && (
                <div className="glass-panel p-6 rounded-3xl border border-accent/25 space-y-4">
                  <h3 className="font-serif text-xl text-cream font-bold">Sanctuary Reservation Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-[#161412] border border-accent/30">
                      <div className="text-xs text-accent font-semibold uppercase">19:00 Slot (Dinner Service)</div>
                      <div className="font-serif text-lg text-cream font-bold mt-1">Vikramaditya Singhania (Table 2A)</div>
                      <div className="text-xs text-cream/60">Occasion: Anniversary ● Deposit ₹250 Paid</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#161412] border border-accent/30">
                      <div className="text-xs text-accent font-semibold uppercase">20:30 Slot (Evening Lounge)</div>
                      <div className="font-serif text-lg text-cream font-bold mt-1">Ananya Sharma (Table 4A)</div>
                      <div className="text-xs text-cream/60">Occasion: Birthday ● Custom Tiramisu Requested</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#161412] border border-accent/30">
                      <div className="text-xs text-accent font-semibold uppercase">Tomorrow 13:00 (Brunch)</div>
                      <div className="font-serif text-lg text-cream font-bold mt-1">Rohan Kapoor (Table 6B)</div>
                      <div className="text-xs text-cream/60">Occasion: Business Meeting ● Quiet Corner</div>
                    </div>
                  </div>
                </div>
              )}

              {activeSubModule === "Table Management" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: "2a", name: "Table 2A (Fireplace)", cap: 2, loc: "Indoor", status: "Reserved" },
                    { id: "2b", name: "Table 2B (Window View)", cap: 2, loc: "Indoor", status: "Available" },
                    { id: "4a", name: "Table 4A (Center Lounge)", cap: 4, loc: "Indoor", status: "Reserved" },
                    { id: "4b", name: "Table 4B (Private Booth)", cap: 4, loc: "Indoor", status: "Available" },
                    { id: "4c", name: "Table 4C (Terrace Garden)", cap: 4, loc: "Outdoor", status: "Available" },
                    { id: "6b", name: "Table 6B (VIP Alcove)", cap: 6, loc: "Indoor", status: "Reserved Tomorrow" },
                    { id: "8a", name: "Table 8A (Grand Banquette)", cap: 8, loc: "Indoor", status: "Available" },
                  ].map((tbl, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-2xl border border-accent/20 bg-[#141414]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-serif font-bold text-cream text-base">{tbl.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tbl.status.includes("Reserved") ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          {tbl.status}
                        </span>
                      </div>
                      <div className="text-xs text-cream/60">Capacity: {tbl.cap} Guests ● {tbl.loc} Sanctuary</div>
                    </div>
                  ))}
                </div>
              )}

              {activeSubModule === "Waitlist" && (
                <div className="glass-panel p-6 rounded-3xl border border-accent/20 text-center py-12">
                  <Clock className="w-10 h-10 text-accent mx-auto mb-2" />
                  <h4 className="font-serif text-lg text-cream font-bold">Walk-In Waitlist Empty</h4>
                  <p className="text-xs text-cream/60">All current seated walk-ins have been accommodated immediately.</p>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. MENU MODULE (Categories, Items, Combos, Inventory) */}
          {/* ======================================================== */}
          {activeModule === "Menu" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex gap-2 bg-secondary/60 p-3 rounded-2xl border border-accent/20 w-fit">
                {["Categories", "Items", "Combos", "Inventory"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubModule(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeSubModule === sub ? "bg-gold-gradient text-primary" : "text-cream/60 hover:text-cream"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {activeSubModule === "Items" && (
                <div className="glass-panel rounded-3xl border border-accent/20 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1a1a1a] text-accent uppercase tracking-wider font-semibold border-b border-accent/20">
                      <tr>
                        <th className="p-4">Item Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price (INR)</th>
                        <th className="p-4">Stock Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/10">
                      {menuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-secondary/40">
                          <td className="p-4 font-serif font-bold text-cream text-sm">{item.name}</td>
                          <td className="p-4 text-cream/70">{item.category}</td>
                          <td className="p-4 font-bold text-accent">₹{item.price}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                item.available ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {item.available ? "Available" : "Sold Out"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setMenuItems((prev) =>
                                  prev.map((m) => (m.id === item.id ? { ...m, available: !m.available } : m))
                                );
                              }}
                              className="px-3 py-1 rounded-lg bg-secondary border border-accent/30 text-cream text-xs hover:border-accent transition-all cursor-pointer"
                            >
                              Toggle Availability
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeSubModule === "Inventory" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inventoryItems.map((inv) => (
                    <div key={inv.id} className="glass-panel p-5 rounded-2xl border border-accent/20 bg-[#141414]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-serif font-bold text-cream text-sm">{inv.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.status === "Optimal"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : inv.status === "Low Stock"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div className="text-xs text-cream/70">
                        Current Stock Level: <strong className="text-accent">{inv.stock} {inv.unit}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {["Categories", "Combos"].includes(activeSubModule) && (
                <div className="glass-panel p-8 rounded-3xl border border-accent/20 text-center space-y-3">
                  <UtensilsCrossed className="w-10 h-10 text-accent mx-auto" />
                  <h3 className="font-serif text-xl text-cream font-bold">{activeSubModule} Configuration Active</h3>
                  <p className="text-xs text-cream/60 max-w-md mx-auto">
                    Manage curated pairings like the Signature Tasting Trio and Espresso Flights directly in this module.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. CUSTOMERS MODULE */}
          {/* ======================================================== */}
          {activeModule === "Customers" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-accent/30 bg-[#161412]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                        Platinum VIP
                      </span>
                      <h4 className="font-serif text-lg text-cream font-bold mt-2">Vikramaditya Singhania</h4>
                      <p className="text-xs text-cream/50">vikram@singhania.com</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-xl font-bold text-accent">1,450</span>
                      <span className="text-[10px] text-cream/60 block">Loyalty Points</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-accent/30 bg-[#161412]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-bold uppercase">
                        Gold Tier
                      </span>
                      <h4 className="font-serif text-lg text-cream font-bold mt-2">Ananya Sharma</h4>
                      <p className="text-xs text-cream/50">ananya.s@techcorp.io</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-xl font-bold text-accent">890</span>
                      <span className="text-[10px] text-cream/60 block">Loyalty Points</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-accent/30 bg-[#161412]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-bold uppercase">
                        Gold Tier
                      </span>
                      <h4 className="font-serif text-lg text-cream font-bold mt-2">Rohan Kapoor</h4>
                      <p className="text-xs text-cream/50">rohan.kapoor@vcpartners.com</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-xl font-bold text-accent">720</span>
                      <span className="text-[10px] text-cream/60 block">Loyalty Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. PAYMENTS LEDGER */}
          {/* ======================================================== */}
          {activeModule === "Payments" && (
            <div className="glass-panel rounded-3xl border border-accent/20 p-6 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl text-cream font-bold">Razorpay Transaction Ledger</h3>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  All Gateways Verified
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-4 rounded-xl bg-secondary border border-accent/15 flex justify-between items-center">
                  <div>
                    <strong className="text-cream font-serif text-sm">pay_RzpDine991</strong>
                    <span className="text-cream/50 block">Vikramaditya Singhania ● Contactless Table Order</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-accent text-sm">₹1,247</span>
                    <span className="text-[10px] text-emerald-400 block">Paid via UPI</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-secondary border border-accent/15 flex justify-between items-center">
                  <div>
                    <strong className="text-cream font-serif text-sm">pay_Rzp98231aXk</strong>
                    <span className="text-cream/50 block">Vikramaditya Singhania ● Reservation Pre-authorization</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-accent text-sm">₹295</span>
                    <span className="text-[10px] text-emerald-400 block">Paid via Razorpay</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 7 - 11. REMAINING MODULES (Analytics, Gallery, Promos, Employees, Settings) */}
          {/* ======================================================== */}
          {["Analytics", "Gallery", "Promotions", "Employees", "Notifications", "Settings"].includes(activeModule) && (
            <div className="glass-panel p-8 rounded-3xl border border-accent/20 space-y-6 animate-fade-in">
              {activeModule === "Promotions" ? (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-cream font-bold flex items-center gap-2">
                    <Gift className="w-5 h-5 text-accent" /> Active VIP Promo Codes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {promos.map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl bg-[#141414] border border-accent/25">
                        <div className="font-mono font-bold text-accent text-lg">{p.code}</div>
                        <div className="text-cream font-semibold text-sm mt-1">{p.discount}</div>
                        <div className="text-xs text-cream/50 mt-2">Redeemed {p.usage} times ● {p.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Settings className="w-12 h-12 text-accent mx-auto animate-spin-slow" />
                  <h3 className="font-serif text-2xl text-cream font-bold">{activeModule} Management Engine</h3>
                  <p className="text-xs text-cream/60 max-w-lg mx-auto leading-relaxed">
                    All administrative parameters for <strong>{activeModule}</strong> are synchronized with the luxury Sanctuary backend. Live API updates apply in real time across customer applications.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
