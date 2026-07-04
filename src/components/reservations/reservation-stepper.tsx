"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Download,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  MapPin,
  PhoneCall,
  Coffee,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { generateIcsContent } from "@/lib/reservations/calendar";

export interface ReservationStepperProps {
  onClose: () => void;
}

interface TimeSlot {
  time: string;
  time12: string;
  available: boolean;
  tableId?: string;
  tableName?: string;
}

export default function ReservationStepper({ onClose }: ReservationStepperProps) {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [guests, setGuests] = useState<number>(2);
  const [isLargeGroup, setIsLargeGroup] = useState<boolean>(false);
  const [seatingType, setSeatingType] = useState<"Indoor" | "Outdoor">("Indoor");
  const [date, setDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [openingHours, setOpeningHours] = useState<{ open: number; close: number } | null>(null);

  // Step 4 Contact fields
  const [name, setName] = useState<string>("Alexander Wright");
  const [email, setEmail] = useState<string>("alexander@velvetroast.com");
  const [phone, setPhone] = useState<string>("+91 98200 11223");
  const [occasion, setOccasion] = useState<string>("Anniversary");
  const [specialRequests, setSpecialRequests] = useState<string>("Quiet corner near the fireplace.");
  const [newsletter, setNewsletter] = useState<boolean>(true);
  const [terms, setTerms] = useState<boolean>(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Submission & Payment State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState<number>(250);
  const [gstAmount, setGstAmount] = useState<number>(45);

  // Initialize date to tomorrow by default
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setDate(d.toISOString().split("T")[0]);
  }, []);

  // Fetch available slots when date or guests change
  useEffect(() => {
    if (!date || isLargeGroup) return;
    setLoadingSlots(true);
    setSelectedSlot(null);

    fetch(`/api/availability?date=${date}&guests=${guests}&seatingType=${seatingType}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.slots) {
          setAvailableSlots(data.slots);
          setOpeningHours(data.openingHours);
        }
      })
      .catch((err) => console.error("Error fetching slots:", err))
      .finally(() => setLoadingSlots(false));
  }, [date, guests, seatingType, isLargeGroup]);

  // Step validation
  const handleNextStep = () => {
    if (step === 1 && isLargeGroup) {
      alert("Thank you! Our private event concierge will call your phone within 2 hours to organize your large group setup.");
      onClose();
      return;
    }
    if (step === 2 && !date) {
      alert("Please select a valid dining date.");
      return;
    }
    if (step === 3 && !selectedSlot) {
      alert("Please choose an available time slot.");
      return;
    }
    if (step === 4) {
      const errs: Record<string, string> = {};
      if (name.trim().length < 2) errs.name = "Please enter your full name";
      if (!email.includes("@")) errs.email = "Please enter a valid email";
      if (phone.trim().length < 10) errs.phone = "Valid phone number required";
      if (!terms) errs.terms = "You must accept reservation terms";

      if (Object.keys(errs).length > 0) {
        setFormErrors(errs);
        return;
      }
      setFormErrors({});
    }

    setStep((prev) => prev + 1);
  };

  const handleCreateAndPay = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create reservation request
      const resResp = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          email,
          phone,
          guests,
          seatingType,
          reservationDate: date,
          reservationTime: selectedSlot?.time,
          occasion,
          specialRequests,
        }),
      });

      const resData = await resResp.json();
      if (!resResp.ok) {
        alert(resData.error || "Failed to reserve table. Please try another slot.");
        setIsSubmitting(false);
        return;
      }

      // Simulate Razorpay Gateway Verification
      setTimeout(async () => {
        const verifyResp = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reservationId: resData.reservation.id,
            razorpayPaymentId: `pay_RzpSim_${Date.now()}`,
            razorpayOrderId: resData.payment?.orderId || "order_sim",
            paymentMethod: "UPI / Card",
          }),
        });

        const verifyData = await verifyResp.json();
        setIsSubmitting(false);

        if (verifyData.success) {
          setConfirmedReservation({
            ...verifyData.reservation,
            tableNumber: resData.table?.tableNumber || "VIP Table",
          });
          setStep(6);
          confetti({
            particleCount: 140,
            spread: 90,
            origin: { y: 0.5 },
            colors: ["#D4AF37", "#F6F2EC", "#C49A6C"],
          });
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const downloadIcs = () => {
    if (!confirmedReservation) return;
    const content = generateIcsContent(confirmedReservation, confirmedReservation.tableNumber);
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${confirmedReservation.reservationNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPdfReceipt = () => {
    alert(`Downloading receipt PDF for ${confirmedReservation?.reservationNumber}. Your deposit receipt has also been emailed to ${email}.`);
  };

  return (
    <div className="w-full text-cream flex flex-col justify-between min-h-[540px]">
      {/* Header Stepper Bar */}
      <div className="mb-6 border-b border-accent/20 pb-5">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-accent mb-3">
          <span>Table Reservation Protocol</span>
          <span>Step {step} of 6</span>
        </div>

        {/* Progress Dots */}
        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s <= step ? "bg-gold-gradient shadow-sm shadow-accent/40" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {/* STEP 1: GUESTS */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="font-serif text-3xl text-cream">Select Party Size</h3>
                <p className="text-sm text-cream/60 mt-1">
                  Choose the number of guests dining at Velvet Roast.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setGuests(num);
                      setIsLargeGroup(false);
                    }}
                    className={`py-5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      guests === num && !isLargeGroup
                        ? "bg-gold-gradient text-primary border-transparent shadow-xl font-bold"
                        : "glass-panel border-accent/20 text-cream/80 hover:border-accent/60"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span className="text-lg font-serif">{num} {num === 1 ? "Guest" : "Guests"}</span>
                  </motion.button>
                ))}

                {/* 7+ Card */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsLargeGroup(true)}
                  className={`col-span-2 py-5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isLargeGroup
                      ? "bg-gold-gradient text-primary border-transparent shadow-xl font-bold"
                      : "glass-panel border-accent/20 text-cream/80 hover:border-accent/60"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-lg font-serif">7+ VIP Group</span>
                </motion.button>
              </div>

              {isLargeGroup && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-accent/10 border border-accent/40 flex items-start gap-4"
                >
                  <PhoneCall className="w-6 h-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif text-lg text-cream">Personal Concierge Service</h4>
                    <p className="text-xs text-cream/70 mt-1 leading-relaxed">
                      For larger gatherings (7+ guests), our private events manager crafts tailored table arrangements and custom multi-course menus. Click continue and we will reach out immediately.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Seating preference */}
              {!isLargeGroup && (
                <div className="pt-4 border-t border-accent/15">
                  <label className="text-xs uppercase tracking-widest text-accent/80 block mb-3 font-medium">
                    Seating Environment Preference
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(["Indoor", "Outdoor"] as const).map((env) => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => setSeatingType(env)}
                        className={`py-3.5 rounded-xl border text-sm uppercase tracking-wider font-medium transition-all cursor-pointer ${
                          seatingType === env
                            ? "bg-[#C49A6C]/20 border-accent text-accent shadow-md"
                            : "bg-secondary/40 border-accent/10 text-cream/60 hover:text-cream"
                        }`}
                      >
                        {env === "Indoor" ? "🏛️ Indoor Roastery Sanctuary" : "🌿 Outdoor Garden Terrace"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: DATE */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="font-serif text-3xl text-cream">Choose Dining Date</h3>
                <p className="text-sm text-cream/60 mt-1">
                  Select your preferred day for {guests} {guests === 1 ? "guest" : "guests"} ({seatingType}).
                </p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-accent/20 space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-accent/90 block mb-2 font-medium">
                    Select Calendar Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-secondary border border-accent/30 text-cream font-serif text-xl focus:border-accent outline-none cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-secondary/60 border border-accent/10 flex items-center justify-between text-xs text-cream/70">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>Opening Hours:</span>
                  </div>
                  <span className="font-semibold text-cream">
                    Mon–Fri: 9am–10pm | Sat: 8am–11pm | Sun: 8am–9pm
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: TIME SLOT */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="font-serif text-3xl text-cream">Select Time Slot</h3>
                <p className="text-sm text-cream/60 mt-1">
                  Available 90-minute dining windows on {date}.
                </p>
              </div>

              {loadingSlots ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs uppercase tracking-widest text-accent/80 animate-pulse">Checking Table Allocations...</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => (
                    <motion.button
                      key={slot.time}
                      whileHover={slot.available ? { scale: 1.05 } : {}}
                      whileTap={slot.available ? { scale: 0.95 } : {}}
                      disabled={!slot.available}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3.5 px-3 rounded-xl border text-center transition-all ${
                        !slot.available
                          ? "bg-secondary/20 border-white/5 text-cream/20 cursor-not-allowed line-through"
                          : selectedSlot?.time === slot.time
                          ? "bg-gold-gradient text-primary font-bold shadow-lg shadow-accent/30 border-transparent scale-105"
                          : "glass-panel border-accent/20 text-cream hover:border-accent cursor-pointer"
                      }`}
                    >
                      <div className="text-sm font-semibold">{slot.time12}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">
                        {slot.available ? "Available" : "Booked"}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: CONTACT & OCCASION */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-2">
                <h3 className="font-serif text-3xl text-cream">Guest Protocol Details</h3>
                <p className="text-xs text-cream/60">We use these details for instant booking confirmation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-accent/20 text-cream text-sm focus:border-accent outline-none"
                    placeholder="Enter full name"
                  />
                  {formErrors.name && <span className="text-red-400 text-[11px] mt-1 block">{formErrors.name}</span>}
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-accent/20 text-cream text-sm focus:border-accent outline-none"
                    placeholder="name@example.com"
                  />
                  {formErrors.email && <span className="text-red-400 text-[11px] mt-1 block">{formErrors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-accent/20 text-cream text-sm focus:border-accent outline-none"
                    placeholder="+91 98000 00000"
                  />
                  {formErrors.phone && <span className="text-red-400 text-[11px] mt-1 block">{formErrors.phone}</span>}
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">Special Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-accent/20 text-cream text-sm focus:border-accent outline-none"
                  >
                    <option value="General Dining">General Dining</option>
                    <option value="Birthday">Birthday Celebration</option>
                    <option value="Anniversary">Romantic Anniversary</option>
                    <option value="Business Meeting">Executive Business Meeting</option>
                    <option value="Date Night">Special Date Night</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-accent/80 block mb-1">Special Requests</label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-accent/20 text-cream text-sm focus:border-accent outline-none"
                  placeholder="Dietary preferences or seating requests..."
                />
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="rounded border-accent/30 text-accent focus:ring-accent"
                  />
                  <span className="text-cream/80">I agree to Velvet Roast's 24-hour cancellation policy and reservation terms.</span>
                </label>
                {formErrors.terms && <span className="text-red-400 text-[11px] block">{formErrors.terms}</span>}
              </div>
            </motion.div>
          )}

          {/* STEP 5: DEPOSIT SUMMARY & PAY */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="font-serif text-3xl text-cream">Reservation Summary & Deposit</h3>
                <p className="text-xs text-cream/60 mt-1">Review your booking before secure payment authorization.</p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-accent/30 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm border-b border-accent/15 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-cream/50 block">Dining Date & Time</span>
                    <strong className="text-accent font-serif text-base">{date} at {selectedSlot?.time12}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-cream/50 block">Party Size & Environment</span>
                    <strong className="text-cream font-serif text-base">{guests} Guests ({seatingType})</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase tracking-wider text-cream/50 block">Guest Protocol</span>
                    <span className="text-cream text-xs">{name} ({phone}) • {occasion}</span>
                  </div>
                </div>

                {/* Deposit Calculation breakdown */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm text-cream/80">
                    <span>Table Reservation Deposit:</span>
                    <span>₹{depositAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cream/80">
                    <span>GST (18%):</span>
                    <span>₹{gstAmount}</span>
                  </div>
                  <div className="flex justify-between font-serif text-xl text-accent pt-2 border-t border-accent/20 font-bold">
                    <span>Total Payable Now:</span>
                    <span>₹{depositAmount + gstAmount}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#C49A6C]/10 border border-accent/30 flex items-center gap-3 text-xs text-cream/80">
                <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                <span>
                  <strong>100% Refundable Deposit:</strong> This deposit will be fully credited against your final dining bill upon completion of your visit.
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 6: CONFIRMED SUCCESS SCREEN */}
          {step === 6 && confirmedReservation && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-2"
            >
              <div className="w-16 h-16 rounded-full bg-gold-gradient text-primary flex items-center justify-center mx-auto shadow-2xl shadow-accent/40 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-accent font-bold block">Instant Confirmation</span>
                <h3 className="font-serif text-3xl sm:text-4xl text-cream mt-1">We Await Your Arrival</h3>
                <p className="text-xs text-cream/60 mt-1">Confirmation email & receipt sent to {confirmedReservation.email}</p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-accent/40 text-left space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-accent/20">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-cream/50 block">Reservation Number</span>
                    <span className="font-serif text-2xl text-accent font-bold">{confirmedReservation.reservationNumber}</span>
                  </div>
                  {/* Decorative QR Code */}
                  <div className="p-2 rounded-xl bg-white text-black flex flex-col items-center justify-center shadow-md">
                    <div className="w-16 h-16 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:6px_6px] border border-black p-1 flex items-center justify-center">
                      <Coffee className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-[7px] font-mono font-bold uppercase mt-1">Scan at Host</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-cream/50 block">Assigned Sanctuary Table</span>
                    <strong className="text-cream text-sm font-serif">{confirmedReservation.tableNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-cream/50 block">Dining Duration</span>
                    <strong className="text-cream text-sm font-serif">90 Minutes Window</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={downloadIcs}
                  className="py-3 px-4 rounded-xl glass-panel border border-accent/30 text-xs uppercase tracking-wider font-semibold text-cream hover:bg-gold-gradient hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4" /> Add to Calendar
                </button>
                <button
                  type="button"
                  onClick={downloadPdfReceipt}
                  className="py-3 px-4 rounded-xl glass-panel border border-accent/30 text-xs uppercase tracking-wider font-semibold text-cream hover:bg-gold-gradient hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Receipt PDF
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Nav Controls */}
      {step < 6 && (
        <div className="flex items-center justify-between pt-6 border-t border-accent/20 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="py-3 px-6 rounded-full glass-panel border border-accent/20 text-xs uppercase tracking-wider text-cream hover:border-accent transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="py-3.5 px-8 rounded-full bg-gold-gradient text-primary font-semibold text-xs tracking-widest uppercase shadow-lg shadow-accent/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer ml-auto"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCreateAndPay}
              className="py-3.5 px-8 rounded-full bg-gold-gradient text-primary font-bold text-xs tracking-widest uppercase shadow-xl shadow-accent/40 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer ml-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Authorizing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> Pay ₹{depositAmount + gstAmount} & Confirm
                </>
              )}
            </button>
          )}
        </div>
      )}

      {step === 6 && (
        <div className="pt-6 border-t border-accent/20 text-center">
          <button
            type="button"
            onClick={onClose}
            className="py-3.5 px-10 rounded-full bg-gold-gradient text-primary font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            Return to Sanctuary Home
          </button>
        </div>
      )}
    </div>
  );
}
