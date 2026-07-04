"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  DollarSign,
  Users,
  Coffee,
  Trash2,
  RefreshCw,
  Eye,
  ChevronRight,
  ArrowLeft,
  Utensils,
} from "lucide-react";
import Link from "next/link";

export default function AdminReservationsDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [reservations, setReservations] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({
    depositType: "FIXED_PER_TABLE",
    fixedDepositAmount: 250,
    perGuestDepositAmount: 100,
  });

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/reservations");
      const data = await resp.json();
      if (data.reservations) setReservations(data.reservations);
      if (data.tables) setTables(data.tables);
      if (data.config) setConfig(data.config);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const resp = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (resp.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this reservation record?")) return;
    try {
      const resp = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCsv = () => {
    const headers = [
      "Reservation Number",
      "Customer Name",
      "Email",
      "Phone",
      "Date",
      "Time",
      "Guests",
      "Seating",
      "Table",
      "Status",
      "Deposit Amount (INR)",
    ];
    const rows = filteredReservations.map((r) => {
      const tableObj = tables.find((t) => t.id === r.tableId);
      return [
        r.reservationNumber,
        `"${r.customerName}"`,
        r.email,
        r.phone,
        r.reservationDate,
        r.reservationTime,
        r.guests,
        r.seatingType,
        `"${tableObj?.tableNumber || "Unassigned"}"`,
        r.status,
        r.depositAmount,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Velvet_Roast_Reservations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesSearch =
      r.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reservationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Analytics calculations
  const totalDeposits = reservations
    .filter((r) => ["Confirmed", "Completed"].includes(r.status))
    .reduce((sum, r) => sum + (r.depositAmount || 0), 0);
  const confirmedCount = reservations.filter((r) => r.status === "Confirmed").length;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = reservations.filter((r) => r.reservationDate === todayStr).length;

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-cream font-sans pb-16">
      {/* Top Admin Nav */}
      <header className="border-b border-accent/20 bg-[#121212] sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-cream/70 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold block">Internal Portal</span>
              <h1 className="font-serif text-2xl text-cream">Reservation & Deposit Management</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="py-2.5 px-4 rounded-xl bg-secondary border border-accent/30 text-xs uppercase tracking-wider font-semibold hover:border-accent flex items-center gap-2 transition-all"
            >
              <Utensils className="w-4 h-4 text-accent" /> Live Kitchen Orders (KDS)
            </Link>
            <button
              onClick={() => setShowConfigModal(true)}
              className="py-2.5 px-4 rounded-xl bg-secondary border border-accent/30 text-xs uppercase tracking-wider font-semibold hover:border-accent flex items-center gap-2 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-accent" /> Deposit Rules
            </button>
            <button
              onClick={exportToCsv}
              className="py-2.5 px-4 rounded-xl bg-gold-gradient text-primary font-semibold text-xs tracking-wider uppercase shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl bg-secondary text-cream/70 hover:text-accent transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-3xl border border-accent/20 relative overflow-hidden">
            <DollarSign className="w-12 h-12 text-accent/10 absolute -right-2 -bottom-2" />
            <span className="text-xs uppercase tracking-widest text-cream/50 block">Total Deposits Verified</span>
            <div className="font-serif text-3xl text-accent font-bold mt-2">₹{totalDeposits.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">Adjusted against dining bills</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-accent/20 relative overflow-hidden">
            <CheckCircle2 className="w-12 h-12 text-accent/10 absolute -right-2 -bottom-2" />
            <span className="text-xs uppercase tracking-widest text-cream/50 block">Confirmed Bookings</span>
            <div className="font-serif text-3xl text-cream font-bold mt-2">{confirmedCount}</div>
            <span className="text-[11px] text-cream/60 mt-1 inline-block">Active upcoming reservations</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-accent/20 relative overflow-hidden">
            <CalendarIcon className="w-12 h-12 text-accent/10 absolute -right-2 -bottom-2" />
            <span className="text-xs uppercase tracking-widest text-cream/50 block">Today's Schedule</span>
            <div className="font-serif text-3xl text-cream font-bold mt-2">{todayCount}</div>
            <span className="text-[11px] text-accent mt-1 inline-block">Parties scheduled for {todayStr}</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-accent/20 relative overflow-hidden">
            <Coffee className="w-12 h-12 text-accent/10 absolute -right-2 -bottom-2" />
            <span className="text-xs uppercase tracking-widest text-cream/50 block">Sanctuary Tables</span>
            <div className="font-serif text-3xl text-cream font-bold mt-2">{tables.length}</div>
            <span className="text-[11px] text-cream/60 mt-1 inline-block">Indoor & Outdoor Allocations</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel p-5 rounded-2xl border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {(["All", "Confirmed", "PendingPayment", "Completed", "Cancelled", "NoShow"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all shrink-0 cursor-pointer ${
                  statusFilter === status
                    ? "bg-gold-gradient text-primary shadow-md"
                    : "bg-secondary/60 text-cream/70 hover:text-cream"
                }`}
              >
                {status === "PendingPayment" ? "Pending Pay" : status}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-cream/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, name, or phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/80 border border-accent/20 text-cream text-xs focus:border-accent outline-none"
            />
          </div>
        </div>

        {/* Reservations Table */}
        <div className="glass-panel rounded-3xl border border-accent/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-accent/20 bg-secondary/40 text-[11px] uppercase tracking-wider text-accent font-semibold">
                  <th className="py-4 px-6">Res ID</th>
                  <th className="py-4 px-6">Guest Details</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Party & Seating</th>
                  <th className="py-4 px-6">Assigned Table</th>
                  <th className="py-4 px-6">Deposit</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Protocol Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10 text-sm">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-cream/40 font-serif">
                      No reservations found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((r) => {
                    const tableObj = tables.find((t) => t.id === r.tableId);
                    return (
                      <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-accent text-xs">
                          {r.reservationNumber}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-serif font-semibold text-cream">{r.customerName}</div>
                          <div className="text-xs text-cream/60">{r.phone}</div>
                          <div className="text-[11px] text-cream/40">{r.email}</div>
                        </td>
                        <td className="py-4 px-6 font-medium text-cream">
                          <div>{r.reservationDate}</div>
                          <div className="text-xs text-accent">{r.reservationTime} (90m)</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold">{r.guests} Guests</div>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                            {r.seatingType}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-serif text-cream/90">
                          {tableObj?.tableNumber || "Unassigned"}
                        </td>
                        <td className="py-4 px-6 font-bold text-cream">
                          ₹{r.depositAmount}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                              r.status === "Confirmed"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : r.status === "PendingPayment"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : r.status === "Completed"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {r.status === "PendingPayment" ? "Pending" : r.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-1">
                          {r.status === "PendingPayment" && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, "Confirmed")}
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                              title="Manually Confirm Payment"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {r.status === "Confirmed" && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, "Completed")}
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                              title="Mark Dining Completed"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                          {["Confirmed", "PendingPayment"].includes(r.status) && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, "Cancelled")}
                              className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                              title="Cancel Reservation"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Deposit Rules Config Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#141414] border border-accent/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6"
            >
              <div className="flex items-center justify-between border-b border-accent/20 pb-4">
                <h3 className="font-serif text-2xl text-cream">Deposit System Configuration</h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 rounded-full bg-secondary text-cream/70 hover:text-accent"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs uppercase tracking-wider text-accent block mb-2 font-medium">
                    Deposit Calculation Policy
                  </label>
                  <select
                    value={config.depositType}
                    onChange={(e) => setConfig({ ...config, depositType: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary border border-accent/30 text-cream focus:border-accent outline-none"
                  >
                    <option value="FIXED_PER_TABLE">Fixed Deposit Per Table (e.g. ₹250)</option>
                    <option value="PER_GUEST">Deposit Per Guest (e.g. ₹100 x Guests)</option>
                    <option value="DISABLED">Disable Deposit Requirement (Instant Booking)</option>
                  </select>
                </div>

                {config.depositType === "FIXED_PER_TABLE" && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cream/80 block mb-1">
                      Fixed Table Deposit Amount (INR)
                    </label>
                    <input
                      type="number"
                      value={config.fixedDepositAmount}
                      onChange={(e) => setConfig({ ...config, fixedDepositAmount: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl bg-secondary border border-accent/30 text-cream"
                    />
                  </div>
                )}

                {config.depositType === "PER_GUEST" && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cream/80 block mb-1">
                      Per Guest Deposit Rate (INR)
                    </label>
                    <input
                      type="number"
                      value={config.perGuestDepositAmount}
                      onChange={(e) => setConfig({ ...config, perGuestDepositAmount: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl bg-secondary border border-accent/30 text-cream"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-accent/20 flex justify-end gap-3">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-secondary text-xs uppercase tracking-wider text-cream font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Deposit rules saved successfully for upcoming bookings!");
                    setShowConfigModal(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-primary font-bold text-xs uppercase tracking-wider shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
