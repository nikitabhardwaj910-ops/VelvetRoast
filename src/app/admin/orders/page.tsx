"use client";

import { useState, useEffect } from "react";
import {
  Utensils,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ArrowLeft,
  Calendar,
  MessageSquare,
  MapPin,
  Coffee,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<"All" | "DineIn" | "Delivery">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/orders");
      const data = await resp.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const resp = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (resp.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesType = filterType === "All" || o.orderType === filterType;
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone?.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const activeCount = orders.filter((o) => !["Completed", "DeliveredToTable"].includes(o.status)).length;
  const dineInCount = orders.filter((o) => o.orderType === "DineIn" && o.status !== "Completed").length;
  const deliveryCount = orders.filter((o) => o.orderType === "Delivery" && o.status !== "Completed").length;

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-cream font-sans pb-16">
      {/* Top Admin Header */}
      <header className="border-b border-accent/20 bg-[#121212] sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-cream/70 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold block">
                Master Kitchen Display System (KDS)
              </span>
              <h1 className="font-serif text-2xl text-cream flex items-center gap-3">
                Live Table & Delivery Orders
                <span className="px-3 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-mono font-bold">
                  {activeCount} Active
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/reservations"
              className="py-2.5 px-4 rounded-xl bg-secondary border border-accent/30 text-xs uppercase tracking-wider font-semibold hover:border-accent flex items-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4 text-accent" /> Switch to Table Reservations
            </Link>
            <button
              onClick={fetchOrders}
              className="p-2.5 rounded-xl bg-secondary text-cream/70 hover:text-accent transition-colors cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* Filter Tabs & Search */}
        <div className="glass-panel p-5 rounded-2xl border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType("All")}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                filterType === "All" ? "bg-gold-gradient text-primary shadow-md" : "bg-secondary/60 text-cream/70"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilterType("DineIn")}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                filterType === "DineIn" ? "bg-gold-gradient text-primary shadow-md" : "bg-secondary/60 text-cream/70"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> Seated Table Dine-In ({dineInCount})
            </button>
            <button
              onClick={() => setFilterType("Delivery")}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                filterType === "Delivery" ? "bg-gold-gradient text-primary shadow-md" : "bg-secondary/60 text-cream/70"
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Online Delivery ({deliveryCount})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-cream/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, Table, or Customer..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/80 border border-accent/20 text-cream text-xs focus:border-accent outline-none"
            />
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-accent/20">
            <Coffee className="w-12 h-12 text-cream/30 mx-auto mb-3" />
            <h3 className="font-serif text-xl text-cream">No active kitchen orders found</h3>
            <p className="text-xs text-cream/60 mt-1">Incoming contactless table orders will appear here instantly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const isDineIn = order.orderType === "DineIn";
              return (
                <div
                  key={order.id}
                  className={`glass-panel rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                    order.status === "Received" || order.status === "Preparing"
                      ? "border-accent shadow-lg shadow-accent/10 bg-[#161412]"
                      : "border-accent/20 bg-[#121212]"
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-accent/15 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-accent font-bold text-sm">{order.orderNumber}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                              isDineIn
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {isDineIn ? <Utensils className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                            {order.orderType}
                          </span>
                        </div>
                        <div className="font-serif font-bold text-cream text-lg mt-1">{order.customerName}</div>
                        <div className="text-xs text-cream/50">{order.phone}</div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-lg font-bold text-accent block">₹{order.totalAmount}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase">Paid Online</span>
                      </div>
                    </div>

                    {/* Table Assignment or Delivery Address */}
                    <div className="mb-4 p-3 rounded-xl bg-secondary/80 border border-accent/20">
                      {isDineIn ? (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          <span className="text-cream/70 font-medium">Seated at:</span>
                          <span className="font-serif font-bold text-cream text-sm">{order.tableNumber}</span>
                        </div>
                      ) : (
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-accent font-semibold">
                            <MapPin className="w-3.5 h-3.5" /> Delivery Coordinates:
                          </div>
                          <div className="text-cream/90 text-[11px] line-clamp-2">{order.deliveryAddress}</div>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] uppercase tracking-wider text-cream/60 font-semibold block">
                        Ordered Items ({order.items?.length || 0})
                      </span>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-[#1a1816] border border-accent/10 text-xs">
                            <div className="flex justify-between font-semibold text-cream">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span className="text-accent">₹{item.price * item.quantity}</span>
                            </div>
                            {item.specialInstructions && (
                              <div className="mt-1 p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-1 font-medium">
                                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                <span>Note: {item.specialInstructions}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* General Order Special Requests */}
                    {order.specialRequests && (
                      <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                        <div className="font-bold flex items-center gap-1.5 text-red-200 mb-1">
                          <MessageSquare className="w-3.5 h-3.5" /> General Kitchen Request:
                        </div>
                        <p className="italic">{order.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer Status & Actions */}
                  <div className="pt-4 border-t border-accent/15 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-cream/60">Kitchen Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full uppercase tracking-wider text-[10px] font-bold ${
                          order.status === "Received"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : order.status === "Preparing"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : order.status === "Ready" || order.status === "OutForDelivery"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {order.status === "Received" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "Preparing")}
                          className="col-span-2 py-2.5 rounded-xl bg-gold-gradient text-primary font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all cursor-pointer"
                        >
                          Start Preparing Food
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, isDineIn ? "DeliveredToTable" : "OutForDelivery")}
                          className="col-span-2 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider shadow-md hover:bg-emerald-400 transition-all cursor-pointer"
                        >
                          {isDineIn ? "Serve to Table Number" : "Dispatch Express Driver"}
                        </button>
                      )}

                      {["OutForDelivery", "DeliveredToTable"].includes(order.status) && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "Completed")}
                          className="col-span-2 py-2.5 rounded-xl bg-secondary border border-accent/40 text-accent font-bold text-xs uppercase tracking-wider hover:bg-accent hover:text-primary transition-all cursor-pointer"
                        >
                          Mark Order Completed
                        </button>
                      )}

                      {order.status === "Completed" && (
                        <div className="col-span-2 text-center py-2 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Served & Closed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
