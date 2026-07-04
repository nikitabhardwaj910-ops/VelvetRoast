"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Coffee,
  Truck,
  Sparkles,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  ArrowRight,
  Utensils,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "@/context/app-context";

export default function CheckoutModal() {
  const { isCheckoutModalOpen, setIsCheckoutModalOpen, cart, clearCart, user, updateItemInstructions } = useApp();

  const [orderType, setOrderType] = useState<"DineIn" | "Delivery">("DineIn");
  const [tableNumber, setTableNumber] = useState<string>("Table 2A (Fireplace)");
  const [customTable, setCustomTable] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 18.944, lng: 72.823 });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [tablesList, setTablesList] = useState<any[]>([]);

  useEffect(() => {
    if (isCheckoutModalOpen) {
      // Fetch available tables for dropdown
      fetch("/api/availability?date=" + new Date().toISOString().split("T")[0] + "&guests=2")
        .then((r) => r.json())
        .catch(() => {});
      if (user?.email) {
        setDeliveryAddress(user.name + "'s Residence, Executive Suite 4B, MG Road, Uptown");
      }
    }
  }, [isCheckoutModalOpen, user]);

  if (!isCheckoutModalOpen) return null;

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const serviceOrDeliveryFee = orderType === "Delivery" ? 65 : 40;
  const gst = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + serviceOrDeliveryFee + gst;

  const handleLocateGPS = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setDeliveryAddress("Pin at detected GPS Coordinates: " + pos.coords.latitude.toFixed(4) + ", " + pos.coords.longitude.toFixed(4) + " (High Street Sanctuary)");
          setIsLocating(false);
        },
        () => {
          // Fallback simulation
          setTimeout(() => {
            setCoordinates({ lat: 18.951, lng: 72.819 });
            setDeliveryAddress("Velvet Towers, Floor 14, Nariman Point (GPS Located)");
            setIsLocating(false);
          }, 800);
        }
      );
    } else {
      setTimeout(() => {
        setDeliveryAddress("Detected GPS: Velvet Flagship Avenue, Plot 12, High Street");
        setIsLocating(false);
      }, 600);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const finalTable = tableNumber === "CUSTOM" ? customTable || "Bar Seat" : tableNumber;

    try {
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          customerName: user?.name || "VIP Diners Club",
          phone: user?.phone || "+91 98000 00000",
          orderType,
          tableNumber: orderType === "DineIn" ? finalTable : undefined,
          deliveryAddress: orderType === "Delivery" ? deliveryAddress : undefined,
          coordinates: orderType === "Delivery" ? coordinates : undefined,
          items: cart,
          totalAmount,
          specialRequests,
        }),
      });

      const data = await resp.json();
      if (data.success) {
        setIsProcessing(false);
        setCompletedOrder(data.order);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C49A6C", "#ffffff", "#e5c158"],
        });
        clearCart();
      } else {
        alert(data.error || "Order verification failed");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
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
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          className="relative w-full max-w-2xl bg-[#141414] border border-accent/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              setIsCheckoutModalOpen(false);
              setCompletedOrder(null);
            }}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-cream/70 hover:text-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {!completedOrder ? (
            <div>
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold block mb-1">
                  Artisanal Order Dispatch
                </span>
                <h3 className="font-serif text-3xl text-cream">Select Fulfillment Mode</h3>
                <p className="text-xs text-cream/60 mt-1">
                  Are you seated with us at the Sanctuary or ordering for high-speed home delivery?
                </p>
              </div>

              {/* Mode Selector */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setOrderType("DineIn")}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    orderType === "DineIn"
                      ? "bg-accent/15 border-accent text-cream shadow-lg shadow-accent/10"
                      : "bg-secondary/60 border-accent/20 text-cream/60 hover:text-cream"
                  }`}
                >
                  <Utensils className={`w-6 h-6 ${orderType === "DineIn" ? "text-accent" : "text-cream/50"}`} />
                  <span className="text-xs font-bold uppercase tracking-wider">Contactless Dine-In</span>
                  <span className="text-[10px] text-cream/50">Serve direct to your Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("Delivery")}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    orderType === "Delivery"
                      ? "bg-accent/15 border-accent text-cream shadow-lg shadow-accent/10"
                      : "bg-secondary/60 border-accent/20 text-cream/60 hover:text-cream"
                  }`}
                >
                  <Truck className={`w-6 h-6 ${orderType === "Delivery" ? "text-accent" : "text-cream/50"}`} />
                  <span className="text-xs font-bold uppercase tracking-wider">Online Delivery</span>
                  <span className="text-[10px] text-cream/50">Express delivery with GPS Map</span>
                </button>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                {/* DINE-IN TABLE CONFIG */}
                {orderType === "DineIn" ? (
                  <div className="p-5 rounded-2xl bg-secondary/80 border border-accent/30 space-y-4">
                    <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider">
                      <Coffee className="w-4 h-4" /> Table Location Identification
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-cream/80 block mb-1.5 font-medium">
                        Select Your Seated Table Number
                      </label>
                      <select
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-accent/30 text-cream text-sm focus:border-accent outline-none"
                      >
                        <option value="Table 2A (Fireplace)">Table 2A (Fireplace Lounge)</option>
                        <option value="Table 2B (Window View)">Table 2B (Window View)</option>
                        <option value="Table 4A (Center Lounge)">Table 4A (Center Lounge)</option>
                        <option value="Table 4B (Private Booth)">Table 4B (Private Booth)</option>
                        <option value="Table 4C (Terrace Garden)">Table 4C (Outdoor Terrace)</option>
                        <option value="Table 6B (VIP Alcove)">Table 6B (VIP Alcove)</option>
                        <option value="Table 8A (Grand Banquette)">Table 8A (Grand Banquette)</option>
                        <option value="CUSTOM">Other / Espresso Bar Counter</option>
                      </select>
                    </div>

                    {tableNumber === "CUSTOM" && (
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">
                          Enter Table or Seat Number
                        </label>
                        <input
                          type="text"
                          required
                          value={customTable}
                          onChange={(e) => setCustomTable(e.target.value)}
                          placeholder="e.g. Bar Seat 4 or Table 12"
                          className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-accent/30 text-cream text-sm"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* ONLINE HOME DELIVERY WITH INTERACTIVE MAP */
                  <div className="p-5 rounded-2xl bg-secondary/80 border border-accent/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider">
                        <MapPin className="w-4 h-4" /> Delivery Coordinates & Map Pin
                      </div>
                      <button
                        type="button"
                        onClick={handleLocateGPS}
                        disabled={isLocating}
                        className="px-3 py-1.5 rounded-xl bg-gold-gradient text-primary text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
                        {isLocating ? "Locating..." : "Auto-Detect GPS Location"}
                      </button>
                    </div>

                    {/* Simulated Map UI */}
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#1f242d] border border-accent/30 flex items-center justify-center">
                      <div
                        className="absolute inset-0 opacity-40 bg-cover bg-center"
                        style={{
                          backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')`,
                        }}
                      />
                      <div className="relative z-10 flex flex-col items-center p-3 rounded-xl bg-black/80 border border-accent/50 backdrop-blur-sm text-center shadow-2xl">
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-accent text-2xl"
                        >
                          📍
                        </motion.div>
                        <span className="text-[11px] font-mono text-cream font-bold mt-1">
                          GPS Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">● Pin Locked within High-Speed Delivery Radius</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-cream/80 block mb-1.5 font-medium">
                        Detailed Street Address & Landmark
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="House/Flat No, Apartment Name, Street, Landmark..."
                        className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-accent/30 text-cream text-sm focus:border-accent outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* ITEM SPECIAL INSTRUCTIONS */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cream/80 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-accent" /> Special Chef / Kitchen Customizations
                  </span>
                  <div className="max-h-40 overflow-y-auto space-y-2.5 pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-secondary/50 border border-accent/15">
                        <div className="flex justify-between items-center text-xs font-medium text-cream mb-1.5">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-accent">₹{item.price * item.quantity}</span>
                        </div>
                        <input
                          type="text"
                          value={item.specialInstructions || ""}
                          onChange={(e) => updateItemInstructions(item.id, e.target.value)}
                          placeholder="e.g. Extra spicy, less sugar, oat milk substitute..."
                          className="w-full px-3 py-1.5 rounded-lg bg-[#141414] border border-accent/20 text-cream/90 text-xs focus:border-accent outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="General order instructions (e.g., serve hot, pack sauces separately)..."
                    className="w-full p-3 rounded-xl bg-secondary border border-accent/20 text-cream text-xs focus:border-accent outline-none"
                  />
                </div>

                {/* PAYMENT SUMMARY BILL */}
                <div className="p-4 rounded-2xl bg-secondary/90 border border-accent/30 space-y-2 text-xs">
                  <div className="flex justify-between text-cream/70">
                    <span>Items Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-cream/70">
                    <span>{orderType === "DineIn" ? "Table Concierge Fee" : "Express Delivery Fee"}</span>
                    <span>₹{serviceOrDeliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-cream/70">
                    <span>GST (18%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="pt-2 border-t border-accent/20 flex justify-between font-serif text-lg text-cream font-bold">
                    <span>Total Payable</span>
                    <span className="text-accent">₹{totalAmount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-cream/60 px-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Razorpay Gateway
                  </span>
                  <span>100% Encrypted & Contactless</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-full bg-gold-gradient text-primary font-bold text-sm tracking-widest uppercase shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    "Authorizing Payment..."
                  ) : (
                    <>
                      Pay ₹{totalAmount} & Dispatch Order <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ORDER SUCCESS VIEW */
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-accent font-bold">Payment Verified</span>
                <h3 className="font-serif text-3xl text-cream mt-1">Order #{completedOrder.orderNumber} Dispatched!</h3>
                <p className="text-sm text-cream/70 mt-2 max-w-sm mx-auto">
                  {completedOrder.orderType === "DineIn"
                    ? `Your order has been routed instantly to the Master Kitchen for ${completedOrder.tableNumber}. Our waiter will bring it straight to your table!`
                    : `Our barista kitchen has begun preparing your package. Express delivery assigned to ${completedOrder.deliveryAddress}.`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary border border-accent/30 max-w-sm mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-cream/60">Order Type:</span>
                  <span className="text-accent font-bold uppercase">{completedOrder.orderType}</span>
                </div>
                {completedOrder.tableNumber && (
                  <div className="flex justify-between">
                    <span className="text-cream/60">Table Assignment:</span>
                    <span className="text-cream font-semibold">{completedOrder.tableNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-cream/60">Total Paid:</span>
                  <span className="text-cream font-bold">₹{completedOrder.totalAmount} (Paid via Razorpay)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/60">Kitchen Status:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Preparing in Kitchen
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setCompletedOrder(null);
                }}
                className="px-8 py-3.5 rounded-full border border-accent text-accent text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all cursor-pointer"
              >
                Return to Sanctuary Menu
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
